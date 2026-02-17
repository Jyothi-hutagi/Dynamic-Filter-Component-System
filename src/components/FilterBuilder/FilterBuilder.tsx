import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper, Divider, Stack } from '@mui/material';
import { Plus, Filter, X } from 'lucide-react';
import type { FilterCondition, FieldType, Operator } from '../../types/filter.types';
import { FilterRow } from './FilterRow';
import { validateCondition } from '../../utils/filterEngine';

interface FilterBuilderProps {
  onFiltersChange: (conditions: FilterCondition[]) => void;
}

export const FilterBuilder: React.FC<FilterBuilderProps> = ({ onFiltersChange }) => {
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [validationErrors, setValidationErrors] = useState<Map<string, string>>(new Map());
  const [applied, setApplied] = useState(false);
  const [attemptedApply, setAttemptedApply] = useState(false);

  const generateId = () => `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleAddFilter = () => {
    const newCondition: FilterCondition = {
      id: generateId(),
      field: '',
      fieldType: 'text' as FieldType,
      operator: '' as Operator,
      value: '',
    };
    setConditions([...conditions, newCondition]);
    setAttemptedApply(false);
  };

  const handleUpdateFilter = (id: string, updatedCondition: FilterCondition) => {
    const newConditions = conditions.map((c) => (c.id === id ? updatedCondition : c));
    setConditions(newConditions);

    if (attemptedApply) {
      const validation = validateCondition(updatedCondition);
      const newErrors = new Map(validationErrors);

      if (!validation.valid && validation.error) {
        newErrors.set(id, validation.error);
      } else {
        newErrors.delete(id);
      }
      setValidationErrors(newErrors);
    }
  };

  const handleRemoveFilter = (id: string) => {
    const newConditions = conditions.filter((c) => c.id !== id);
    setConditions(newConditions);

    const newErrors = new Map(validationErrors);
    newErrors.delete(id);
    setValidationErrors(newErrors);

    if (newConditions.length === 0) {
      setApplied(false);
      setAttemptedApply(false);
      onFiltersChange([]);
    }
  };

  const handleClearAll = () => {
    setConditions([]);
    setValidationErrors(new Map());
    setApplied(false);
    setAttemptedApply(false);
    onFiltersChange([]);
  };

  const handleApplyFilters = () => {
    setAttemptedApply(true);
    const newErrors = new Map<string, string>();
    let hasErrors = false;

    conditions.forEach((condition) => {
      const validation = validateCondition(condition);
      if (!validation.valid && validation.error) {
        newErrors.set(condition.id, validation.error);
        hasErrors = true;
      }
    });

    setValidationErrors(newErrors);

    if (!hasErrors) {
      setApplied(true);
      onFiltersChange(conditions);
    }
  };

  return (
    <Paper elevation={2} sx={{ border: '1px solid #e3f2fd', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Filter size={22} style={{ color: '#1976d2', flexShrink: 0 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c', m: 0 }}>
                Advanced Filters
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {conditions.length} {conditions.length === 1 ? 'condition' : 'conditions'} added
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {conditions.length > 0 && (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleClearAll}
                  size="small"
                  startIcon={<X size={16} />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyFilters}
                  size="small"
                  startIcon={<Filter size={16} />}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Apply Filters
                </Button>
              </>
            )}
            <Button
              variant="contained"
              onClick={handleAddFilter}
              size="small"
              startIcon={<Plus size={16} />}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Add Filter
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Alerts - Only show if attempted to apply */}
        {attemptedApply && validationErrors.size > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <strong>Validation Error:</strong> Please fix the highlighted filters before applying
          </Alert>
        )}

        {applied && conditions.length > 0 && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✓ Filters applied successfully • {conditions.length} condition{conditions.length !== 1 ? 's' : ''} active
          </Alert>
        )}

        {/* Filter Rows */}
        {conditions.length === 0 ? (
          <Alert severity="info" sx={{ mb: 0 }}>
            📋 No filters applied. Click "Add Filter" to start filtering data.
          </Alert>
        ) : (
          <Box>
            {conditions.map((condition, index) => (
              <Box key={condition.id}>
                {index > 0 && <Divider sx={{ my: 1.5 }} />}
                <FilterRow
                  condition={condition}
                  onUpdate={(updated) => handleUpdateFilter(condition.id, updated)}
                  onRemove={() => handleRemoveFilter(condition.id)}
                  showError={attemptedApply && validationErrors.has(condition.id)}
                  errorMessage={validationErrors.get(condition.id)}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};