import { Avatar, Box, CardActionArea, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const Story = ({story}) => {
  const { auth } = useAuth()
  const user = story?.userData[0]
  
   const isStoryViewed = story?.viewers.some(viewer => viewer.userId === auth.userId)
  const storyStyle = {  
    height: 200,
    width: `130px`,
    display:` grid`, 
    placeContent: `center`,
    objectFit:`cover`, 
    transition: "0.3s", 
    transformOrigin: `50% 50%`,
    '&:hover': {
        transform: "scale(1.1)",
    },
   }
  return (
    <Paper  sx={{ 
      position: `relative`,  
      display: `inline-block`, 
      overflow: `hidden`,
      height: 200, 
      width: 130,
      cursor: `pointer`, 
      borderRadius: 2, }}>
      <CardActionArea LinkComponent={Link} to={`/stories/${story._id}`}>
      <Box sx={{
            position: "absolute",
            background: "rgba(0, 0, 0, 0.3)",
           }}/>
      <Box component={`img`} sx={storyStyle} src={story?.url}/>
        <Avatar src={user?.profilePhoto} sx={{ position: `absolute`, top: 10, left: 10, height: 30, width: 30, border: 4, borderColor: isStoryViewed ? `silver` : `blue` }}/>
        <Typography sx={{ position: `absolute`, 
                          bottom: 10, 
                          left: 10, }} 
                    variant="caption" 
                    color={`Background`}>{auth.userId === user?.firstName +` `+ user.lastName}</Typography>
      </CardActionArea>
      </Paper> 
  )
}

export default Story