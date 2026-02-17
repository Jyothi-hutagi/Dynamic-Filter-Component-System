import React from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { fieldDefinitions } from '../../utils/fieldConfig';

interface FieldSelectorProps {
  value: string;
  onChange: (fieldKey: string) => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({ value, onChange }) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }} fullWidth>
      <InputLabel>Field</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label="Field"
      >
        <MenuItem value="" disabled>
          Select field
        </MenuItem>
        {fieldDefinitions.map((field) => (
          <MenuItem key={field.key} value={field.key}>
            {field.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};