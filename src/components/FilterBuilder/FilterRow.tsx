import React from 'react';
import { Box, IconButton, Stack, Alert } from '@mui/material';
import { Trash2 } from 'lucide-react';
import type { FilterCondition, Operator } from '../../types/filter.types';
import { FieldSelector } from './FieldSelector';
import { OperatorSelector } from './OperatorSelector';
import { ValueInput } from './ValueInput';
import { getFieldDefinition } from '../../utils/fieldConfig';

interface FilterRowProps {
  condition: FilterCondition;
  onUpdate: (condition: FilterCondition) => void;
  onRemove: () => void;
  showError?: boolean;
  errorMessage?: string;
}

export const FilterRow: React.FC<FilterRowProps> = ({
  condition,
  onUpdate,
  onRemove,
  showError = false,
  errorMessage = '',
}) => {
  const handleFieldChange = (fieldKey: string) => {
    const fieldDef = getFieldDefinition(fieldKey);
    if (!fieldDef) return;

    onUpdate({
      ...condition,
      field: fieldKey,
      fieldType: fieldDef.type,
      operator: '' as Operator,
      value: getDefaultValue(fieldDef.type),
    });
  };

  const handleOperatorChange = (operator: Operator) => {
    onUpdate({
      ...condition,
      operator,
      value: getDefaultValue(condition.fieldType),
    });
  };

  const handleValueChange = (value: any) => {
    onUpdate({
      ...condition,
      value,
    });
  };

  const getDefaultValue = (fieldType: string) => {
    switch (fieldType) {
      case 'date':
        return { start: '', end: '' };
      case 'amount':
        return { min: 0, max: 0 };
      case 'multiSelect':
        return [];
      case 'boolean':
        return false;
      case 'number':
        return null;
      default:
        return '';
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1.5,
          flexWrap: 'wrap',
          p: 2,
          backgroundColor: showError ? '#ffe8e8' : '#f5f5f5',
          borderRadius: 1,
          border: showError ? '1px solid #ef4444' : 'none',
        }}
      >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ flex: 1 }}>
        <Box sx={{ flex: '0 1 200px' }}>
          <FieldSelector value={condition.field} onChange={handleFieldChange} />
        </Box>

        <Box sx={{ flex: '0 1 180px' }}>
          <OperatorSelector
            fieldKey={condition.field}
            value={condition.operator}
            onChange={handleOperatorChange}
          />
        </Box>

        {condition.field && condition.operator && (
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <ValueInput
              fieldKey={condition.field}
              fieldType={condition.fieldType}
              operator={condition.operator}
              value={condition.value}
              onChange={handleValueChange}
            />
          </Box>
        )}
      </Stack>

      <IconButton
        size="small"
        color="error"
        onClick={onRemove}
        aria-label="Remove filter"
        sx={{ mt: 0.5 }}
      >
        <Trash2 size={18} />
      </IconButton>
      </Box>

      {showError && errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <strong>Error:</strong> {errorMessage}
        </Alert>
      )}
    </Box>
  );
};