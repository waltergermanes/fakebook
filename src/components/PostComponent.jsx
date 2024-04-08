import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton, Stack, Typography, Button, AvatarGroup, backdropClasses, Collapse } from '@mui/material';
import { Comment, Favorite, MoreVert, Share } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import ModalComponent from './ModalComponent';
import Post from '../features/Posts/Post/Post';
import { useMutation } from '@tanstack/react-query';
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


const PostComponent = React.forwardRef(({ post }, ref) => {

  const { auth } = useAuth() 
  const axiosPrivate = useAxiosPrivate()

  const [open, setOpen] = useState(false);
  const [like, setLike] = useState(post?.likes?.length)
  const [isLike, setIsLike] = useState(false)
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
   
  useEffect(() => {
    setIsLike(post?.likes?.includes(auth?.userId))
  }, [post.likes])
  
  const likePost = (id) =>{
    return axiosPrivate.put(`/post/${post._id}/like`, {userId: id.userId})
  } 

  const likeMutation = useMutation({
    mutationKey: [`like`],
    mutationFn: likePost,
    onSuccess: ()=>{
      queryClient.invalidateQueries({ queryKey: ['like'] })
    }
  })
  
  const likeHandler = ()=>{
    likeMutation.mutate({userId: auth.userId})
    setLike(prev => isLike ? prev - 1 : prev + 1)
    setIsLike(!isLike)
  }
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const url = post.img
    let imgContent 
    if (url?.length === 0) {
      imgContent = ``
  }
    if (url?.length === 1) {
        imgContent =(
          <CardMedia
                    sx={{ objectFit: `contain` }}
                    component="img"
                    height="194"
                    width={`100%`}
                    image={url[0]}
                    alt="Paella dish"
                  />
      )
    }
    if (url?.length === 2) {
      imgContent =(
        <Stack sx={{ height: 300 }}  gap={.2}>
        <img src={url[0]} style={{ objectFit: "cover", width: "100%", height:"50%" }} alt="" />
        <img src={url[1]} style={{ objectFit: "cover", width: "100%", height:"50%" }} alt="" />
      </Stack>
    )
    }
    if (url?.length === 3) {
      imgContent =(
        <Stack sx={{ height: 300 }} flexDirection="row" flexWrap ="wrap" gap={.2}>
          <img src={url[0]} style={{ objectFit: "cover", width: "100%", height:"50%" }} alt="" />
          <img src={url[1]} style={{ objectFit: "cover", width: "49%", height:"50%" }} alt="" />
          <img src={url[2]} style={{ objectFit: "cover", width: "49%", height:"50%" }} alt="" />
        </Stack>
    )
    }

    if (url?.length === 4) {
      imgContent =(
        <Stack flexDirection="row" sx={{ height: 300,}} gap={.2}>
          <Stack  flex={2} >
          <img src={url[0]} style={{ objectFit: "cover", width: "100%", height:"100%" }} alt="" />
          </Stack>
          <Stack flex={1} gap={.2}>
            <img src={url[1]} style={{ objectFit: "cover", width: "100%", height:"33%" }} alt="" />
            <img src={url[2]} style={{ objectFit: "cover", width: "100%", height:"33%" }} alt="" />
            <img src={url[3]} style={{ objectFit: "cover", width: "100%", height:"33%" }} alt="" />
          </Stack>
        </Stack>
    )
    }
    if (url?.length === 5) {
      imgContent =(
        <Stack sx={{ height: 300 }} flexDirection="row" flexWrap ="wrap" gap={.2}>
        <img src={url[0]} style={{ objectFit: "cover", width: "50%", height:"50%" }} alt="" />
        <img src={url[1]} style={{ objectFit: "cover", width: "49%", height:"50%" }} alt="" />
        <img src={url[2]} style={{ objectFit: "cover", width: "33%", height:"50%" }} alt="" /> 
        <img src={url[3]} style={{ objectFit: "cover", width: "33%", height:"50%" }} alt="" />
        <img src={url[4]} style={{ objectFit: "cover", width: "33%", height:"50%" }} alt="" />
      </Stack>
    )
    }

    if (url?.length > 5) {
      imgContent =(
        <Stack sx={{ height: 300 }} flexDirection="row" flexWrap ="wrap" gap={.2}>
        <img src={url[0]} style={{ objectFit: "cover", width: "50%", height:"50%" }} alt="" />
        <img src={url[1]} style={{ objectFit: "cover", width: "49%", height:"50%" }} alt="" />
        <img src={url[2]} style={{ objectFit: "cover", width: "33%", height:"50%" }} alt="" /> 
        <img src={url[3]} style={{ objectFit: "cover", width: "33%", height:"50%" }} alt="" />
        <Box onClick={handleOpen} sx={{ 
          position: "relative", 
          width: "33%", 
          height:"50%", 
          cursor: "pointer", 
        }}>
        <Box sx={{
          position: "absolute",
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          width: "100%",
          height: "100%",
         }}>
         <Typography sx={{ 
          position: "absolute", 
          zIndex: 1, 
          fontWeight: "bold", 
          top: "50%", 
          right: "50%",
          color: "#fff"
          }} variant= "h6">+ {url?.length - 5}</Typography>
         </Box>
         <img src={url[3]} style={{ objectFit: "cover", width: "100%", height:"100%",  }} alt="" />
        </Box>
      </Stack>
    )
    }
   

    const postBody = (
      <>
        <Card sx={{ width: "100%",}}>
          <CardHeader  avatar={
              <Avatar component={Link} to={`/profile/${post?.postedBy?._id}`} 
                    sx={{ cursor: "pointer" }}  
                    aria-label="profilePhoto"
                    src={post?.postedBy?.profilePhoto}
                    >
                    { !post?.postedBy?.profilePhoto && 
                       post?.postedBy.firstName?.charAt(0).toUpperCase() + 
                       post?.postedBy.lastName?.charAt(0).toUpperCase() 
                    }
                </Avatar>
               }
               action={
                 <IconButton aria-label="settings">
                   <MoreVert />
                 </IconButton>
               }
               title={
                `${post?.postedBy.firstName?.charAt(0).toUpperCase() + 
                   post?.postedBy.firstName?.slice(1)} 
                   ${post?.postedBy.lastName?.charAt(0).toUpperCase() + 
                   post?.postedBy.lastName?.slice(1)}`}
               subheader={format(post.createdAt)}
                 />
                { post?.img?.length ? imgContent : ``}
                <CardContent sx={{ 
                                minHeight: post?.bgcolor ? 200 : 0, 
                                bgcolor: post?.bgcolor, 
                                display: `flex`,
                                textAlign: post?.bgcolor ? `center` : `left`,
                                justifyContent: post?.bgcolor ? `center` : `left`,
                                alignItems: `center`
                                }}>
                  <Typography variant={post?.bgcolor ? `h4` : `body2`} color="text.secondary">{ post.desc }</Typography>        
                </CardContent>
                <CardActions sx={{ display: `flex`, alignItems: `flex-end` }}>
                  <Stack justifyContent={`center`} alignItems={`center`}>                 
                    <Typography variant="caption">{`${like} ${post?.likes?.length > 1 ? `likes` : `like` }`}</Typography>
                    <IconButton onClick={likeHandler} aria-label="add to favorites">
                      <Favorite  color={isLike ? 'error' : ''}/>
                    </IconButton>
                  </Stack>
                  <IconButton onClick={handleOpen} aria-label="comment">
                  <Comment />
                  </IconButton>
                </CardActions>
              </Card>
              <ModalComponent open={open} handleClose={handleClose} style={{ width: { xs: 380, md: 900 }, maxHeight: 430 }}>
                  <Post postId = { post?._id } user={post?.postedBy}/>
                </ModalComponent> 
          
       </>
  );
  const content =  ref 
        ? <Stack sx={{ width: "100%"}} ref={ref}>{postBody}</Stack>
        : <Stack sx={{ width: "100%"}}>{postBody}</Stack>
 return content
})
export default PostComponent
