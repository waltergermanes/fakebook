import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Avatar, AvatarGroup, Stack, Typography } from '@mui/material'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

const Followers = () => {
    const {  auth } = useAuth()
    const { userId } = useParams()
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
    <Stack direction={`row`} alignItems={`center`} gap={1}>
     <AvatarGroup max={4} sx={{'& .MuiAvatar-root': { width:25, height: 25, fontSize: 12 }}}>
       {
        followers?.map(follower=> (
            <Avatar key={follower._id} sx={{ width: 25, height: 25,}} alt={follower.firstName +` `+ follower.lastName} src={follower.profilePhoto} />
        ))
       }
    </AvatarGroup>
    <Typography variant='caption'>followers</Typography>
   </Stack>
  )
}

export default Followers