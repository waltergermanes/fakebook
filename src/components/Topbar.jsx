import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { Stack, Button } from '@mui/material'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AccountMenu from './AccountMenu'
import { Group, Home, Message } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const Topbar = () => {
  const iconStyle = { fontSize: { xs: 25, md: 35 }}
  return (
    <>
        <AppBar position="fixed" color="primary" sx={{ px: { sx: 3, md: 7 } }}>
        <Toolbar sx={{ display: "flex", justifyContent:"space-between"}}>
              <Stack flex={1} direction={"row"} alignItems={"center"}>
                  <IconButton edge="start" aria-label="logo">
                    <AddAPhotoIcon  sx={iconStyle}/>
                    </IconButton >
                    <Typography component="div" sx={{ flexGrow: 1, fontSize: { xs: 12, md: 20 }}}>
                    FakeBook
                    </Typography>
              </Stack>
              <Stack flex={1} direction={"row"} justifyContent={"space-between"}>
                  <IconButton LinkComponent={Link} to={'/'} edge="start" color="inherit" aria-label="menu">
                    <Home sx={iconStyle}/>
                  </IconButton>
                  <IconButton LinkComponent={Link} to={'/friendSuggestions'} edge="start" color="inherit" aria-label="menu">
                    <Group  sx={iconStyle}/>
                  </IconButton>
                  <IconButton LinkComponent={Link} to={'/message'} edge="start" color="inherit" aria-label="menu">
                    <Message  sx={iconStyle}/>
                  </IconButton>
              </Stack>
           <Stack flex={1} direction={`row`} justifyContent={`flex-end`}>
           <AccountMenu/>
           </Stack>
        </Toolbar>
        </AppBar>
    </>
  )
}

export default Topbar