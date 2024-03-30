import React from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { Avatar, List, ListItemAvatar, ListItemButton, ListItemText, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'

const Comments = () => {
  const axiosPrivate = useAxiosPrivate()
  const { auth }= useAuth()
  const getCommentPosts = async() =>{
    const { data } = await axiosPrivate.get(`/post/comments/${auth.userId}`)
    return data
  }

  const { data: comments } = useQuery({
    queryKey: [`comments`, auth.userId],
    queryFn: getCommentPosts
  })
  return (
   <Stack>
       <List sx={{ maxHeight: 350, overflowY: `auto` }} >
            {  comments?.map((comment, i)=>{
                const name = `${comment.postId.postedBy.firstName} ${comment.postId.postedBy.lastName}`
                const postedBy = comment.postId.postedBy._id === auth.userId 
                  return (
                   
                        <ListItemButton key={i}>
                                  <ListItemAvatar >
                                  <Avatar
                                         component={Link}
                                         to={`/profile/${comment.postId.postedBy._id}`}
                                          alt={name.toUpperCase()}
                                          src={comment.postId.postedBy.profilePhoto}
                                          sx={{ width: 50, height: 50, textDecoration: `none` }}
                                      />
                                  </ListItemAvatar>
                                  <ListItemText  primary={ postedBy ? `You comment your own post` : `You comment ${name} post.`} secondary={comment.comment+` • `+ format(comment.createdAt)}/>
                        </ListItemButton>
                  )
              })
            }
        </List>
   </Stack>
  )
}

export default Comments