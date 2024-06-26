import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { Alert, Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Stack } from '@mui/material'
import { Link } from 'react-router-dom'

const Likes = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth }= useAuth()
  const getLikePosts = async() =>{
    const { data } = await axiosPrivate.get(`/post/likes/${auth.userId}`)
    return data
  }

  const { data: likes, isLoading } = useQuery({
    queryKey: [`likes`, auth.userId],
    queryFn: getLikePosts
  })

  return (
   <Stack>
       <List sx={{ maxHeight: 500, width: `75vw`, overflowY: `auto` }} >
            {  
              isLoading ? `Loading`: likes.length < 1 
              ? <Alert sx={{ width: `75vw` }} severity="info">You havent like a post yet.</Alert>  
              : likes?.map((post, i)=>{
                const name = `${post.postedBy.firstName} ${post.postedBy.lastName}`
                const postedBy = post.postedBy._id === auth.userId 
                  return (
                   
                        <ListItemButton key={i}>
                                  <ListItemAvatar >
                                  <Avatar
                                         component={Link}
                                         to={`/profile/${post.postedBy._id}`}
                                          alt={name.toUpperCase()}
                                          src={post.postedBy.profilePhoto}
                                          sx={{ width: 50, height: 50, textDecoration: `none` }}
                                      />
                                  </ListItemAvatar>
                                  <ListItemText  primary={ postedBy ? `You like your own post` : `You likes ${name} post.`} secondary={``}/>
                        </ListItemButton>
                  )
              })
            }
        </List>
      
   </Stack>
  )
}

export default Likes