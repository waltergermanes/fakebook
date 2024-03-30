import React from 'react'
import useAuth from '../../hooks/useAuth'
import { Avatar, AvatarGroup, Stack, Typography } from '@mui/material'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

const Following = () => {
    const { userId } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const getFollowing = async ()=>{
        const { data } = await axiosPrivate.get(`/user/following/${userId}`) 
        return data
    }
    const { data: following } = useQuery({
        queryKey: [`following`, userId],
        queryFn: getFollowing,
        enabled: !!userId
    })
  return (
   <Stack direction={`row`} alignItems={`center`} gap={1}>
     <AvatarGroup max={4} sx={{'& .MuiAvatar-root': { width:25, height: 25, fontSize: 12 }}}>
       {
        following?.map(following=> (
            <Avatar key={following._id} sx={{ width: 25, height: 25,}} alt={following.firstName +` `+ following.lastName} src={following.profilePhoto} />
        ))
       }
    </AvatarGroup>
    <Typography variant='caption'>following</Typography>
   </Stack>
  )
}

export default Following