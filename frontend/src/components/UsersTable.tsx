import React, { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Pagination,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Edit, Delete, Search, Clear } from '@mui/icons-material';
import type { User } from "../generated/graphql.ts";

interface UsersTableProps {
  users: User[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  totalCount: number;
  deleteLoading: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const UsersTable = React.memo(function UsersTable({
  users,
  loading,
  page,
  rowsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  totalCount,
  deleteLoading,
  searchValue,
  onSearchChange,
}: UsersTableProps) {
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const handleClearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  if (loading && !users.length && !searchValue) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height="400px"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Загрузка пользователей...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      minHeight: 0
    }}>
      <Box sx={{ mb: 2, flexShrink: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Поиск по имени или email..."
          value={searchValue}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {users.length === 0 && !loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="h6" color="text.secondary">
              {searchValue ? 'Пользователи не найдены' : 'Нет пользователей'}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer 
              component={Paper} 
              sx={{ 
                flexGrow: 1,
                position: 'relative',
                overflow: 'auto',
                maxHeight: 'none'
              }}
            >
              {loading && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 1,
                  }}
                >
                  <CircularProgress size={40} />
                </Box>
              )}
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ backgroundColor: '#fafafa' }}>ID</TableCell>
                    <TableCell sx={{ backgroundColor: '#fafafa' }}>Email</TableCell>
                    <TableCell sx={{ backgroundColor: '#fafafa' }}>Name</TableCell>
                    <TableCell align="right" sx={{ backgroundColor: '#fafafa' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => onEdit(user)}
                          color="primary"
                          size="small"
                          disabled={deleteLoading === user.id}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => onDelete(user.id)}
                          color="error"
                          size="small"
                          disabled={deleteLoading === user.id}
                          sx={{ 
                            minWidth: 40,
                            minHeight: 40,
                          }}
                        >
                          {deleteLoading === user.id ? (
                            <CircularProgress 
                              size={20} 
                              sx={{ color: 'error.main' }}
                            />
                          ) : (
                            <Delete />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2,
                flexShrink: 0
              }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={onPageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
});

export default UsersTable; 