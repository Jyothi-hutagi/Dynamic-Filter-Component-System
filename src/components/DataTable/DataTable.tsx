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
  // State for table sorting - tracks which column and direction
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // State for pagination - tracks current page and rows per page
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /**
   * Handle column header clicks to toggle sorting
   * Clicking the same column toggles between asc/desc
   * Clicking a different column sets it as the new sort field with asc order
   */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Already sorting by this field, toggle the direction
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field selected, start with ascending order
      setSortField(field);
      setSortOrder('asc');
    }
  };

  /**
   * Get nested property value using dot notation
   * Allows accessing properties like 'address.city'
   * @param obj - Object to traverse
   * @param path - Dot-separated path (e.g., 'address.city')
   * @returns The value at the specified path, or undefined
   */
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  /**
   * Sorting logic for the table data
   * Handles different data types: strings, numbers, dates, arrays, and objects
   * Uses memoization to prevent resort unless data or sort params change
   */
  const sortedData = useMemo(() => {
    // Create a copy of the data array without mutating the original
    const sorted = [...data].sort((a, b) => {
      // Get values to compare based on the current sort field
      let aValue: any;
      let bValue: any;

      // Handle nested field paths (e.g., 'address.city')
      if (sortField.includes('.')) {
        aValue = getNestedValue(a, sortField);
        bValue = getNestedValue(b, sortField);
      } else {
        // Get top-level field value
        aValue = a[sortField as keyof Employee];
        bValue = b[sortField as keyof Employee];
      }

      // Handle null/undefined values - push them to the end
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Convert arrays to strings for comparison (e.g., skills array)
      if (Array.isArray(aValue)) aValue = aValue.join(', ');
      if (Array.isArray(bValue)) bValue = bValue.join(', ');

      // Convert objects to JSON strings for comparison (e.g., address object)
      if (typeof aValue === 'object') aValue = JSON.stringify(aValue);
      if (typeof bValue === 'object') bValue = JSON.stringify(bValue);

      // String comparison - use localeCompare for proper alphabetical ordering
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Numeric comparison
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      
      // Values are equal
      return 0;
    });

    return sorted;
  }, [data, sortField, sortOrder]);

  /**
   * Slice the sorted data for the current page
   * Uses memoization to prevent recalculation unless sorting/pagination changes
   */
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, page, rowsPerPage]);

  /**
   * Format a number as US currency
   * Example: 120000 -> "$120,000"
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * Format a date string in readable format
   * Example: "2024-01-15" -> "Jan 15, 2024"
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  /**
   * Handle pagination page change
   */
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  /**
   * Handle rows per page change
   * Reset to page 0 when changing page size
   */
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when page size changes
  };

  // Show empty state if no data
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

  // Render the data table
  return (
    <Box>
      {/* Record count display */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary">
          Showing {data.length} of {totalCount} records
        </Typography>
      </Box>

      {/* Table component */}
      <TableContainer component={Paper}>
        <Table size="small" sx={{ backgroundColor: '#fafafa' }}>
          {/* Table header with sortable columns */}
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              {/* ID column */}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'id'}
                  direction={sortField === 'id' ? sortOrder : 'asc'}
                  onClick={() => handleSort('id')}
                >
                  <strong>ID</strong>
                </TableSortLabel>
              </TableCell>

              {/* Name column */}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortOrder : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  <strong>Name</strong>
                </TableSortLabel>
              </TableCell>

              {/* Email column */}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'email'}
                  direction={sortField === 'email' ? sortOrder : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  <strong>Email</strong>
                </TableSortLabel>
              </TableCell>

              {/* Department column */}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'department'}
                  direction={sortField === 'department' ? sortOrder : 'asc'}
                  onClick={() => handleSort('department')}
                >
                  <strong>Department</strong>
                </TableSortLabel>
              </TableCell>

              {/* Role column */}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'role'}
                  direction={sortField === 'role' ? sortOrder : 'asc'}
                  onClick={() => handleSort('role')}
                >
                  <strong>Role</strong>
                </TableSortLabel>
              </TableCell>

              {/* Salary column - right aligned for numbers */}
              <TableCell align="right">
                <TableSortLabel
                  active={sortField === 'salary'}
                  direction={sortField === 'salary' ? sortOrder : 'asc'}
                  onClick={() => handleSort('salary')}
                >
                  <strong>Salary</strong>
                </TableSortLabel>
              </TableCell>

              {/* Join Date column */}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'joinDate'}
                  direction={sortField === 'joinDate' ? sortOrder : 'asc'}
                  onClick={() => handleSort('joinDate')}
                >
                  <strong>Join Date</strong>
                </TableSortLabel>
              </TableCell>

              {/* Status column - shows active/inactive chip */}
              <TableCell>
                <strong>Status</strong>
              </TableCell>

              {/* Skills column - shows chips with truncation */}
              <TableCell>
                <strong>Skills</strong>
              </TableCell>

              {/* Location column with nested field support */}
              <TableCell>
                <TableSortLabel
                  active={sortField === 'address.city'}
                  direction={sortField === 'address.city' ? sortOrder : 'asc'}
                  onClick={() => handleSort('address.city')}
                >
                  <strong>Location</strong>
                </TableSortLabel>
              </TableCell>

              {/* Projects count - centered numeric column */}
              <TableCell align="center">
                <TableSortLabel
                  active={sortField === 'projects'}
                  direction={sortField === 'projects' ? sortOrder : 'asc'}
                  onClick={() => handleSort('projects')}
                >
                  <strong>Projects</strong>
                </TableSortLabel>
              </TableCell>

              {/* Performance rating - color coded indicator */}
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

          {/* Table body with employee data */}
          <TableBody>
            {paginatedData.map((employee) => (
              <TableRow key={employee.id} hover sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell sx={{ fontSize: '0.875rem', color: '#666' }}>{employee.email}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.role}</TableCell>
                
                {/* Formatted salary in USD currency */}
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {formatCurrency(employee.salary)}
                </TableCell>
                
                {/* Formatted date in readable format */}
                <TableCell>{formatDate(employee.joinDate)}</TableCell>
                
                {/* Status chip - green for active, gray for inactive */}
                <TableCell>
                  <Chip
                    label={employee.isActive ? 'Active' : 'Inactive'}
                    color={employee.isActive ? 'success' : 'default'}
                    size="small"
                    variant={employee.isActive ? 'filled' : 'outlined'}
                  />
                </TableCell>
                
                {/* Skills - show first 3 with +N indicator if more */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {/* Display first 3 skills */}
                    {employee.skills.slice(0, 3).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                    {/* Show count of remaining skills if more than 3 */}
                    {employee.skills.length > 3 && (
                      <Chip label={`+${employee.skills.length - 3}`} size="small" sx={{ fontSize: '0.75rem' }} />
                    )}
                  </Box>
                </TableCell>
                
                {/* Location from nested address object */}
                <TableCell>
                  {employee.address.city}, {employee.address.state}
                </TableCell>
                
                {/* Project count centered */}
                <TableCell align="center">{employee.projects}</TableCell>
                
                {/* Performance rating - color coded circle based on rating value */}
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      // Color scheme: green for 4+, yellow for 3-3.99, red for below 3
                      backgroundColor:
                        employee.performanceRating >= 4
                          ? '#d1fae5' // Light green
                          : employee.performanceRating >= 3
                            ? '#fef3c7' // Light yellow
                            : '#fee2e2', // Light red
                      color:
                        employee.performanceRating >= 4
                          ? '#047857' // Dark green text
                          : employee.performanceRating >= 3
                            ? '#b45309' // Dark yellow text
                            : '#dc2626', // Dark red text
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

      {/* Pagination controls */}
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
