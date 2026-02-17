// Field configuration type definitions

import type { FieldType, Operator } from './filter.types';

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  operators: Operator[];
  options?: { value: any; label: string }[];
  path?: string; // For nested fields like 'address.city'
}

export interface FieldConfig {
  fields: FieldDefinition[];
}