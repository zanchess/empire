import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Avatar,
} from '@mui/material';
import { Person, Email } from '@mui/icons-material';
import type { User } from '../generated/graphql';

interface UserDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            minHeight: 300,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <Person sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" component="div" fontWeight={600}>
              Информация о пользователе
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {user.id}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 3 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Имя пользователя */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Имя пользователя
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Person color="primary" fontSize="small" />
              <Typography variant="body1" fontWeight={500}>
                {user.name}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Электронная почта
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Email color="primary" fontSize="small" />
              <Typography variant="body1" fontWeight={500}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};
