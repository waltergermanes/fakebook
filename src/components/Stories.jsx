import { Avatar, Box, IconButton, Paper, Stack, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import useAuth from '../hooks/useAuth'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import Story from './Story'
import StorySkeleton from '../features/loaders/StorySkeleton'

const Stories = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const [slider, setSlider] = useState(0)
  const getStories = async() =>{
    const { data } = await axiosPrivate.get(`/stories/${auth.userId}`)
    return data
  }
  const { data: stories, isLoading } = useQuery({
    queryFn: getStories,
    queryKey: [`stories`]
  })
   const ref = useRef()
   const handleClick = (direction) =>{
    const distance = ref.current.getBoundingClientRect().left - 356
  
    if (direction === `left` && slider > 0) {
      setSlider(prev => prev - 1)
      ref.current.style.transform = `translateX(${130 + distance}px)`
    }
    if (direction === `right` && slider < stories?.length) {
      setSlider(prev => prev + 1)
      ref.current.style.transform = `translateX(${-130 + distance}px)`
    }
   }
  return (
   <Stack position={`relative`}
           width={`100%`}
          direction={`row`} 
          overflow={`hidden`} 
          alignItems={`center`} py={1}>  
            
    <IconButton color='info' onClick={(()=> handleClick(`left`))} 
                      sx={{ 
                      position: `absolute`, 
                      left: 10, 
                      zIndex: 1,
                      display: slider === 0 && `none`
                      }}>
      <ArrowBackIos/>   
    </IconButton>
      <Stack direction={`row`} 
             width={`max-content`}
             gap={1}
             px={1}
             ref={ref} 
             sx={{  transition: `all .5s ease`, 
                    transform: `translateX(0)`}} 
                    >
      {
        isLoading ? <StorySkeleton/> : stories?.map(story=> <Story key={story._id} story={story}/>)
      }
      </Stack>
    <IconButton onClick={(()=> handleClick(`right`))} sx={{ 
                                                            position: `absolute`, 
                                                            right: 10, 
                                                            zIndex: 1,
                                                            display: slider === stories?.length && `none`
                                                            }}>
    <ArrowForwardIos/> 
    </IconButton>
   </Stack> 
   )
}

export default Stories