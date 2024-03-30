import { Avatar, AvatarGroup, Badge, BottomNavigation, BottomNavigationAction, Box, Card, CssBaseline, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'timeago.js'
import { Archive, Block, Markunread, Restore } from '@mui/icons-material';
import { Outlet, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import ConvoSkeleton from '../features/loaders/ConvoSkeleton';
import ModalComponent from '../components/ModalComponent';
import NewConvo from '../features/Chat/NewConvo';

const Message = () => {

  const axiosPrivate = useAxiosPrivate()
  const { auth, socket }= useAuth()
  const [isOnline, setIsOnline] = useState(false)
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const queryClient = useQueryClient()
  const { id: convoID } = useParams()

  const getConvo = async(userId) =>{
    const { data } = await axiosPrivate.get(`/message/conversation/${userId}`)
    return data
  }

  const { data: conversation, isLoading } = useQuery({
    queryKey: [`convo`],
    queryFn: ()=> getConvo(auth.userId),
  })

  useEffect(() => {
    socket.emit("addUser", auth.userId)
    socket.on("receiveMessage", data => {
    
      queryClient.setQueryData([`convo`], oldData => {
        
        const newMessage = oldData?.map(c=> {
              if(c.conversationId === data.conversationId){
               return {...c, text: data.text, receiverID: data.receiverID} 
              }
              return c
            })
        
        return  newMessage
      })
    } )
 }, [])

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: isOnline ? '#44b700' : `gray`,
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: isOnline ? 'ripple 1.2s infinite ease-in-out' : ``,
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }))
  return (
        <Stack  width={`100%`} height={{ xs: `90vh`, md: `80vh` }} mx={{ xs: 0, md: 5 }}>
        <Typography variant="h6" sx={{ display: { xs: `none`, md: `block`} }}>Chat</Typography>
          <Card sx={{ display:`flex`}}>
            <Stack flex={2} display={{ xs: convoID ? `none` : `flex`, md: `flex` }}>
            <Box sx={{ position: `relative`, height: { xs: `100vh`, md: `100%` } }} >
              <CssBaseline />
              <List sx={{ maxHeight: 400, overflowY: `auto` }} >
                  {
                     isLoading ? <ConvoSkeleton/>
                     :  conversation?.map(({ conversationId, members, sender, text, createdAt }, index) => {
                      const user = members.filter(m=> m._id !== auth.userId)
                      return <ListItemButton LinkComponent={Link} to={`/message/chat/${conversationId}`} key={index}>
                              {
                                user.length > 1 ? 
                                <>
                                  <ListItemAvatar>
                                  <AvatarGroup max={4} spacing={`small`}>
                                    {
                                     user.map(user=> <Avatar key={user._id} sx={{ fontSize: 10 }} alt="Remy Sharp" src={user.profilePhoto}/>)
                                    } 
                                  </AvatarGroup>
                                  </ListItemAvatar>
                                  <ListItemText primary={user.map(user=> user.firstName +``) + `, and You`} secondary={text ? sender === auth.userId ? `You: ${text } - ${format(createdAt)}` : `${text}` : ``} title={text}/>
                                  </>
                                 : 
                                <>
                                <ListItemAvatar>
                                  <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                  >
                                    <Avatar alt="Profile Picture" src={user[0].profilePhoto} />
                                  </StyledBadge>
                                </ListItemAvatar>
                                <ListItemText primary={user[0].firstName +` `+ user[0].lastName} secondary={text ? sender._id === auth.userId ? `You: ${text } - ${format(createdAt)}` : `${text}` : ``} title={text}/>
                                  </>
                              }
                            </ListItemButton>
                        })
                  }
                </List>
              <Paper sx={{ position: 'absolute', width:`100%`, bottom: 0, left: 0}} elevation={3}>
                  <BottomNavigation
                  
                    showLabels
                  >
                    <BottomNavigationAction label="Recents" icon={<Restore />} />
                    <BottomNavigationAction onClick={handleOpenModal} label="Start Conversation" icon={<Markunread />} />
                   {/*  <BottomNavigationAction disabled label="Blocked" icon={<Block />} />
                    <BottomNavigationAction disabled label="Archived" icon={<Archive />} /> */}
                  </BottomNavigation>
                </Paper>
              </Box>
            </Stack>
            <Divider orientation="vertical"/>
            <Stack flex={{ xs: 2, md: 3 }} display={{ xs: convoID ? `flex` : `none`, md: `flex` }}>
              <Outlet context={[ conversation ]}/>
            </Stack>
          </Card>
          <ModalComponent open={openModal} handleClose={handleCloseModal} style={{ width: {xs: 350, md: 530}, maxHeight: 400 }}>
          <NewConvo conversation={conversation}/>
        </ModalComponent>
        </Stack>
  )
}

export default Message