import React from 'react'
import { useOutletContext } from 'react-router';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Box, IconButton, ImageListItemBar, Typography } from '@mui/material';
import { Info } from '@mui/icons-material';

const UserGallery = () => {
    const [ user, userId ] = useOutletContext();

  return (
    
    <Box sx={{ width: 860, mt: 2}}>
    <ImageList variant="masonry" cols={3} gap={4}>
    {user.userPosts.map((item, index) => (
      <ImageListItem key={index}>
        <img
          srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
          src={`${item}?w=248&fit=crop&auto=format`}
          alt={item}
          loading="lazy"
        />
      </ImageListItem>
    ))}
  </ImageList>
  </Box>
  )
}

export default UserGallery