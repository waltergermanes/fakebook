import { Skeleton } from '@mui/material'
import React from 'react'

const CommentSkeleton = () => {
  return (
    <>
        {
            [0, 1, 2].map((c, i)=>(
                <Skeleton
                    key={i}
                    animation="wave"
                    height={70}
                    width="100%"
                />
            ))
        }
    </>
  
  )
}

export default CommentSkeleton