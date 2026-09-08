import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box className="page-container">
      {/* Page Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: '#002147',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 4px 12px rgba(0, 33, 71, 0.15)',
          }}
        >
          <SettingsIcon sx={{ color: '#ffffff', fontSize: 22 }} />
        </Box>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#002147' }}>
            Account Settings & Profile
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Manage your personal profile, credentials, and account security
          </Typography>
        </Box>
      </Box>

      {/* Tabs Container */}
      <Box
        className="portal-card"
        sx={{
          p: 0,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ borderBottom: '1px solid #e2e8f0', px: 3, pt: 1 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="profile tabs"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#002147',
                height: '3px',
                borderRadius: '3px 3px 0 0',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 600,
                minHeight: '48px',
                color: '#64748b',
                mr: 3,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1,
                '&.Mui-selected': {
                  color: '#002147',
                  fontWeight: 700,
                },
              },
            }}
          >
            <Tab icon={<PersonIcon sx={{ fontSize: 18 }} />} label="Edit Profile" />
            <Tab icon={<LockIcon sx={{ fontSize: 18 }} />} label="Change Password" />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3.5 } }}>
          <TabPanel value={activeTab} index={0}>
            <EditProfile />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <ChangePassword />
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
