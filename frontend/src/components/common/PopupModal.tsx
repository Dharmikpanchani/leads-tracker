import React from 'react';
import { Box, Modal, Typography, Button, CircularProgress } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

interface PopupModalProps {
  type?: 'delete' | 'status' | 'confirm';
  buttonText?: string;
  module?: string;
  title?: string;
  description?: string;
  open: boolean;
  buttonStatusSpinner?: boolean;
  handleClose: () => void;
  handleFunction: () => void;
}

export const PopupModal: React.FC<PopupModalProps> = ({
  type = 'delete',
  buttonText = 'Delete',
  module = 'this lead',
  title = 'Are you sure?',
  description,
  open,
  buttonStatusSpinner = false,
  handleClose,
  handleFunction,
}) => {
  const modalText =
    description ||
    (module && (module.trim().startsWith('Are you sure') || module.trim().startsWith('Do you really want'))
      ? module
      : `Do you really want to ${type} ${module}? This process cannot be undone.`);

  return (
    <Modal
      open={open}
      onClose={buttonStatusSpinner ? undefined : handleClose}
      aria-labelledby="popup-modal-title"
      aria-describedby="popup-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.16)',
          p: 4,
          maxWidth: 420,
          width: '90%',
          textAlign: 'center',
          outline: 'none',
          position: 'relative',
        }}
      >
        {/* Circle Icon Header */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: type === 'delete' ? '#fee2e2' : '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          {type === 'delete' ? (
            <ErrorOutlineRoundedIcon sx={{ fontSize: 36, color: '#dc2626' }} />
          ) : (
            <WarningAmberRoundedIcon sx={{ fontSize: 36, color: '#d97706' }} />
          )}
        </Box>

        {/* Modal Title */}
        <Typography
          id="popup-modal-title"
          variant="h6"
          sx={{
            color: type === 'delete' ? '#dc2626' : '#002147',
            fontWeight: 700,
            fontSize: '20px',
            mb: 1,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {title}
        </Typography>

        {/* Modal Description */}
        <Typography
          id="popup-modal-description"
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '14px',
            lineHeight: 1.5,
            mb: 3,
            px: 1,
          }}
        >
          {modalText}
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={buttonStatusSpinner}
            sx={{
              flex: 1,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              color: '#64748b',
              borderColor: '#cbd5e1',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f8fafc',
              },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleFunction}
            disabled={buttonStatusSpinner}
            sx={{
              flex: 1,
              py: 1,
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              backgroundColor: type === 'delete' ? '#dc2626' : '#002147',
              boxShadow:
                type === 'delete'
                  ? '0 4px 12px rgba(220, 38, 38, 0.25)'
                  : '0 4px 12px rgba(0, 33, 71, 0.25)',
              '&:hover': {
                backgroundColor: type === 'delete' ? '#b91c1c' : '#001630',
              },
            }}
          >
            {buttonStatusSpinner ? (
              <CircularProgress size={20} sx={{ color: '#ffffff' }} />
            ) : (
              buttonText
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PopupModal;
