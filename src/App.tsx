import { useState, useMemo } from 'react';
import { Container, Typography, Box, Paper, Divider, CssBaseline } from '@mui/material';
import { Database } from 'lucide-react';
import { FilterBuilder } from './components/FilterBuilder/FilterBuilder';
import { DataTable } from './components/DataTable/DataTable';
import type { FilterCondition } from './types/filter.types';
import { employees } from './utils/dataGenerator';
import { filterEmployees } from './utils/filterEngine';
import './App.css';

function App() {
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);

  const filteredData = useMemo(() => {
    return filterEmployees(employees, activeFilters);
  }, [activeFilters]);

  const handleFiltersChange = (conditions: FilterCondition[]) => {
    setActiveFilters(conditions);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Database size={32} style={{ color: '#1976d2' }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Employee Management System
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" sx={{ pl: 5 }}>
            Advanced filtering with real-time data processing and type-safe operations
          </Typography>
        </Box>

        {/* Filter Section */}
        <Box sx={{ mb: 4 }}>
          <FilterBuilder onFiltersChange={handleFiltersChange} />
        </Box>

        {/* Data Table Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#1a202c',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '0.95rem',
                }}
              >
                Results Table
              </Typography>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {filteredData.length} / {employees.length}
              </Typography>
            </Box>
          </Box>
          <DataTable data={filteredData} totalCount={employees.length} />
        </Paper>

        {/* Footer Info */}
        <Box sx={{ mt: 4, py: 2, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="text.secondary">
            Showing results for {activeFilters.length} active filter{activeFilters.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default App;