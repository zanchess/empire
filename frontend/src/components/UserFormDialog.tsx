import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { User, CreateUserInput } from "../generated/graphql.ts";

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  form: CreateUserInput;
  setForm: React.Dispatch<React.SetStateAction<CreateUserInput>>;
  editUser: User | null;
  loading: boolean;
  error: string | null;
}

export default function UserFormDialog({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  editUser,
  loading,
  error,
}: UserFormDialogProps) {
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    name?: string;
  }>({});

  useEffect(() => {
    if (open) {
      setValidationErrors({});
    }
  }, [open]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email обязателен';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Некорректный формат email';
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return 'Имя обязательно';
    if (name.length < 2) return 'Имя должно содержать минимум 2 символа';
    return undefined;
  };

  const handleEmailBlur = () => {
    const emailError = validateEmail(form.email);
    setValidationErrors(prev => ({ ...prev, email: emailError }));
  };

  const handleNameBlur = () => {
    const nameError = validateName(form.name);
    setValidationErrors(prev => ({ ...prev, name: nameError }));
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(form.email);
    const nameError = validateName(form.name);
    
    setValidationErrors({
      email: emailError,
      name: nameError,
    });

    if (!emailError && !nameError) {
      await onSubmit();
    }
  };

  const isFormValid = !validationErrors.email && !validationErrors.name && form.email && form.name;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editUser ? 'Редактировать пользователя' : 'Создать пользователя'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
          
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={handleEmailBlur}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
            fullWidth
            required
            disabled={loading}
          />
          <TextField
            label="Имя"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onBlur={handleNameBlur}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
            fullWidth
            required
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid || loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            minWidth: 120,
            opacity: loading ? 0.8 : 1,
            transition: 'opacity 0.2s ease'
          }}
        >
          {loading ? 'Сохранение...' : (editUser ? 'Обновить' : 'Создать')}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 