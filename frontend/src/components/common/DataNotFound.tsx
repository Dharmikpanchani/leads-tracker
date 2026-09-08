import React from 'react';
import { Box, Typography } from '@mui/material';
import { SearchOff as SearchOffIcon } from '@mui/icons-material';

interface DataNotFoundProps {
  title?: string;
  subtitle?: string;
}

export const DataNotFound: React.FC<DataNotFoundProps> = ({
  title = 'No Data Found',
  subtitle = 'Try adjusting your search query or filters to find what you are looking for.',
}) => {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          color: '#002147',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <SearchOffIcon sx={{ fontSize: 32 }} />
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 400 }}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default DataNotFound;
