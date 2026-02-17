// Client-side filtering engine

import type { Employee } from '../types/data.types';
import type { FilterCondition } from '../types/filter.types';
import { getFieldDefinition } from './fieldConfig';

/**
 * Get nested property value from object using dot notation
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Apply text filter operators
 */
const applyTextFilter = (value: any, operator: string, filterValue: string): boolean => {
  if (value == null) return false;
  
  const stringValue = String(value).toLowerCase();
  const filterLower = filterValue.toLowerCase();

  switch (operator) {
    case 'equals':
      return stringValue === filterLower;
    case 'contains':
      return stringValue.includes(filterLower);
    case 'startsWith':
      return stringValue.startsWith(filterLower);
    case 'endsWith':
      return stringValue.endsWith(filterLower);
    case 'doesNotContain':
      return !stringValue.includes(filterLower);
    default:
      return false;
  }
};

/**
 * Apply number filter operators
 */
const applyNumberFilter = (value: any, operator: string, filterValue: number): boolean => {
  if (value == null) return false;
  
  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  switch (operator) {
    case 'equals':
      return numValue === filterValue;
    case 'greaterThan':
      return numValue > filterValue;
    case 'lessThan':
      return numValue < filterValue;
    case 'greaterThanOrEqual':
      return numValue >= filterValue;
    case 'lessThanOrEqual':
      return numValue <= filterValue;
    default:
      return false;
  }
};

/**
 * Apply date filter operators
 */
const applyDateFilter = (value: any, operator: string, filterValue: { start: string; end: string }): boolean => {
  if (value == null || !filterValue.start || !filterValue.end) return false;

  const dateValue = new Date(value);
  const startDate = new Date(filterValue.start);
  const endDate = new Date(filterValue.end);

  if (isNaN(dateValue.getTime())) return false;

  switch (operator) {
    case 'between':
      return dateValue >= startDate && dateValue <= endDate;
    default:
      return false;
  }
};

/**
 * Apply amount filter operators (similar to date range)
 */
const applyAmountFilter = (value: any, operator: string, filterValue: { min: number; max: number }): boolean => {
  if (value == null) return false;
  
  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  switch (operator) {
    case 'between':
      return numValue >= filterValue.min && numValue <= filterValue.max;
    default:
      return false;
  }
};

/**
 * Apply single select filter operators
 */
const applySingleSelectFilter = (value: any, operator: string, filterValue: any): boolean => {
  if (value == null) return false;

  switch (operator) {
    case 'is':
      return value === filterValue;
    case 'isNot':
      return value !== filterValue;
    default:
      return false;
  }
};

/**
 * Apply multi-select filter operators (for array fields)
 */
const applyMultiSelectFilter = (value: any, operator: string, filterValue: any[]): boolean => {
  if (!Array.isArray(value)) return false;
  if (!Array.isArray(filterValue) || filterValue.length === 0) return false;

  switch (operator) {
    case 'in':
      // Check if the array contains ANY of the filter values
      return filterValue.some(fv => value.includes(fv));
    case 'notIn':
      // Check if the array contains NONE of the filter values
      return !filterValue.some(fv => value.includes(fv));
    default:
      return false;
  }
};

/**
 * Apply boolean filter operators
 */
const applyBooleanFilter = (value: any, operator: string, filterValue: boolean): boolean => {
  if (value == null) return false;

  switch (operator) {
    case 'is':
      return Boolean(value) === filterValue;
    default:
      return false;
  }
};

/**
 * Apply a single filter condition to an employee record
 */
const applySingleCondition = (employee: Employee, condition: FilterCondition): boolean => {
  const fieldDef = getFieldDefinition(condition.field);
  if (!fieldDef) return false;

  // Get the actual value from the employee record
  const fieldPath = fieldDef.path || condition.field;
  const value = getNestedValue(employee, fieldPath);

  // Apply the appropriate filter based on field type
  switch (condition.fieldType) {
    case 'text':
      return applyTextFilter(value, condition.operator, condition.value);
    
    case 'number':
      return applyNumberFilter(value, condition.operator, condition.value);
    
    case 'date':
      return applyDateFilter(value, condition.operator, condition.value);
    
    case 'amount':
      return applyAmountFilter(value, condition.operator, condition.value);
    
    case 'singleSelect':
      return applySingleSelectFilter(value, condition.operator, condition.value);
    
    case 'multiSelect':
      return applyMultiSelectFilter(value, condition.operator, condition.value);
    
    case 'boolean':
      return applyBooleanFilter(value, condition.operator, condition.value);
    
    default:
      return false;
  }
};

/**
 * Filter employees based on multiple conditions
 * Uses AND logic between different conditions
 */
export const filterEmployees = (
  employees: Employee[],
  conditions: FilterCondition[]
): Employee[] => {
  // If no conditions, return all employees
  if (conditions.length === 0) {
    return employees;
  }

  // Filter employees where ALL conditions are met (AND logic)
  return employees.filter(employee => {
    return conditions.every(condition => {
      // Skip invalid conditions
      if (!condition.field || !condition.operator) {
        return true;
      }

      // Check if value is provided (required for most operators)
      if (condition.value === undefined || condition.value === null || condition.value === '') {
        // For array/object values, check if they're empty
        if (Array.isArray(condition.value) && condition.value.length === 0) {
          return true;
        }
        if (typeof condition.value === 'object' && Object.keys(condition.value).length === 0) {
          return true;
        }
        return true;
      }

      return applySingleCondition(employee, condition);
    });
  });
};

/**
 * Validate a filter condition
 */
export const validateCondition = (condition: FilterCondition): { valid: boolean; error?: string } => {
  if (!condition.field) {
    return { valid: false, error: 'Field is required' };
  }

  if (!condition.operator) {
    return { valid: false, error: 'Operator is required' };
  }

  // Check value based on field type
  switch (condition.fieldType) {
    case 'text':
      if (!condition.value || condition.value.trim() === '') {
        return { valid: false, error: 'Value is required' };
      }
      break;

    case 'number':
      if (condition.value === null || condition.value === undefined || condition.value === '') {
        return { valid: false, error: 'Value is required' };
      }
      if (isNaN(Number(condition.value))) {
        return { valid: false, error: 'Value must be a number' };
      }
      break;

    case 'date':
      if (!condition.value?.start || !condition.value?.end) {
        return { valid: false, error: 'Both start and end dates are required' };
      }
      break;

    case 'amount':
      if (condition.value?.min === undefined || condition.value?.max === undefined) {
        return { valid: false, error: 'Both min and max values are required' };
      }
      if (isNaN(Number(condition.value.min)) || isNaN(Number(condition.value.max))) {
        return { valid: false, error: 'Values must be numbers' };
      }
      if (condition.value.min > condition.value.max) {
        return { valid: false, error: 'Min value cannot be greater than max value' };
      }
      break;

    case 'singleSelect':
      if (!condition.value) {
        return { valid: false, error: 'Value is required' };
      }
      break;

    case 'multiSelect':
      if (!Array.isArray(condition.value) || condition.value.length === 0) {
        return { valid: false, error: 'At least one value is required' };
      }
      break;

    case 'boolean':
      if (condition.value === null || condition.value === undefined) {
        return { valid: false, error: 'Value is required' };
      }
      break;
  }

  return { valid: true };
};