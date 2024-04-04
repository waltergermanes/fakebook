import React from 'react'
import Feed from './Feed'
import RightBar from '../../components/RightBar'
import Sidebar from '../../components/Sidebar'
import { Stack } from '@mui/material'
import Stories from '../../components/Stories'

const Timeline = () => {
  return (
    <>
    <Sidebar/>
      <Stack width={{ md: `50%`, xs: `100%` }} sx={{ px: { sx: 3 } }} gap={1}>
      <Stories/>
            <Feed/>
        
      </Stack>
      <RightBar/>
    </>
  )
}

export default Timeline