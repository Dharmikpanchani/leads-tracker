import React from 'react';
import { Chip } from '@mui/material';

interface StatusChipProps {
  status: 'new' | 'contacted' | 'qualified' | 'lost' | string;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'new':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'New' };
      case 'contacted':
        return { bg: '#fef3c7', color: '#b45309', border: '#fde68a', label: 'Contacted' };
      case 'qualified':
        return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0', label: 'Qualified' };
      case 'lost':
        return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca', label: 'Lost' };
      default:
        return { bg: '#f3f4f6', color: '#4b5563', border: '#e5e7eb', label: status || 'N/A' };
    }
  };

  const style = getStatusColor();

  return (
    <Chip
      label={style.label}
      size={size}
      sx={{
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        fontWeight: 600,
        fontSize: size === 'small' ? '12px' : '13px',
        borderRadius: '6px',
        height: size === 'small' ? '24px' : '28px',
        textTransform: 'capitalize',
      }}
    />
  );
};

export default StatusChip;
