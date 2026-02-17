// Filter-related type definitions

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'amount' 
  | 'singleSelect' 
  | 'multiSelect' 
  | 'boolean';

export type TextOperator = 
  | 'equals' 
  | 'contains' 
  | 'startsWith' 
  | 'endsWith' 
  | 'doesNotContain';

export type NumberOperator = 
  | 'equals' 
  | 'greaterThan' 
  | 'lessThan' 
  | 'greaterThanOrEqual' 
  | 'lessThanOrEqual';

export type DateOperator = 'between';
export type AmountOperator = 'between';
export type SingleSelectOperator = 'is' | 'isNot';
export type MultiSelectOperator = 'in' | 'notIn';
export type BooleanOperator = 'is';

export type Operator = 
  | TextOperator 
  | NumberOperator 
  | DateOperator 
  | AmountOperator 
  | SingleSelectOperator 
  | MultiSelectOperator 
  | BooleanOperator;

export interface FilterCondition {
  id: string;
  field: string;
  fieldType: FieldType;
  operator: Operator;
  value: any;
}

export interface FilterState {
  conditions: FilterCondition[];
}

export interface OperatorOption {
  value: Operator;
  label: string;
}