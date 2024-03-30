import React from 'react'
import Topbar from './Topbar'
import { Outlet } from 'react-router'
import {  Stack } from '@mui/material'

const Layout = () => {
  return (
    <>
      <Topbar/>
        <Stack  bgcolor="background.default"
                color="text.primary"  
                justifyContent='space-between' 
                alignContent='center'  
                spacing={5} 
                flexDirection='row'
                marginTop={8}
                py={{ xs: 1, md: 3}}
                px={{ sx: 3, md: 10}}
                >         
                <Stack flex={4} flexDirection='row' gap={{ sx: 0, md: 4 }} >
                  <Outlet/>
                </Stack>
        </Stack>
    </>
  )
}

export default Layout