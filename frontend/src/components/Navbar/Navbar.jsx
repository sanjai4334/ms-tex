import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Store as StoreIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
} from '@mui/icons-material';

function Navbar({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawerWidth = isCollapsed ? 80 : 240;

  // Navigation items data
  const navItems = [
    { icon: <StoreIcon />, text: 'Shop', path: '/shop' },
    { icon: <FavoriteIcon />, text: 'Favorites', path: '/favorites' },
    { icon: <ShoppingCartIcon />, text: 'Cart', path: '/cart' },
    { 
      icon: isLoggedIn ? <Avatar sx={{ width: 24, height: 24 }} src="/default-avatar.jpg" /> : <AccountCircleIcon />,
      text: isLoggedIn ? user?.firstName || 'Profile' : 'Profile',
      onClick: () => isLoggedIn ? navigate('/') : navigate('/login')
    },
    { 
      icon: isLoggedIn ? <LogoutIcon /> : <LoginIcon />, 
      text: isLoggedIn ? 'Logout' : 'Login',
      onClick: isLoggedIn ? handleLogout : () => navigate('/login')
    }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            transition: 'width 0.3s',
            overflowX: 'hidden',
            borderRight: 1,
            borderColor: 'divider'
          },
        }}
      >
        <List>
          {/* Collapse Toggle */}
          <ListItem
            disablePadding
            onClick={toggleCollapse}
            sx={{
              padding: '0.8rem 1rem',
              justifyContent: 'flex-start',
              height: '56px',
              cursor: 'pointer'
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <MenuIcon />
            </ListItemIcon>
            <ListItemText
              primary="MS-Tex Shop"
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: 'opacity 0.3s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          </ListItem>

          {/* User Profile Summary (Visible when expanded) */}
          {isLoggedIn && !isCollapsed && (
            <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" noWrap>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" noWrap>
                {user?.email}
              </Typography>
            </Box>
          )}

          {/* Navigation Items */}
          {navItems.map((item, index) => (
            <ListItem
              key={index}
              disablePadding
              onClick={item.onClick}
              component={item.path ? Link : 'div'}
              to={item.path}
              sx={{
                padding: '0.8rem 1rem',
                justifyContent: 'flex-start',
                height: '56px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  opacity: isCollapsed ? 0 : 1,
                  transition: 'opacity 0.3s',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          position: 'absolute',
          left: drawerWidth,
          right: 0,
          top: 0,
          bottom: 0,
          transition: 'left 0.3s',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Navbar;