import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box className="app-layout-wrapper">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box className="app-main-content">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Box component="main" sx={{ flex: 1, backgroundColor: 'var(--body-color)', overflowX: 'hidden' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
