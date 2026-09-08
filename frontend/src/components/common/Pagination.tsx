import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Select,
  MenuItem,
  Tooltip,
  SelectChangeEvent,
} from '@mui/material';
import {
  FirstPageRounded as FirstPageIcon,
  NavigateBeforeRounded as PrevPageIcon,
  NavigateNextRounded as NextPageIcon,
  LastPageRounded as LastPageIcon,
} from '@mui/icons-material';

interface PaginationProps {
  page: number; // 0-indexed
  rowsPerPage: number;
  setPage: (newPage: number) => void;
  setRowsPerPage: (newRowsPerPage: number) => void;
  count: number;
  itemName?: string;
  rowsPerPageOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  count,
  itemName = 'leads',
  rowsPerPageOptions = [5, 10, 25, 50, 100],
}) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min((page + 1) * rowsPerPage, count);

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  const handleFirstPage = () => {
    setPage(0);
  };

  const handlePrevPage = () => {
    setPage(Math.max(0, page - 1));
  };

  const handleNextPage = () => {
    setPage(Math.min(totalPages - 1, page + 1));
  };

  const handleLastPage = () => {
    setPage(Math.max(0, totalPages - 1));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        px: { xs: 2, sm: 3 },
        py: 1.75,
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      {/* Left: Rows Per Page Selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Rows per page:
        </Typography>
        <Select
          size="small"
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          sx={{
            height: '34px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#002147',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            transition: 'all 0.2s ease',
            '& fieldset': { border: 'none' },
            '&:hover': {
              borderColor: '#00509d',
              backgroundColor: '#ffffff',
            },
            '& .MuiSelect-select': {
              py: '4px',
              pl: '10px',
              pr: '28px !important',
            },
            '& .MuiSvgIcon-root': {
              color: '#002147',
              fontSize: '18px',
              right: '6px',
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 33, 71, 0.12)',
                mt: 0.5,
                '& .MuiMenuItem-root': {
                  fontSize: '13px',
                  fontWeight: 600,
                  py: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#eff6ff',
                    color: '#002147',
                    fontWeight: 700,
                  },
                },
              },
            },
          }}
        >
          {rowsPerPageOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Center: Showing X of Y Leads */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Showing{' '}
          <strong style={{ color: '#002147', fontWeight: 700 }}>
            {from}-{to}
          </strong>{' '}
          of{' '}
          <strong style={{ color: '#002147', fontWeight: 700 }}>
            {count.toLocaleString()}
          </strong>{' '}
          {itemName}
        </Typography>
      </Box>

      {/* Right: Modern Page Buttons Group */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        {/* First Page */}
        <Tooltip title="First page" arrow placement="top">
          <span>
            <IconButton
              size="small"
              onClick={handleFirstPage}
              disabled={page === 0}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: page === 0 ? '#f8fafc' : '#ffffff',
                color: page === 0 ? '#cbd5e1' : '#002147',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: page === 0 ? '#f8fafc' : '#f1f5f9',
                  borderColor: '#cbd5e1',
                },
              }}
            >
              <FirstPageIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>

        {/* Previous Page */}
        <Tooltip title="Previous page" arrow placement="top">
          <span>
            <IconButton
              size="small"
              onClick={handlePrevPage}
              disabled={page === 0}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: page === 0 ? '#f8fafc' : '#ffffff',
                color: page === 0 ? '#cbd5e1' : '#002147',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: page === 0 ? '#f8fafc' : '#f1f5f9',
                  borderColor: '#cbd5e1',
                },
              }}
            >
              <PrevPageIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>

        {/* Current Page Indicator Pill */}
        <Box
          sx={{
            height: 34,
            px: 1.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            userSelect: 'none',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#64748b',
              whiteSpace: 'nowrap',
            }}
          >
            Page <strong style={{ color: '#002147', fontWeight: 800 }}>{page + 1}</strong> of{' '}
            <strong style={{ color: '#002147', fontWeight: 800 }}>{totalPages}</strong>
          </Typography>
        </Box>

        {/* Next Page */}
        <Tooltip title="Next page" arrow placement="top">
          <span>
            <IconButton
              size="small"
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: page >= totalPages - 1 ? '#f8fafc' : '#ffffff',
                color: page >= totalPages - 1 ? '#cbd5e1' : '#002147',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: page >= totalPages - 1 ? '#f8fafc' : '#f1f5f9',
                  borderColor: '#cbd5e1',
                },
              }}
            >
              <NextPageIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>

        {/* Last Page */}
        <Tooltip title="Last page" arrow placement="top">
          <span>
            <IconButton
              size="small"
              onClick={handleLastPage}
              disabled={page >= totalPages - 1}
              sx={{
                width: 34,
                height: 34,
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                backgroundColor: page >= totalPages - 1 ? '#f8fafc' : '#ffffff',
                color: page >= totalPages - 1 ? '#cbd5e1' : '#002147',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: page >= totalPages - 1 ? '#f8fafc' : '#f1f5f9',
                  borderColor: '#cbd5e1',
                },
              }}
            >
              <LastPageIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default React.memo(Pagination);
