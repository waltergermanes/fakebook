import React, { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography, Button, Avatar, Fab, Tabs, Tab, Card, Slide, Skeleton, AvatarGroup, } from '@mui/material'
import { Outlet, useLocation, useParams } from 'react-router'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import useApi from '../hooks/useApi'
import useAuth from '../hooks/useAuth'
import { ArtTrack, Ballot, CameraAlt, Diversity3, PersonPin } from '@mui/icons-material'
import axios from '../api/axios'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { Link } from 'react-router-dom'
import Following from '../features/Profile/Following'
import Followers from '../features/Profile/Followers'

const UserProfile = () => {
  const { userId } = useParams()
  const { getUserInfo } = useApi()
  const axiosPrivate = useAxiosPrivate()
  const { auth } = useAuth()

  const queryClient = new QueryClient()
  const { pathname } = useLocation()
  const currentTab = pathname.split(`/`)[3]

  const [profilePic, setProfilePic] = useState(null)
  const [coverPic, setCoverPic] = useState(null)
  const [value, setValue] = useState(currentTab || 0);
  const [open, setOpen] = useState(false)
  const [isLoadingCoverPicButton, setIsLoadingCoverPicButton] = useState(false)
  const [isLoadingProfilePicButton, setIsLoadingProfilePicButton] = useState(false)
  const profilePicRef = useRef();
  const coverPicRef = useRef();
  const containerRef = useRef(null);

  queryClient.invalidateQueries({ queryKey: ['posts'] })
  
  const updateUserProfile = async(data)=>{
    return await axiosPrivate.put(`/user/${userId}`, data)
  }

  const { data: user, isLoading: profileLoading, isError, error, } = useQuery({
      queryKey: ['user', userId],
      queryFn: () => getUserInfo(userId),
      enabled: !!userId,
  })
  const handleChangeTabValue = (event, newValue) => setValue(newValue)
  const handleChangeProfilePic =(e)=>{
    const file = e.target?.files[0]
   setProfilePic(file)
  }
  const handleChangeCoverPic =(e)=>{
    const file = e.target?.files[0]
   setCoverPic(file)
  }

const { mutate, isPending: isPendingProfilePhoto } = useMutation({
    mutationFn: updateUserProfile,
    mutationKey: [`updateUser`],
   
    onError: (data) => console.log(data)
})
const handleSavePic = async() =>{
   if(profilePic && !coverPic){
    setIsLoadingProfilePicButton(true)
    const data = new FormData()
    try {
        data.append('file', profilePic)
        data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME)
        const {data: { url } } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data)
        mutate({ profilePhoto: url }) 
        setIsLoadingProfilePicButton(false)
        setProfilePic(null)
    } catch (error) {  
    console.log(error)
    } 
   }
   if(coverPic && !profilePic){
    setIsLoadingCoverPicButton(true)
    const data = new FormData()
    try {
        data.append('file', coverPic)
        data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME)
        const {data: { url } } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data)
        mutate({ coverPhoto: url }) 
        setIsLoadingCoverPicButton(false)
        setCoverPic(null)
    } catch (error) {  
    console.log(error)
    } 
   }
   if(coverPic && profilePic){
    setIsLoadingProfilePicButton(true)
    setIsLoadingCoverPicButton(true)
    const data = new FormData()
    try {
        let imgUrl = []
        for(const i of [profilePic, coverPic]){
            data.append('file', i)
            data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
            data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME)
            const {data: { url } } = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, data)
            imgUrl.push(url)
            mutate({ profilePhoto: imgUrl[0], coverPhoto: imgUrl[1] }) 
            setIsLoadingProfilePicButton(false)
            setIsLoadingCoverPicButton(false)
            setProfilePic(null)
            setCoverPic(null)
        }
     console.log(imgUrl, 5)
    } catch (error) {  
    console.log(error)
    } 
   }
}

const isActive = () =>{
    window.scrollY > 200 ? setOpen(true) : setOpen(false) 
}
useEffect(() => {
  window.addEventListener(`scroll`, isActive)

  return () => {
    window.removeEventListener(`scroll`, isActive)
  }
}, [])

const followUser = async ({id})=> {
    return await axiosPrivate.put(`/user/follow/${id}`, { userId: auth?.userId })
  }

  const { mutate: followMutation, isPending } = useMutation({
    mutationKey: [`unfollow`],
    mutationFn: followUser,
    onSuccess: (data)=>{
        console.log(data)
        queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })

  const unFollowUser = (id) => {
    followMutation({ id })
  }
  let content = ''
  content = (
        <>
        <Stack flex={3} sx={{  px: { md: 10, xs: 1} }}>
            <Stack  alignItems={`center`} >
            { open && 
                    <Stack ref={containerRef} sx={{ position: `fixed`, width: `100%`, zIndex: 2, mt: -3}}>
                        <Slide in={open} container={containerRef.current}>
                            <Card>
                                <Stack direction={`row`} sx={{ px: { sx: 5, md: 24 } }}>
                                    <Stack alignItems={`center`} gap={1} direction={`row`} p={1.5}>
                                        <Avatar src={user?.profilePhoto}/>
                                        <Typography variant="body1">{`${user?.firstName} ${user?.lastName}`}</Typography>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Slide>
                    </Stack>
            }
            </Stack>
            <Stack sx={{ position: `relative`, }}> 
            {
                profileLoading ?  <Skeleton sx={{ height: 200 }} animation="wave" variant="rectangular" />
                               :      <Box sx={{ 
                                            width: '100%', 
                                            height: 200 ,  
                                            borderRadius: 1, 
                                            objectFit: 'cover'
                                            }} 
                                            component='img' 
                                            src={coverPic ? URL.createObjectURL(coverPic) : user?.coverPhoto}
                                        />
            }  
              
            { userId === auth?.userId && user &&
                (
                    <Stack>
                    {
                       coverPic || profilePic ?
                       <Button onClick={handleSavePic} disabled = {isLoadingProfilePicButton || isLoadingCoverPicButton} style={{ position: `absolute`, right: 100, bottom: 20 }} variant="contained" color="primary">Save changes </Button>
                       : ``
                    }
                       <label style={{ position: `absolute`, right: 20, bottom: 20, cursor: `pointer`, zIndex: 1 }} onClick={()=> coverPicRef.current.click()}>
                           <input type="file" ref={coverPicRef} disabled={isLoadingCoverPicButton} onChange={handleChangeCoverPic} hidden />
                           <Fab size='small' disabled={isLoadingCoverPicButton} color="secondary" aria-label="edit">
                               <CameraAlt fontSize='small'/>
                           </Fab>
                       </label> 
                   </Stack>
                )}
            </Stack>   
            <Stack sx={{ width: '100%', mt: -7}} 
                       flexDirection='row'
                       alignItems='end' 
                       justifyContent='space-between'
                       gap={1}>
                    <Stack  flexDirection='row' gap={1}  alignItems='end' sx={{ position: `relative`, }}>
                       {

                        profileLoading ? 
                        <Skeleton animation="wave" variant="circular" sx={{ width: {xs: 80, md: 110 }, height:  {xs: 80, md: 110} }} />
                        : 
                        <Avatar
                        alt="profilephoto"
                        src={profilePic ? URL.createObjectURL(profilePic) : user?.profilePhoto}
                        sx={{ border: 1 , width: {xs: 80, md: 110 }, height:  {xs: 80, md: 110} }}
                        
                        />
                       }
                       
                        <Box sx={{ mt: 4 }}>
                            { profileLoading ?  <Skeleton
                                                        animation="wave"
                                                        height={10}
                                                        width="80%"
                                                        style={{ marginBottom: 6 }}
                                                        /> 
                            : <Typography sx={{ mt: 3 }} variant="h5" fontWeight='bold'>{`${user?.firstName} ${user?.lastName}`}</Typography>}
                            <Stack flexDirection= "row" gap={2}>
                               <Followers/>
                               <Following/>
                            </Stack>
                        </Box>
                        { userId === auth?.userId &&
                        <label style={{ position: `absolute`, left: { xs: 50, md: 70 } , bottom: 0, cursor: `pointer`, zIndex: 1 }} onClick={()=> profilePicRef.current.click()}>
                            <input type="file" ref={profilePicRef} disabled={isLoadingProfilePicButton} onChange={handleChangeProfilePic} hidden />
                            <Fab size='small' disabled={isLoadingProfilePicButton} color="primary" aria-label="edit">
                                    <CameraAlt fontSize='small'/>
                                </Fab>
                        </label> 
                        }
                    </Stack>
                     <Box>
                           {
                              auth?.userId !== userId ?
                              user?.followers?.includes(auth?.userId)
                              ? <Button disabled={isPending} onClick={()=> unFollowUser(user._id)} variant="outlined" color="primary"> Following </Button>
                              : <Button disabled={isPending} onClick={()=> unFollowUser(user._id)} variant="contained" color="primary"> Follow </Button>                             
                            : ``
                            }
                     </Box>
                </Stack>
               
                <Box sx={{ maxWidth: { md: `100%`, xs: 400, }, bgcolor: 'background.paper', }}>
                <Tabs 
                 variant="scrollable"
                 scrollButtons="auto"
                 value={value} onChange={handleChangeTabValue}>
                
                    <Tab label="Posts"  icon={<Ballot />} iconPosition="start"  LinkComponent={Link} to={`/profile/${userId}`}/>
                    <Tab label="About" icon={<PersonPin />} iconPosition="start" value={`about`} LinkComponent={Link} to={`/profile/${userId}/about`}/>
                    <Tab label="Followers" icon={<Diversity3 />} iconPosition="start" value={`Followers`} LinkComponent={Link} to={`/profile/${userId}/followers`}/>
                    <Tab label="Gallery" icon={<ArtTrack />} iconPosition="start" value={`gallery`} LinkComponent={Link} to={`/profile/${userId}/gallery`}/>
      
                </Tabs>
                </Box>     
                <Outlet context={[user, userId, handleChangeTabValue]}/>
                
        
        </Stack>
        </>
      )
  
return content
}

export default UserProfile