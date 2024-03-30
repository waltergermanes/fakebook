import { CardHeader, Skeleton } from '@mui/material'
import React from 'react'

const ConvoSkeleton = () => {
  return (
   <>
        {
            [1, 2, 3, 4].map((_, index)=> (
                <CardHeader
                    key={index}
                    avatar={ <Skeleton animation="wave" variant="circular" width={40} height={40} /> }
                    title= {
                        <Skeleton
                        animation="wave"
                        height={10}
                        width="80%"
                        style={{ marginBottom: 6 }}
                        />
                        }
                    subheader={ <Skeleton animation="wave" height={10} width="40%" /> }
                />
            ))
        }
   </>
  )
}

export default ConvoSkeleton