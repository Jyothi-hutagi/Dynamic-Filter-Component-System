// Client-side filtering engine
// This module provides the core filtering logic for the application
// It handles different filter types (text, number, date, etc.) and applies AND logic across multiple conditions

import type { Employee } from '../types/data.types';
import type { FilterCondition } from '../types/filter.types';
import { getFieldDefinition } from './fieldConfig';

/**
 * Get nested property value from object using dot notation
 * Safely traverses object hierarchies using dot-separated paths
 * @example getNestedValue({address: {city: 'SF'}}, 'address.city') => 'SF'
 */
const getNestedValue = (obj: any, path: string): any => {
  // Split path by dots and use reduce to traverse each level
  // Optional chaining (?.) ensures undefined is returned if any level is null/undefined
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Apply text filter operators with case-insensitive matching
 * Handles all string-based comparisons for text fields
 * @param value - The actual field value from the employee record
 * @param operator - The text operator to apply (equals, contains, startsWith, etc.)
 * @param filterValue - The user-provided filter value to compare against
 * @returns true if the value matches the filter criteria
 */
const applyTextFilter = (value: any, operator: string, filterValue: string): boolean => {
  // Return false if the field has no value
  if (value == null) return false;
  
  // Convert both values to lowercase for case-insensitive comparison
  const stringValue = String(value).toLowerCase();
  const filterLower = filterValue.toLowerCase();

  switch (operator) {
    // Exact match: entire string must equal the filter value
    case 'equals':
      return stringValue === filterLower;
    
    // Contains: filter value must appear anywhere in the string
    case 'contains':
      return stringValue.includes(filterLower);
    
    // StartsWith: string must begin with the filter value
    case 'startsWith':
      return stringValue.startsWith(filterLower);
    
    // EndsWith: string must end with the filter value
    case 'endsWith':
      return stringValue.endsWith(filterLower);
    
    // DoesNotContain: inverse of contains - filter value should NOT appear
    case 'doesNotContain':
      return !stringValue.includes(filterLower);
    
    default:
      return false;
  }
};

/**
 * Apply numeric filter operators
 * Supports range comparisons and equality checks on numeric fields
 * @param value - The numeric field value from the employee record
 * @param operator - The numeric operator (>, <, >=, <=, equals)
 * @param filterValue - The threshold value to compare against
 * @returns true if the value satisfies the numeric comparison
 */
const applyNumberFilter = (value: any, operator: string, filterValue: number): boolean => {
  // Return false if field is empty
  if (value == null) return false;
  
  // Convert to number and validate it's a valid numeric value
  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  switch (operator) {
    // Direct equality comparison
    case 'equals':
      return numValue === filterValue;
    
    // Greater than comparison (strict)
    case 'greaterThan':
      return numValue > filterValue;
    
    // Less than comparison (strict)
    case 'lessThan':
      return numValue < filterValue;
    
    // Greater than or equal comparison
    case 'greaterThanOrEqual':
      return numValue >= filterValue;
    
    // Less than or equal comparison
    case 'lessThanOrEqual':
      return numValue <= filterValue;
    
    default:
      return false;
  }
};

/**
 * Apply date range filter
 * Checks if a date falls between two bounds (inclusive on both ends)
 * @param value - The date field value from the employee record
 * @param operator - Should always be 'between' for date filters
 * @param filterValue - Object with start and end date strings (YYYY-MM-DD format)
 * @returns true if the date is within the specified range
 */
const applyDateFilter = (value: any, operator: string, filterValue: { start: string; end: string }): boolean => {
  // Return false if any required value is missing
  if (value == null || !filterValue.start || !filterValue.end) return false;

  // Parse the date values into Date objects for comparison
  const dateValue = new Date(value);
  const startDate = new Date(filterValue.start);
  const endDate = new Date(filterValue.end);

  // Validate that the date was parsed correctly (invalid dates return NaN for getTime())
  if (isNaN(dateValue.getTime())) return false;

  switch (operator) {
    // Check if date is between start and end dates (inclusive on both ends)
    case 'between':
      return dateValue >= startDate && dateValue <= endDate;
    
    default:
      return false;
  }
};

/**
 * Apply amount/currency range filter
 * Similar to date range but for numeric currency fields
 * Allows filtering on salary ranges or budget amounts
 * @param value - The amount value from the employee record
 * @param operator - Should always be 'between' for amount filters
 * @param filterValue - Object with min and max amount values
 * @returns true if the amount is within the specified range
 */
const applyAmountFilter = (value: any, operator: string, filterValue: { min: number; max: number }): boolean => {
  // Return false if field is empty
  if (value == null) return false;
  
  // Parse the value as a number
  const numValue = Number(value);
  if (isNaN(numValue)) return false;

  switch (operator) {
    // Check if amount is between min and max (inclusive)
    case 'between':
      return numValue >= filterValue.min && numValue <= filterValue.max;
    
    default:
      return false;
  }
};

/**
 * Apply single select filter operators
 * Used for dropdown fields with one predefined option selected
 * @param value - The selected value from the employee record
 * @param operator - 'is' for match, 'isNot' for non-match
 * @param filterValue - The value to compare against
 * @returns true if the comparison matches the operator
 */
const applySingleSelectFilter = (value: any, operator: string, filterValue: any): boolean => {
  // Return false if field has no value
  if (value == null) return false;

  switch (operator) {
    // Value must equal the filter value (strict equality)
    case 'is':
      return value === filterValue;
    
    // Value must not equal the filter value (strict inequality)
    case 'isNot':
      return value !== filterValue;
    
    default:
      return false;
  }
};

/**
 * Apply multi-select filter operators
 * Used for array fields (e.g., skills, tags) where multiple values can be selected
 * Supports "any of" and "none of" logic for flexible filtering
 * @param value - The array of values from the employee record (e.g., [React, Node.js])
 * @param operator - 'in' for any match, 'notIn' for no matches
 * @param filterValue - Array of values to check against
 * @returns true if the array satisfies the filter criteria
 */
const applyMultiSelectFilter = (value: any, operator: string, filterValue: any[]): boolean => {
  // Ensure the field value is actually an array
  if (!Array.isArray(value)) return false;
  
  // Ensure filter values are provided as a non-empty array
  if (!Array.isArray(filterValue) || filterValue.length === 0) return false;

  switch (operator) {
    // 'in' operator: return true if the array contains ANY of the selected filter values
    // Example: Employee skills [React, Node.js], filter is [React, Python]
    // Result: true because React is present in both arrays ("has AT LEAST ONE")
    case 'in':
      return filterValue.some(fv => value.includes(fv));
    
    // 'notIn' operator: return true if the array contains NONE of the selected filter values
    // Example: Employee skills [React, Node.js], filter is [Python, Java]
    // Result: true because neither Python nor Java appear in the employee's skills ("has NONE")
    case 'notIn':
      return !filterValue.some(fv => value.includes(fv));
    
    default:
      return false;
  }
};

/**
 * Apply boolean filter operators
 * Used for true/false fields (e.g., active status, verified, etc.)
 * @param value - The boolean value from the employee record
 * @param operator - Should always be 'is' for boolean filters
 * @param filterValue - The boolean value to match (true or false)
 * @returns true if the value matches the filter
 */
const applyBooleanFilter = (value: any, operator: string, filterValue: boolean): boolean => {
  // Return false if field has no value
  if (value == null) return false;

  switch (operator) {
    // Convert value to boolean and compare with filter value
    case 'is':
      return Boolean(value) === filterValue;
    
    default:
      return false;
  }
};

/**
 * Apply a single filter condition to an employee record
 * This is the core filtering logic that determines if one condition matches an employee
 * Routes to the appropriate filter function based on the field type
 * @param employee - The employee record to evaluate
 * @param condition - The filter condition to apply
 * @returns true if the employee matches this condition
 */
const applySingleCondition = (employee: Employee, condition: FilterCondition): boolean => {
  // Look up the field definition to get metadata (path, type, operators, etc.)
  const fieldDef = getFieldDefinition(condition.field);
  if (!fieldDef) return false;

  // Get the actual value from the employee record
  // Use the 'path' property for nested fields like 'address.city' and 'address.state'
  const fieldPath = fieldDef.path || condition.field;
  const value = getNestedValue(employee, fieldPath);

  // Apply the appropriate filter function based on the field type
  // Each field type has its own filter logic (text, number, date, etc.)
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
 * Uses AND logic: an employee must match ALL conditions to be included in results
 * @param employees - The full list of employee records to filter
 * @param conditions - Array of filter conditions to apply
 * @returns Filtered array of employees matching all conditions
 * 
 * @example
 * // Filter for active employees in engineering making > $80k
 * const results = filterEmployees(employees, [
 *   { field: 'department', operator: 'is', value: 'Engineering' },
 *   { field: 'salary', operator: 'greaterThan', value: 80000 },
 *   { field: 'isActive', operator: 'is', value: true }
 * ]);
 * // Returns only employees who match ALL three conditions
 */
export const filterEmployees = (
  employees: Employee[],
  conditions: FilterCondition[]
): Employee[] => {
  // If no conditions provided, return all employees unfiltered
  if (conditions.length === 0) {
    return employees;
  }

  // Use Array.filter() to keep only employees that match ALL conditions
  // Array.every() ensures every condition returns true for an employee to be included
  return employees.filter(employee => {
    return conditions.every(condition => {
      // Skip incomplete conditions that don't have required field or operator
      // Treating incomplete conditions as passive filters (doesn't exclude employees)
      if (!condition.field || !condition.operator) {
        return true; // Don't filter if condition is incomplete
      }

      // Skip conditions with missing values
      // Different field types handle missing values differently:
      if (condition.value === undefined || condition.value === null || condition.value === '') {
        // For array/object values, also check if they're empty
        if (Array.isArray(condition.value) && condition.value.length === 0) {
          return true; // Empty array means no filter applied
        }
        if (typeof condition.value === 'object' && Object.keys(condition.value).length === 0) {
          return true; // Empty object means no filter applied
        }
        return true; // Missing value means don't filter
      }

      // Apply the actual filter condition to this employee
      return applySingleCondition(employee, condition);
    });
  });
};

/**
 * Validate a filter condition before applying it
 * Ensures all required fields are present and have valid values
 * Provides detailed error messages for invalid conditions
 * @param condition - The filter condition to validate
 * @returns Object with valid boolean and optional error message explaining why it's invalid
 */
export const validateCondition = (condition: FilterCondition): { valid: boolean; error?: string } => {
  // Check that a field has been selected
  if (!condition.field) {
    return { valid: false, error: 'Field is required' };
  }

  // Check that an operator has been selected
  if (!condition.operator) {
    return { valid: false, error: 'Operator is required' };
  }

  // Validate the value based on the field type
  // Different field types have different validation rules
  switch (condition.fieldType) {
    // Text fields require a non-empty string value
    case 'text':
      if (!condition.value || condition.value.trim() === '') {
        return { valid: false, error: 'Value is required' };
      }
      break;

    // Number fields must be valid numeric values
    case 'number':
      if (condition.value === null || condition.value === undefined || condition.value === '') {
        return { valid: false, error: 'Value is required' };
      }
      if (isNaN(Number(condition.value))) {
        return { valid: false, error: 'Value must be a number' };
      }
      break;

    // Date fields require both start and end dates for range filtering
    case 'date':
      if (!condition.value?.start || !condition.value?.end) {
        return { valid: false, error: 'Both start and end dates are required' };
      }
      break;

    // Amount fields require both min and max values with validation that min <= max
    case 'amount':
      if (condition.value?.min === undefined || condition.value?.max === undefined) {
        return { valid: false, error: 'Both min and max values are required' };
      }
      if (isNaN(Number(condition.value.min)) || isNaN(Number(condition.value.max))) {
        return { valid: false, error: 'Values must be numbers' };
      }
      // Prevent illogical ranges where minimum is greater than maximum
      if (condition.value.min > condition.value.max) {
        return { valid: false, error: 'Min value cannot be greater than max value' };
      }
      break;

    // Single select fields require one value to be chosen
    case 'singleSelect':
      if (!condition.value) {
        return { valid: false, error: 'Value is required' };
      }
      break;

    // Multi-select fields require at least one value to be chosen
    case 'multiSelect':
      if (!Array.isArray(condition.value) || condition.value.length === 0) {
        return { valid: false, error: 'At least one value is required' };
      }
      break;

    // Boolean fields require an explicit true/false value
    case 'boolean':
      if (condition.value === null || condition.value === undefined) {
        return { valid: false, error: 'Value is required' };
      }
      break;
  }

  // If we get here, all validations passed
  return { valid: true };
};