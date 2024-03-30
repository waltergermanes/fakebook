import { Archive, Block, Favorite, Markunread, Restore } from '@mui/icons-material';
import { Avatar, BottomNavigation, BottomNavigationAction, Box, Card, CssBaseline, Divider, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import * as React from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { format } from 'timeago.js'

export default function Conversation() {
  const ref = React.useRef(null);

  const axiosPrivate = useAxiosPrivate()
  const { auth }= useAuth()
  const getConvo = async() =>{
    const { data } = await axiosPrivate.get(`/message/conversation/${auth.userId}`)
    return data
  }

  const { data: conversation } = useQuery({
    queryKey: [`convo`, auth.userId],
    queryFn: getConvo
  })
  React.useEffect(() => {
    ref.current.ownerDocument.body.scrollBottom = 100;
  });
  return (
     <Box sx={{ position: `relative`, height: `100%` }} ref={ref} >
     <CssBaseline />
     <List sx={{ maxHeight: 400, overflowY: `auto` }} >
        {
        conversation?.map(({ conversationId, members, sender, text, createdAt }, index) => {
          const user = members?.find(m=> m._id !== auth.userId)
          return <ListItemButton key={index}>
                  <ListItemAvatar>
                    <Avatar alt="Profile Picture" src={user.profilePhoto} />
                  </ListItemAvatar>
                  <ListItemText primary={user.firstName +` `+ user.lastName} secondary={text ? sender === auth.userId ? `You: ${text } - ${format(createdAt)}` : `${text}` : ``} title={text}/>
                </ListItemButton>
            })
        }
      </List>
     <Paper sx={{ position: 'absolute', width:`100%`, bottom: 0, left: 0}} elevation={3}>
        <BottomNavigation
          showLabels
        >
         {/*  <BottomNavigationAction label="Recents" icon={<Restore />} />
          <BottomNavigationAction label="Requests" icon={<Markunread />} />
          <BottomNavigationAction label="Blocked" icon={<Block />} />
          <BottomNavigationAction label="Archived" icon={<Archive />} /> */}
        </BottomNavigation>
      </Paper>
    </Box>
    
  );
}
