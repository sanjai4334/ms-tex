import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
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

function Navbar({ isLoggedIn, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const drawerWidth = isCollapsed ? 80 : 240;

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
          <ListItem
            component="div"
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
          <ListItem
            button
            component={Link}
            to="/shop"
            sx={{
              padding: '0.8rem 1rem',
              justifyContent: 'flex-start',
              height: '56px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <StoreIcon />
            </ListItemIcon>
            <ListItemText
              primary="Shop"
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: 'opacity 0.3s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/favorites"
            sx={{
              padding: '0.8rem 1rem',
              justifyContent: 'flex-start',
              height: '56px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText
              primary="Favorites"
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: 'opacity 0.3s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          </ListItem>
          <ListItem
            button
            component={Link}
            to="/cart"
            sx={{
              padding: '0.8rem 1rem',
              justifyContent: 'flex-start',
              height: '56px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText
              primary="Cart"
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: 'opacity 0.3s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          </ListItem>
          <ListItem
            button
            sx={{
              padding: '0.8rem 1rem',
              justifyContent: 'flex-start',
              height: '56px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Profile"
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: 'opacity 0.3s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          </ListItem>
          <ListItem
            button
            sx={{
              padding: '0.8rem 1rem',
              justifyContent: 'flex-start',
              height: '56px',
            }}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              {isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
            </ListItemIcon>
            <ListItemText
              primary={isLoggedIn ? 'Logout' : 'Login'}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: 'opacity 0.3s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          </ListItem>
        </List>
      </Drawer>
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
        {React.Children.map(children, child =>
          React.cloneElement(child, { isNavExpanded: !isCollapsed })
        )}
      </Box>
    </Box>
  );
}

export default Navbar;
