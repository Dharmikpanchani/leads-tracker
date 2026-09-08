import React from 'react';
import { TableRow, TableCell, Box } from '@mui/material';

export const CommonLoader = () => (
  <Box className="loader-main">
    <Box className="loader">
      <span></span>
      <span></span>
    </Box>
  </Box>
);

export const Loader: React.FC<{ colSpan?: number }> = ({ colSpan }) => {
  if (colSpan === undefined) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: '220px',
          py: 6,
        }}
      >
        <CommonLoader />
      </Box>
    );
  }

  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        sx={{ border: 'none', py: 8 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <CommonLoader />
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default React.memo(Loader);
