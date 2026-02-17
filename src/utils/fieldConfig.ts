// Field configuration and operator mappings
// This module defines all available fields for filtering and their associated operators
// Serves as the single source of truth for filter configuration

import type { FieldDefinition } from '../types/field.types';
import type { Operator } from '../types/filter.types';

/**
 * Maps each operator type to its human-readable label
 * Used in the UI to display operator options to the user
 */
export const OPERATOR_LABELS: Record<Operator, string> = {
  // Text operators - for string field comparisons
  equals: 'Equals',
  contains: 'Contains',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  doesNotContain: 'Does Not Contain',
  
  // Number operators - for numeric comparisons
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than or Equal',
  lessThanOrEqual: 'Less Than or Equal',
  
  // Date/Amount operators - for range filtering
  between: 'Between',
  
  // Select operators - for categorical fields
  is: 'Is',
  isNot: 'Is Not',
  in: 'In',
  notIn: 'Not In',
};

/**
 * Complete list of field definitions used in the application
 * Each field definition specifies its type, available operators, and options (if applicable)
 * This configuration drives the filter builder UI
 */
export const fieldDefinitions: FieldDefinition[] = [
  // ===== TEXT FIELDS =====
  // Text fields support substring matching and pattern-based operators
  {
    key: 'name',
    label: 'Name',
    type: 'text',
    // Text operators: exact match, substring search, prefix/suffix matching
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  {
    key: 'role',
    label: 'Role',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
  },
  
  // ===== SINGLE SELECT FIELDS =====
  // Users must select exactly one option from a predefined list
  {
    key: 'department',
    label: 'Department',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    // Define the available department options
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'HR', label: 'HR' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Operations', label: 'Operations' },
    ],
  },
  
  // ===== NUMERIC FIELDS =====
  // Number fields support range comparisons: >, <, >=, <=, equals
  {
    key: 'salary',
    label: 'Salary',
    type: 'number',
    operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  },
  {
    key: 'projects',
    label: 'Projects',
    type: 'number',
    operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  },
  {
    key: 'performanceRating',
    label: 'Performance Rating',
    type: 'number',
    operators: ['equals', 'greaterThan', 'lessThan', 'greaterThanOrEqual', 'lessThanOrEqual'],
  },
  
  // ===== DATE FIELDS =====
  // Date fields support between operator for range filtering
  {
    key: 'joinDate',
    label: 'Join Date',
    type: 'date',
    operators: ['between'],
  },
  {
    key: 'lastReview',
    label: 'Last Review',
    type: 'date',
    operators: ['between'],
  },
  
  // ===== AMOUNT/CURRENCY FIELD =====
  // Currency range filter - supports "between" operator for min/max ranges
  {
    key: 'salaryRange',
    label: 'Salary Range',
    type: 'amount',
    operators: ['between'],
    // Maps to the salary field in the actual data structure
    path: 'salary',
  },
  
  // ===== MULTI-SELECT FIELD =====
  // Users can select multiple options from a predefined list
  // Supports "in" (has any) and "notIn" (has none) operators
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiSelect',
    operators: ['in', 'notIn'],
    // Define available skills that employees can have
    options: [
      { value: 'React', label: 'React' },
      { value: 'TypeScript', label: 'TypeScript' },
      { value: 'Node.js', label: 'Node.js' },
      { value: 'GraphQL', label: 'GraphQL' },
      { value: 'Python', label: 'Python' },
      { value: 'Java', label: 'Java' },
      { value: 'AWS', label: 'AWS' },
      { value: 'Docker', label: 'Docker' },
      { value: 'Kubernetes', label: 'Kubernetes' },
      { value: 'MongoDB', label: 'MongoDB' },
    ],
  },
  
  // ===== BOOLEAN FIELD =====
  // True/false field for binary status indicators
  {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean',
    operators: ['is'],
  },
  
  // ===== NESTED OBJECT FIELDS =====
  // These fields demonstrate filtering on nested properties (e.g., address.city)
  {
    key: 'address.city',
    label: 'City',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
    // The 'path' property tells the filter engine where to find this value in the data
    path: 'address.city',
  },
  {
    key: 'address.state',
    label: 'State',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
    // The 'path' property tells the filter engine where to find this value in the data
    path: 'address.state',
  },
];

/**
 * Look up a field definition by its key
 * Returns the complete field configuration including type and operators
 * Returns undefined if the field is not found
 * @param fieldKey - The unique identifier for the field
 * @returns The field definition or undefined
 */
export const getFieldDefinition = (fieldKey: string): FieldDefinition | undefined => {
  return fieldDefinitions.find(f => f.key === fieldKey);
};

/**
 * Get all available operators for a specific field
 * Returns an empty array if the field is not found
 * @param fieldKey - The unique identifier for the field
 * @returns Array of operator keys for this field
 */
export const getOperatorsForField = (fieldKey: string): Operator[] => {
  const field = getFieldDefinition(fieldKey);
  return field?.operators || [];
};