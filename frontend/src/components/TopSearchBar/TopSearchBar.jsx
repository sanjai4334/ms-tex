import React from 'react';
import { Box, TextField, InputAdornment, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const TopSearchBar = ({ searchQuery, onSearchChange, isNavExpanded }) => {
  return (
    <Box sx={{ 
      height: '56px',
      p: '0.6rem',
      borderBottom: 1,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 1.5
    }}>
      {!isNavExpanded && (
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            whiteSpace: 'nowrap',
            marginRight: 'auto'
          }}
        >
          MS-Tex Retails
        </Typography>
      )}
      <TextField
        size="small"
        placeholder="Search products..."
        value={searchQuery}
        onChange={onSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          width: '75%',
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.default',
          }
        }}
      />
    </Box>
  );
};

export default TopSearchBar;
