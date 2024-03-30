import { Avatar, Button, List, ListItemButton, ListItemAvatar, ListItemText, Typography, Alert } from '@mui/material'
import React from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

const UserFollowers = () => {
  const {  userId } = useParams()
  const axiosPrivate = useAxiosPrivate()
  const getFollowers = async ()=>{
      const { data } = await axiosPrivate.get(`/user/followers/${userId}`) 
      return data
  }
  const { data: followers, isError, error} = useQuery({
      queryKey: [`followers`, userId],
      queryFn: getFollowers,
      enabled: !!userId
  })
  return (
    <List disablePadding={true} sx={{ mt: 1, width: 400, maxHeight: 400, overflowY: `auto` }} >
      {
       followers?.length < 1 ? <Alert variant="outlined" severity="info">
                                No followers yet.
                              </Alert>
       :
       followers?.map(follower=>(
        <ListItemButton key={follower._id}>
        <ListItemAvatar >
          <Avatar
              component={Link}
              to={`/profile/${follower._id}`}
              alt={follower.firstName.toUpperCase()}
              src={follower.profilePhoto}
             sx={{ width: 37, height: 37, textDecoration: `none` }}
                            />
          </ListItemAvatar>
          <ListItemText primaryTypographyProps={{fontSize: 14}}  primary={follower.firstName +` `+ follower.lastName} secondary={``}/>
      
    </ListItemButton>       
      ))
      }  
    </List>
  )
}

export default UserFollowers