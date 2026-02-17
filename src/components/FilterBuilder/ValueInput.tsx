// ValueInput component - renders appropriate input based on field type

import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  OutlinedInput,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { FieldType } from '../../types/filter.types';
import { getFieldDefinition } from '../../utils/fieldConfig';

interface ValueInputProps {
  fieldKey: string;
  fieldType: FieldType;
  operator: string;
  value: any;
  onChange: (value: any) => void;
}

export const ValueInput: React.FC<ValueInputProps> = ({
  fieldKey,
  fieldType,
  value,
  onChange,
}) => {
  const fieldDef = getFieldDefinition(fieldKey);

  // Text input
  if (fieldType === 'text') {
    return (
      <TextField
        size="small"
        placeholder="Enter value"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        sx={{ minWidth: 200 }}
      />
    );
  }

  // Number input
  if (fieldType === 'number') {
    return (
      <TextField
        size="small"
        type="number"
        placeholder="Enter number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        sx={{ minWidth: 150 }}
      />
    );
  }

  // Date range picker
  if (fieldType === 'date') {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <DatePicker
            label="Start Date"
            value={value?.start ? dayjs(value.start) : null}
            onChange={(newValue: Dayjs | null) => {
              onChange({
                ...value,
                start: newValue ? newValue.format('YYYY-MM-DD') : '',
              });
            }}
            slotProps={{ textField: { size: 'small' } }}
          />
          <span>to</span>
          <DatePicker
            label="End Date"
            value={value?.end ? dayjs(value.end) : null}
            onChange={(newValue: Dayjs | null) => {
              onChange({
                ...value,
                end: newValue ? newValue.format('YYYY-MM-DD') : '',
              });
            }}
            slotProps={{ textField: { size: 'small' } }}
          />
        </Box>
      </LocalizationProvider>
    );
  }

  // Amount range input
  if (fieldType === 'amount') {
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          type="number"
          label="Min"
          value={value?.min ?? ''}
          onChange={(e) => {
            onChange({
              ...value,
              min: e.target.value ? Number(e.target.value) : 0,
            });
          }}
          sx={{ width: 120 }}
        />
        <span>to</span>
        <TextField
          size="small"
          type="number"
          label="Max"
          value={value?.max ?? ''}
          onChange={(e) => {
            onChange({
              ...value,
              max: e.target.value ? Number(e.target.value) : 0,
            });
          }}
          sx={{ width: 120 }}
        />
      </Box>
    );
  }

  // Single select dropdown
  if (fieldType === 'singleSelect') {
    return (
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select
          value={value || ''}
          onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select option
          </MenuItem>
          {fieldDef?.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // Multi-select dropdown
  if (fieldType === 'multiSelect') {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <FormControl size="small" sx={{ minWidth: 250 }}>
        <Select
          multiple
          value={selectedValues as unknown as string}
          onChange={(e) => {
            const selectedValue = e.target.value;
            onChange(typeof selectedValue === 'string' ? selectedValue.split(',') : selectedValue);
          }}
          input={<OutlinedInput />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {(selected as unknown as string[]).map((val: string) => {
                const option = fieldDef?.options?.find((o) => o.value === val);
                return <Chip key={val} label={option?.label || val} size="small" />;
              })}
            </Box>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {fieldDef?.options?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={selectedValues.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // Boolean toggle/switch
  if (fieldType === 'boolean') {
    return (
      <FormControlLabel
        control={
          <Switch
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
        }
        label={value ? 'True' : 'False'}
      />
    );
  }

  return null;
};