import { Facebook, Google } from '@mui/icons-material'
import { Stack, Typography, Button } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router'

const AuthLayout = () => {
  return (
    <>
      <Stack alignItems='center' justifyContent='center' sx={{ width: '100vw', height: '100vh'}}>
      <Stack flexDirection='row' gap={1} sx={{ width: '75%', border: 1}}>
         
          <Stack flex={1} gap={2} alignItems={'center'} sx={{ my: 3 }}>
                <Outlet/>
        
          </Stack>
       </Stack>
      </Stack>
    </>
  )
}

export default AuthLayout