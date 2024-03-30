import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const FollowSuggestionSkeleton = () => {
  return (
   <>
     <Stack spacing={1} width={`100%`}>
      {
        [0, 1, 2, 3, 5].map((item, index)=>(
            <Stack key={index} direction={`row`} flex={1} gap={1} alignItems={`center`}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" sx={{ fontSize: '1rem' }} width={`50%`}/>    
                <Skeleton variant="rounded" width={50} height={30} />
            </Stack>
        ))
      }
    </Stack>
   </>
  )
}

export default FollowSuggestionSkeleton