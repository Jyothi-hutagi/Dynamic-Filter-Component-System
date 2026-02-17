import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { Operator } from '../../types/filter.types';
import { getOperatorsForField, OPERATOR_LABELS } from '../../utils/fieldConfig';

interface OperatorSelectorProps {
  fieldKey: string;
  value: Operator | '';
  onChange: (operator: Operator) => void;
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({
  fieldKey,
  value,
  onChange,
}) => {
  const operators = getOperatorsForField(fieldKey);

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as Operator);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 180 }} fullWidth disabled={!fieldKey}>
      <InputLabel>Operator</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label="Operator"
      >
        <MenuItem value="" disabled>
          Select operator
        </MenuItem>
        {operators.map((operator) => (
          <MenuItem key={operator} value={operator}>
            {OPERATOR_LABELS[operator]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};