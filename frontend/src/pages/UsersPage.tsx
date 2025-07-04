import { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box, Alert } from '@mui/material';
import { Add } from '@mui/icons-material';
import { 
  useUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation
} from '../generated/graphql';
import type {
  CreateUserInput,
  UpdateUserInput,
  User
} from '../generated/graphql';
import UsersTable from '../components/UsersTable';
import UserFormDialog from '../components/UserFormDialog';

const ROWS_PER_PAGE = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState<CreateUserInput>({ email: '', name: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, loading, refetch } = useUsersQuery({
    variables: { 
      page, 
      limit: ROWS_PER_PAGE,
      filter: debouncedSearch ? { search: debouncedSearch } : undefined
    },
    fetchPolicy: 'cache-and-network',
  });

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleOpen = useCallback((user?: User) => {
    setEditUser(user || null);
    setForm(user ? { email: user.email, name: user.name } : { email: '', name: '' });
    setError(null);
    setOpen(true);
  }, []);
  
  const handleClose = useCallback(() => {
    setOpen(false);
    setSubmitLoading(false);
    setError(null);
  }, []);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    setSubmitLoading(true);
    setError(null);
    
    try {
      if (editUser) {
        await updateUser({ 
          variables: { 
            id: editUser.id, 
            input: form as UpdateUserInput 
          } 
        });
      } else {
        await createUser({ variables: { input: form } });
      }
      await refetch();
      handleClose();
    } catch (error: any) {
      console.error('Error saving user:', error);
      setError(error.message || 'Произошла ошибка при сохранении пользователя');
      setSubmitLoading(false);
    }
  }, [editUser, form, updateUser, createUser, refetch, handleClose]);

  const handleDelete = useCallback(async (id: string) => {
    setDeleteLoading(id);
    setError(null);
    
    try {
      await deleteUser({ variables: { id } });
      await refetch();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.message || 'Произошла ошибка при удалении пользователя');
    } finally {
      setDeleteLoading(null);
    }
  }, [deleteUser, refetch]);

  const handleErrorClose = useCallback(() => {
    setError(null);
  }, []);

  const pagination = data?.users;

  return (
    <Box
      sx={{
        height: '100vh',
        paddingTop: '30px',
        paddingBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1300px',
          height: '100%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          px: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Пользователи</Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => handleOpen()}
            disabled={loading}
          >
            Добавить
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={handleErrorClose}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <UsersTable
            users={pagination?.users || []}
            loading={loading}
            page={page}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={handleChangePage}
            onEdit={handleOpen}
            onDelete={handleDelete}
            totalCount={pagination?.totalCount || 0}
            deleteLoading={deleteLoading}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
          />
        </Box>
      </Box>
      
      <UserFormDialog
        open={open}
        onClose={handleClose}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editUser={editUser}
        loading={submitLoading}
        error={error}
      />
    </Box>
  );
} 