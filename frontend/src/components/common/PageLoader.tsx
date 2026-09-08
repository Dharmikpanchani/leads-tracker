import React from 'react';
import { Box } from '@mui/material';

export const PageLoader: React.FC = () => {
  return (
    <Box className="loader-main" sx={{ minHeight: '60vh' }}>
      <Box className="loader">
        <span></span>
        <span></span>
      </Box>
    </Box>
  );
};

export default React.memo(PageLoader);
