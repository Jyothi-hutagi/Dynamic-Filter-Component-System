// Field configuration and operator mappings

import type { FieldDefinition } from '../types/field.types';
import type { Operator } from '../types/filter.types';

export const OPERATOR_LABELS: Record<Operator, string> = {
  // Text operators
  equals: 'Equals',
  contains: 'Contains',
  startsWith: 'Starts With',
  endsWith: 'Ends With',
  doesNotContain: 'Does Not Contain',
  
  // Number operators
  greaterThan: 'Greater Than',
  lessThan: 'Less Than',
  greaterThanOrEqual: 'Greater Than or Equal',
  lessThanOrEqual: 'Less Than or Equal',
  
  // Date/Amount operators
  between: 'Between',
  
  // Select operators
  is: 'Is',
  isNot: 'Is Not',
  in: 'In',
  notIn: 'Not In',
};

export const fieldDefinitions: FieldDefinition[] = [
  // Text fields
  {
    key: 'name',
    label: 'Name',
    type: 'text',
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
  
  // Single select fields
  {
    key: 'department',
    label: 'Department',
    type: 'singleSelect',
    operators: ['is', 'isNot'],
    options: [
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Marketing', label: 'Marketing' },
      { value: 'HR', label: 'HR' },
      { value: 'Finance', label: 'Finance' },
      { value: 'Operations', label: 'Operations' },
    ],
  },
  
  // Number fields
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
  
  // Date fields
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
  
  // Amount field
  {
    key: 'salaryRange',
    label: 'Salary Range',
    type: 'amount',
    operators: ['between'],
    path: 'salary', // Maps to salary field
  },
  
  // Multi-select field
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiSelect',
    operators: ['in', 'notIn'],
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
  
  // Boolean field
  {
    key: 'isActive',
    label: 'Active Status',
    type: 'boolean',
    operators: ['is'],
  },
  
  // Nested object field
  {
    key: 'address.city',
    label: 'City',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
    path: 'address.city',
  },
  {
    key: 'address.state',
    label: 'State',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith', 'endsWith', 'doesNotContain'],
    path: 'address.state',
  },
];

export const getFieldDefinition = (fieldKey: string): FieldDefinition | undefined => {
  return fieldDefinitions.find(f => f.key === fieldKey);
};

export const getOperatorsForField = (fieldKey: string): Operator[] => {
  const field = getFieldDefinition(fieldKey);
  return field?.operators || [];
};