import React, { useState } from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  IconButton 
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function CartCard({ item, onQuantityChange, onRemove }) {
  const [imgSrc, setImgSrc] = useState(item.image);
  const navigate = useNavigate();

  const handleImageError = () => {
    setImgSrc('https://placehold.co/280x250/png?text=Product+Image');
  };

  const handleCardClick = (e) => {
    // Prevent navigation if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/product/${item.id}`);
  };

  return (
    <Card 
      sx={{ 
        width: '300px',
        height: '420px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        m: 'auto',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ 
        height: '250px',
        width: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <CardMedia
          component="img"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          image={imgSrc}
          alt={item.title}
          onError={handleImageError}
        />
        <IconButton 
          color="error"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'transparent',
            }
          }}
          onClick={() => onRemove(item.id)}
        >
          <Delete />
        </IconButton>
      </Box>
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 2,
        '&:last-child': { paddingBottom: 2 }
      }}>
        <Typography 
          variant="h6" 
          component="div" 
          color="primary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 1
          }}
          title={item.title}
        >
          {item.title}
        </Typography>
        <Box>
          <Typography 
            variant="body1" 
            color="success.main" 
            sx={{ mb: 1 }}
          >
            Price: ${(item.price * item.quantity).toFixed(2)}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small"
                onClick={() => onQuantityChange(item, item.quantity - 1)}
              >
                <RemoveCircleOutline />
              </IconButton>
              <Typography sx={{ minWidth: '40px', textAlign: 'center' }}>
                {item.quantity}
              </Typography>
              <IconButton 
                size="small"
                onClick={() => onQuantityChange(item, item.quantity + 1)}
              >
                <AddCircleOutline />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CartCard;
