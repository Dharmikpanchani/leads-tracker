import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const FormDialog: React.FC<FormDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#002147', fontSize: '18px' }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#64748b',
            '&:hover': { backgroundColor: '#e2e8f0', color: '#0f172a' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: '#ffffff' }}>
        <Box sx={{ mt: 1 }}>{children}</Box>
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            py: 2,
            px: 3,
            gap: 1.5,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FormDialog;
