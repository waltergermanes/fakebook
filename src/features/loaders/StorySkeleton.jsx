import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const StorySkeleton = () => {
  return (
    <Stack direction={`row`} gap={1}>
       {
          [1,2,3,4].map((_, i)=>(
            <Skeleton key={i} variant="rounded" width={130} height={200} />
          ))
       }
    </Stack>
  )
}

export default StorySkeleton