import { Grid } from '@mui/material'
import React from 'react'

const Gallery = ({img}) => {
  return (
    <Grid item xs={3} md={4} gap={0}>                     
        <img style={{ objectFit: `cover` }} src={img} height={100} width={`100%`}/>
    </Grid>
  )
}

export default Gallery