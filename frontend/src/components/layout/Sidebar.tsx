import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  SpaceDashboardOutlined as DashboardIcon,
  PeopleAltOutlined as LeadsIcon,
  PostAddOutlined as BulkAddIcon,
  LayersOutlined as AppLogoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  onClose?: () => void;
}

export const SidebarContent: React.FC<{ open: boolean; onClose?: () => void; isMobile?: boolean }> = ({
  open,
  onClose,
  isMobile,
}) => {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'All Leads', path: '/leads', icon: <LeadsIcon /> },
    { text: 'Batch Import Leads', path: '/leads/batch', icon: <BulkAddIcon /> },
  ];

  return (
    <Box
      sx={{
        width: isMobile ? '280px' : open ? '260px' : '72px',
        background: 'linear-gradient(180deg, #002147 0%, #001529 100%)',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'width 0.25s ease-in-out',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: '65px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: open || isMobile ? 2.5 : 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #00509d 0%, #f1b000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <AppLogoIcon sx={{ fontSize: 24 }} />
          </Box>
          {(open || isMobile) && (
            <Box sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                Leads Tracker
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '11px' }}>
                Management Portal
              </Typography>
            </Box>
          )}
        </Box>

        {isMobile && (
          <IconButton onClick={onClose} size="small" sx={{ color: '#94a3b8' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Menu Navigation */}
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/leads' && location.pathname.startsWith('/leads/') && location.pathname !== '/leads/batch');

          return (
            <ListItemButton
              key={item.text}
              component={NavLink}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              sx={{
                mb: 1,
                borderRadius: '8px',
                py: 1.2,
                px: open || isMobile ? 2 : 1.5,
                background: isActive ? 'linear-gradient(90deg, #00509d 0%, #002147 100%)' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                borderLeft: isActive ? '4px solid #f1b000' : '4px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                },
                justifyContent: open || isMobile ? 'initial' : 'center',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: open || isMobile ? 36 : 'auto',
                  color: isActive ? '#f1b000' : 'inherit',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {(open || isMobile) && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: '280px',
            border: 'none',
          },
        }}
      >
        <SidebarContent open={true} onClose={onClose} isMobile={true} />
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: open ? '260px' : '72px',
        minWidth: open ? '260px' : '72px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        transition: 'width 0.25s ease-in-out',
      }}
    >
      <SidebarContent open={open} />
    </Box>
  );
};

export default Sidebar;
