import { AddPhotoAlternate, Cancel, CloudUpload } from '@mui/icons-material'
import { Avatar, Card, CardContent, CardHeader, Divider, Stack, Typography, TextField, Button, Paper, Box, IconButton, Grid, Alert } from '@mui/material'
import React, {useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAuth from '../hooks/useAuth'
import useApi from '../hooks/useApi'
import styled from '@emotion/styled'

const CreatePost = () => {
  const { createPost } = useApi()
  const [imgSrc, setImgSrc] = useState([])
  const [imgUrl, setImgUrl] = useState([])
  const [showAddPic, setShowAddPic] = useState(false)
  const [postDesc, setPostDesc] = useState('')
  const [postBgColor, setPostBgColor] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const queryClient = useQueryClient()
  const { auth } = useAuth()

  const upload =(e)=>{
    const files = e.target?.files
    if(files){
      setImgSrc(prev=> [...prev, ...files])
      const imgArray = Array.from(files).map(img=> URL.createObjectURL(img))
      setImgUrl(prev=> [...prev, ...imgArray])
    } 
  } 
  
  const postMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data)=>{
      setIsSuccess(true)
      setImgUrl([])
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
   },  onError: err =>{
    console.log(err)
   }
  })

  const { mutate } = postMutation
  const handlePost= async ()=>{
    const data = new FormData()
    let imgUrls = []
      try {
          for(const i of imgSrc){
            data.append('file', i)
            data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
            data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME)
            const {data: { url } } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data)
            imgUrls.push(url)
            }
    } catch (error) {  
      console.log(error)
    } 
   mutate({ postedBy: auth?.userId, desc: postDesc, bgcolor: postBgColor, img: imgUrls, likes: [] })
  }
  const handlePostdesc = (e) =>{
    setPostDesc(e.target.value)
    postDesc.length > 100 && setPostBgColor(``)
  }
  const handleBgColor = (color) =>{
     setPostBgColor(color)
    postDesc.length > 100 && setPostBgColor(``)
  }

  const handleRemovePic = (i)=>{
    setImgUrl(prev=> prev.filter((img, index)=> index !== i))
    setImgSrc(prev=> prev.filter((img, index)=> index !== i))
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
 
  return (
    <> 
    <Card sx={{ minHeight: "100%" }}>
     <Divider/>
        <CardHeader avatar={ <Avatar src={auth.profilePhoto} aria-label="profile-photo"/>}
                    title={`${auth.firstName} ${auth.lastName}`} 
        />
         {
          isSuccess && <Alert sx={{ mx: 1 }} severity="success">Post created.</Alert>
         }
        <CardContent>
        <Stack gap={2} sx={{position: 'relative', mt: -2 , p: -5,}}>
         <Stack sx={{ bgcolor:
                      !showAddPic ? postBgColor && postDesc.length < 100 && postBgColor : `` , 
                      height: 
                      !showAddPic ? postBgColor && postDesc.length < 100 && 200 : `` }}>
         <TextField
            onChange={handlePostdesc} 
            sx={{ width: "100%", fontSize: 40 }}
            multiline
            variant='standard'
            placeholder='Whats on your mind?'
            InputProps={{ disableUnderline: true, style: { fontSize: showAddPic ? 16 : 32 } }}
          />
         </Stack>
          { 
            showAddPic &&
            <Card variant="outlined" sx={{  minHeight: 150, maxHeight: 250, overflow: `auto`}}>
            <Stack sx={{ position: `relative` }} alignItems={`center`} justifyContent={`center`} minHeight={150}>
              <Button
                sx={{ my: 1,  position: `fixed`, zIndex: 1 }}
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
              >
                Upload Picture
                <VisuallyHiddenInput type="file" hidden multiple onChange={upload}  />
              </Button>
            </Stack>
             <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1}>
                  {
                    imgUrl?.map((img, index)=>(
                      <Grid key={index} position={`relative`} item xs={6} md={6}>
                          <IconButton onClick={()=> handleRemovePic(index)} sx={{ position: `absolute`, top: 7, right: 2 }} color='error' aria-label="cancel">
                            <Cancel/>
                          </IconButton>
                         <img key={index} src={img} alt="" width={`100%`} height={150} style={{objectFit: "cover" }}/>
                      </Grid>
                    ))
                  } 
                  </Grid>
                </Box>
            </Card> 
            }
            {
              !showAddPic && <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  '& > :not(style)': {
                                    m: 1,
                                    width: 25,
                                    height: 25,
                                  },
                                }}
                              >
                              <Paper sx={{ bgcolor: `grey`, cursor: `pointer`}}onClick={()=> handleBgColor( ``)}/>
                              <Paper sx={{ bgcolor: `green`, cursor: `pointer` }} onClick={()=> handleBgColor( `green`)}/>
                              <Paper sx={{ bgcolor: `blue`, cursor: `pointer`}} onClick={()=> handleBgColor( `blue`)}/>
                              <Paper sx={{ bgcolor: `orange`, cursor: `pointer`}} onClick={()=> handleBgColor( `orange`)}/>
                        </Box>
          }  
          {
            !imgUrl?.length && <Card sx={{ px: 1}}>
                                <Stack direction={`row`} alignItems={`center`}>
                                  <Stack flex={1}>
                                    <Typography variant="body1" color="initial">Add to your post</Typography>
                                  </Stack>
                                  
                                    <IconButton>
                                    <AddPhotoAlternate onClick={()=> setShowAddPic(true)} fontSize={`large`}/>
                                    </IconButton> 
                                </Stack>
                            </Card>
            
          }
          {
            auth.userId === `65476ef9b2e4aec8d2a8b46f` 
            ? <Button sx={{bottom: 0, width: "100%", }} variant="contained" color="error" disabled>disabled</Button>
            : <Button onClick={handlePost} sx={{bottom: 0, width: "100%", }} variant="contained" color="primary" disabled={!imgUrl.length && !postDesc}> Post </Button>

          }
        </Stack>
      </CardContent>
      </Card>
    </>
  )
}

export default CreatePost