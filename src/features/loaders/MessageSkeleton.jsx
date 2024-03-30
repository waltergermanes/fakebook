import { Skeleton, Stack } from '@mui/material'
import React from 'react'

const MessageSkeleton = () => {
  return (
   <>
        {
            [1, 2, 3, 4].map((item, index)=> (
                <Stack key ={index} direction={item % 2 === 1 ? `row` : `row-reverse`} width={`100%`} alignItems={`center`} gap={1}>
                        <Skeleton animation="wave" variant="circular" width={40} height={40} />
                        <Stack width={`80%`} alignItems={item % 2 === 1 ? `flex-start` : `flex-end`}>
                            <Skeleton
                                animation="wave"
                                height={10}
                                width={`40%`}
                               
                                />
                            <Skeleton animation="wave" height={50} width="80%" />    
                        </Stack>
                    </Stack>
                   
            ))
        }
   </>
  )
}

export default MessageSkeleton