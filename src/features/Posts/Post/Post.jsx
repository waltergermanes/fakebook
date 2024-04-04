import { AddReaction, Comment, Favorite, MoreVert, Share } from '@mui/icons-material'
import { Avatar, Box,  CardHeader, Divider, IconButton,  Stack, Typography, TextField, Button, CardActions, CardContent, Skeleton, Alert } from '@mui/material'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import CommentComponent from '../../../components/CommentComponent';
import { format } from 'timeago.js';
import UserGallery from '../../../components/UserGallery';
import useApi from '../../../hooks/useApi';
import CommentSkeleton from '../../loaders/CommentSkeleton';

const Post = ({ postId, user }) => { 

  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()
  const { fetchPostByID, getPostComment } = useApi()
  const [commentValue, setCommentValue] = useState('')
  const queryClient = useQueryClient()
  const [isLike, setIsLike] = useState(false)

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: [`post`, postId],
    queryFn: ()=> fetchPostByID(postId),
    enabled: !!postId
  })
  useEffect(() => {
    setIsLike(post?.likes?.includes(auth?.userId))
  }, [post?.likes])
  
  const addPostComment = async(value)=>{
    return await axiosPrivate.post(`/post/${postId}`, value)
  }

  const commentMutation = useMutation({
    mutationFn: addPostComment,
    mutationKey: [`comment`, postId],
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: [`comments`] })
    },
    onError: (err) =>{
      console.log(err)
    }
  })
  
  const { data: comments, isLoading: isCommentLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: ()=> getPostComment(postId),
    enabled: !!postId
  })
 
  const { mutate } = commentMutation
  const handleAddComment = ()=>{
    mutate({ userId: auth?.userId, comment: commentValue })
  }
  return (
    <>
    <Stack flexDirection={'column'}  >
    <CardHeader variant="small" avatar={<Avatar src={user.profilePhoto} aria-label={`${user.firstName} ${user.lastName}`}/>}
              action={
                <IconButton aria-label="settings">
                  <MoreVert />
                </IconButton>
              }
              title={`${user.firstName} ${user.lastName}`}
              subheader={format(post?.createdAt)}
            />
            <Divider/>
       <Stack direction={{ xs: `column`, md: `row` }} divider={<Divider orientation="vertical" flexItem />}>
       <Stack flex={1} justifyContent={"center"} alignItems={`center`} sx={{ maxWidth: { xs: `100%`, md: "50%" } }}>
         {
          post?.img.length ?  <UserGallery images={post?.img}/> :
          <CardContent sx={{ 
            minHeight: post?.bgcolor ? `90%` : 0,
            minWidth: post?.bgcolor ? `87%` : 0, 
            bgcolor: post?.bgcolor, 
            display: `flex`,
            textAlign: post?.bgcolor ? `center` : `left`,
            justifyContent: post?.bgcolor ? `center` : `left`,
            alignItems: `center`
            }}>
          <Typography sx={{ fontSize: post?.bgcolor ? { xs: 14, md: 18 } : 14 }} color="text.secondary">{ post?.desc }</Typography>        
          </CardContent>
         }
        </Stack>
        <Divider/>
        <Stack flex={1} minHeight={{ xs: comments?.length < 1 ? 100 : 300, md: 300 }}>
              <Box sx={{ height: {xs: 150 ,md: 230}, mb: 10 , overflowY: "scroll", p: 2,}}>
              <Typography variant="body1" sx={{ py: 1 }}>{post?.img.length ? post?.desc : ``}</Typography>
                  {
                   isCommentLoading ?  <CommentSkeleton/> 
                   :  comments?.length < 1 
                   ?  <Alert variant="outlined" severity="info">
                        no comment yet.
                      </Alert>
                   : comments?.map(comment=> <CommentComponent comment={comment} key={comment._id}/>)
                  }
              </Box>
           <Box  sx={{position: "fixed", top: 'auto', bottom: 0, width: {xs: "100%", md: "50%"}, backgroundColor: "background.default" }}>
           <CardActions sx={{ display: `flex`, flexDirection: `column`, alignItems: `start` }}>
            <Typography sx={{ ml: 2 }} variant="caption">{post?.likes?.length}</Typography>
            <Stack direction={`row`}>                 
                  <IconButton aria-label="add to favorites">
                    <Favorite color={isLike ? 'error' : ''}/>
                  </IconButton>
                  <IconButton aria-label="comment">
                    <Comment />
                  </IconButton>
              </Stack>
            <Typography sx={{ fontSize: 10 }} >{format(post?.createdAt)}</Typography>
            </CardActions>
            <Divider/>
             <Stack flexDirection="row" gap={1} sx={{ my: 1.2 }}>
                <IconButton flex={1} aria-label="comment">
                <AddReaction />
                </IconButton>
                  <TextField
                    flex={3}
                    sx={{ width: "90%", mt: 1 }}
                    size="small"
                    variant='standard'
                    placeholder="Add a comment..."
                    onChange={(e) => setCommentValue(e.target.value)}
                  />
                  {
                     auth.userId === `65476ef9b2e4aec8d2a8b46f` 
                     ? <Button sx={{bottom: 0, width: "100%", }} variant="contained" color="error" disabled>disabled</Button>
                    :  <Button disabled={commentMutation.isPending} onClick={handleAddComment} flex={1} variant="outlined" color="primary">Post</Button>

                  }
             </Stack>
           </Box>
        </Stack>
       </Stack>
    </Stack>
    </>
  )
}

export default React.memo(Post)