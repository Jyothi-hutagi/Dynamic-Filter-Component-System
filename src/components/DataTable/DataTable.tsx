import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Chip,
  Box,
  Typography,
  Alert,
  TablePagination,
} from '@mui/material';
import type { Employee } from '../../types/data.types';

interface DataTableProps {
  data: Employee[];
  totalCount: number;
}

type SortOrder = 'asc' | 'desc';
type SortField = keyof Employee | 'address.city' | 'address.state';

export const DataTable: React.FC<DataTableProps> = ({ data, totalCount }) => {
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortField.includes('.')) {
        aValue = getNestedValue(a, sortField);
        bValue = getNestedValue(b, sortField);
      } else {
        aValue = a[sortField as keyof Employee];
        bValue = b[sortField as keyof Employee];
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (Array.isArray(aValue)) aValue = aValue.join(', ');
      if (Array.isArray(bValue)) bValue = bValue.join(', ');

      if (typeof aValue === 'object') aValue = JSON.stringify(aValue);
      if (typeof bValue === 'object') bValue = JSON.stringify(bValue);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (data.length === 0) {
    return (
      <Box>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Showing 0 of {totalCount} records
          </Typography>
        </Box>
        <Alert severity="info">
          No results found. Try adjusting your filters.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary">
          Showing {data.length} of {totalCount} records
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ backgroundColor: '#fafafa' }}>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'id'}
                  direction={sortField === 'id' ? sortOrder : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  <strong>ID</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  <strong>Name</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'email'}
                  direction={sortField === 'email' ? sortOrder : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  <strong>Email</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'department'}
                  direction={sortField === 'department' ? sortOrder : 'asc'}
                  onClick={() => handleSort('department')}
                >
                  <strong>Department</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'role'}
                  direction={sortField === 'role' ? sortOrder : 'asc'}
                  onClick={() => handleSort('role')}
                >
                  <strong>Role</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'salary'}
                  direction={sortField === 'salary' ? sortOrder : 'asc'}
                  onClick={() => handleSort('salary')}
                >
                  <strong>Salary</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'joinDate'}
                  direction={sortField === 'joinDate' ? sortOrder : 'asc'}
                  onClick={() => handleSort('joinDate')}
                >
                  <strong>Join Date</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Skills</strong>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'address.city'}
                  direction={sortField === 'address.city' ? sortOrder : 'asc'}
                  onClick={() => handleSort('address.city')}
                >
                  <strong>Location</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={sortField === 'projects'}
                  direction={sortField === 'projects' ? sortOrder : 'asc'}
                  onClick={() => handleSort('projects')}
                >
                  <strong>Projects</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'performanceRating'}
                  direction={sortField === 'performanceRating' ? sortOrder : 'asc'}
                  onClick={() => handleSort('performanceRating')}
                >
                  <strong>Rating</strong>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((employee) => (
              <TableRow key={employee.id} hover sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', color: '#666' }}>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {formatCurrency(employee.salary)}
                </TableCell>
                <TableCell>{formatDate(employee.joinDate)}</TableCell>
                <TableCell>
                  <Chip
                    label={employee.isActive ? 'Active' : 'Inactive'}
                    color={employee.isActive ? 'success' : 'default'}
                    size="small"
                    variant={employee.isActive ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {employee.skills.slice(0, 3).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {employee.skills.length > 3 && (
                      <Chip label={`+${employee.skills.length - 3}`} size="small" sx={{ fontSize: '0.75rem' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  {employee.address.city}, {employee.address.state}
                </TableCell>
                <TableCell align="center">{employee.projects}</TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor:
                        employee.performanceRating >= 4
                          ? '#d1fae5'
                          : employee.performanceRating >= 3
                            ? '#fef3c7'
                            : '#fee2e2',
                      color:
                        employee.performanceRating >= 4
                          ? '#047857'
                          : employee.performanceRating >= 3
                            ? '#b45309'
                            : '#dc2626',
                      fontWeight: 'bold',
                    }}
                  >
                    {employee.performanceRating.toFixed(1)}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ backgroundColor: '#fafafa' }}
      />
    </Box>
  );
};
