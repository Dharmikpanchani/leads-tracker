import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  PersonOutline as AccountIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/Store';
import { logoutUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logoutUser());
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SA';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <Box
      component="header"
      sx={{
        height: '65px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Left: Sidebar Toggle & App Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={() => setSidebarOpen((prev) => !prev)}
          size="small"
          sx={{
            color: '#002147',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            '&:hover': { backgroundColor: '#f1f5f9' },
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 700, color: '#002147', fontSize: '18px' }}>
          Leads Management
        </Typography>
      </Box>

      {/* Right: User Profile Menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            py: 0.5,
            px: 1,
            borderRadius: '8px',
            transition: 'background-color 0.15s ease',
            '&:hover': { backgroundColor: '#f8fafc' },
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: '#002147',
              color: '#f1b000',
              fontWeight: 700,
              fontSize: '13px',
              border: '2px solid #e2e8f0',
            }}
          >
            {getInitials(user?.name)}
          </Avatar>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.name || 'Developer Admin'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '11px' }}>
              {user?.email || 'developer@yopmail.com'}
            </Typography>
          </Box>
          <ExpandMoreIcon sx={{ fontSize: 18, color: '#64748b', display: { xs: 'none', sm: 'block' } }} />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: 190,
              borderRadius: '10px',
              mt: 1.2,
              py: 0.5,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate('/profile');
            }}
            sx={{ py: 1.2, fontSize: '14px', fontWeight: 500 }}
          >
            <ListItemIcon>
              <AccountIcon fontSize="small" sx={{ color: '#002147' }} />
            </ListItemIcon>
            Account Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ py: 1.2, fontSize: '14px', fontWeight: 500, color: '#ef4444' }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
