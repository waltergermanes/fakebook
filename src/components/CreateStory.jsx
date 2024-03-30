import styled from '@emotion/styled';
import { CloudUpload } from '@mui/icons-material'
import { Alert, Avatar, Button, Card, CardActions, CardContent, CardHeader, Divider, Stack } from '@mui/material'
import React, { useState } from 'react'
import useAuth from '../hooks/useAuth';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';

const CreateStory = () => {
    const [imgUrl, setImgUrl] = useState(null)
    const axiosPrivate = useAxiosPrivate()
    const [isSuccess, setIsSuccess] = useState(false)
    const { auth } = useAuth()
    const queryClient = useQueryClient()

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

      const upload =(e)=>{
        const file = e.target?.files[0]
        if(file){
          setImgUrl(file)
        } 
      } 
     const postStory = async(story)=>{
      const { data } = await axiosPrivate.post(`/stories/story/`, story)
      return data
     }

     const { mutate, isPending } = useMutation({
      mutationKey: [`postStory`],
      mutationFn: postStory,
      onSuccess: ()=>{
        setIsSuccess(true)
        setImgUrl(null)
        queryClient.invalidateQueries({ queryKey: ['stories'] })
      }
     })
     const saveStory = async() =>{
      const data = new FormData()
        try {
              data.append('file', imgUrl)
              data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
              data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME)
              const { data: { url } } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data)
              mutate({ userID: auth.userId, url , type: `image`})         
      } catch (error) {  
        console.log(error)
      }
     }
  return (
        <Card >
            <CardHeader  avatar={
                                <Avatar 
                                        sx={{ cursor: "pointer" }}  
                                        aria-label="profilePhoto"
                                        src={auth?.profilePhoto}
                                        >
                                        { !auth?.profilePhoto && 
                                        auth.firstName?.charAt(0).toUpperCase() + 
                                        auth.lastName?.charAt(0).toUpperCase() 
                                        }
                                    </Avatar>
                                }
             
               title={auth.firstName +` `+auth.lastName}
                 />
                 <Divider/>
                 {
                  isSuccess && <Alert sx={{ m: 1 }} severity="success">Story created.</Alert>
                 }
            <CardContent sx={{ minHeight: 100, m: 1, gap: 2, display: `grid`, placeContent: `center`}}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUpload />}
                    >
                    Upload file
                    <VisuallyHiddenInput type="file" onChange={upload}/>
                </Button>
                <Stack maxHeight={200}>
                {
                imgUrl && <img src={URL.createObjectURL(imgUrl)} alt="" height= {`100%`} width={"100%"} style={{ objectFit: "contain" }}/>
                }
                </Stack>
            </CardContent>
            <CardActions sx={{ display: `flex`, alignItems: `flex-end` }}>
               {
                 auth.userId === `65476ef9b2e4aec8d2a8b46f` 
                 ? <Button sx={{bottom: 0, width: "100%", }} variant="contained" color="error" disabled>disabled</Button>
                 : <Button size='small' onClick={saveStory} variant='contained' disabled={!imgUrl || isPending}>Post Story</Button>

               }
                </CardActions>
              
        </Card>
  )
}

export default CreateStory