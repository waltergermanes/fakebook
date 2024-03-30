import React, { useState } from 'react'
import { Typography, Avatar, Button, Stack, List, ListItemButton, ListItemAvatar, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAuth from '../hooks/useAuth'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useApi from '../hooks/useApi'
import FollowSuggestionSkeleton from '../features/loaders/FollowSuggestionSkeleton'
import FAB from './FAB'


const Sidebar = () => {
  const axiosPrivate = useAxiosPrivate()
  const { friendSuggestion } = useApi()
  const [loading, setLoading] = useState(null)
  const queryClient = useQueryClient()
  const { auth, isConnected } = useAuth()

  const followUser = async ({id})=> {
    return await axiosPrivate.put(`/user/follow/${id}`, { userId: auth?.userId })
  }

  const { data, isLoading} = useQuery({
    queryKey: [`friendSuggestion`],
    queryFn: ()=> friendSuggestion(auth?.userId),
    enabled: !!auth?.userId,
  })
  
  const followMutation = useMutation({
    mutationKey: [`follow`],
    mutationFn: followUser,
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['user'] })
      queryClient.invalidateQueries({ queryKey: ['friendSuggestion'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (err)=>{
      console.log(err)
    }
  })
  const { mutate, isPending } = followMutation
  const handleFollowUser = (id)=>{
    setLoading(id)
    mutate({ id })
  }
  return (
    <>
        <Stack alignItems={`center`}  flex={1} sx={{ display : { xs: "none", lg: "block",}}}>
        <Stack position='fixed' width="20%" >
        {/* <Typography variant="h6">{isConnected ? `connected` : `not connected`}</Typography> */}
         {
           isLoading
           ? <FollowSuggestionSkeleton/>
           :  data?.length - 1 > 0
           ? <Stack sx={{ maxHeight: ""}} >
               <Typography variant="body1">Following Suggestions</Typography>
               <List disablePadding={true} sx={{ maxHeight: 400, overflowY: `auto` }} >
            {  data?.filter((i, x)=> i._id !== auth?.userId && x < 10).map((user, i)=>{
                const name = `${user.firstName} ${user.lastName}`
                  return (
                   
                        <ListItemButton component={Link} to={`/profile/${user._id}`} key={i}>
                                  <ListItemAvatar >
                                  <Avatar
                                          alt={name.toUpperCase()}
                                          src={user.profilePhoto}
                                          sx={{ width: 37, height: 37, textDecoration: `none` }}
                                      />
                                  </ListItemAvatar>
                                  <ListItemText primaryTypographyProps={{fontSize: 14}}  primary={name.length > 12 ? name.substring(0, 12) + `...` : name} secondary={``}/>
                                  <Button onClick={()=> handleFollowUser(user._id)} variant='outlined' size='small' disabled={isPending && loading === user._id}>{isPending && loading === user._id ? 'following...' : 'Follow'}</Button>
                                </ListItemButton>
                  )
              })
            }
             </List>
         <Button LinkComponent={Link} to={'/friendSuggestions'} variant='outlined' size='small'>See more...</Button>
          </Stack>
         : <Typography variant="body1">No users available</Typography>

          }
          </Stack>
          <FAB/>
        </Stack>
    </>
  )
}

export default Sidebar