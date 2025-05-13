import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';
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
  const { isAuthenticated, user } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const drawerWidth = isCollapsed ? 80 : 240;

  // Navigation items data
  const navItems = [
    { icon: <StoreIcon />, text: 'Shop', path: '/shop' }, // No auth check for Shop
    { icon: <FavoriteIcon />, 
      text: 'Favorites',
      onClick: () => isAuthenticated ? navigate('/favorites') : navigate('/login')
    },
    { icon: <ShoppingCartIcon />, 
      text: 'Cart',
      onClick: () => isAuthenticated ? navigate('/cart') : navigate('/login')
    },
    { 
      icon: <AccountCircleIcon />,
      text: 'Profile',
      onClick: () => isAuthenticated ? navigate('/profile') : navigate('/login')
    },
    { 
      icon: isAuthenticated ? <LogoutIcon /> : <LoginIcon />, 
      text: isAuthenticated ? 'Logout' : 'Login',
      onClick: isAuthenticated ? handleLogout : () => navigate('/login')
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