import { MoreVert, Send } from '@mui/icons-material'
import { Avatar, CardContent, CardHeader, IconButton, Paper, Stack, Typography, TextField, Button, Divider, Skeleton, Menu, MenuItem, Fade } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useOutletContext, useParams } from 'react-router'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'timeago.js'
import MessageSkeleton from '../loaders/MessageSkeleton'
import { Link } from 'react-router-dom'

const Chat = () => {
    const { id } = useParams()
    const axiosPrivate = useAxiosPrivate()
    const { auth, socket }= useAuth()
    const [ conversation ] = useOutletContext()
    const [userChatId, setUserChatId] = useState(null)
    const [convoCreated, setConvoCreated] = useState(null)
    const [message, setMessage] = useState(``)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const queryClient = useQueryClient()
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
      setAnchorEl(null);
    }
  
    const inputRef = useRef()
    const scroll = useRef()

    const getConvo = async(id) =>{
      const { data } = await axiosPrivate.get(`/message/chat/${id}`)
      return data
    }
   
    const sendMessage = async(value) =>{
        return await axiosPrivate.post(`/message/chat/${value.conversationId}`, value)
      }

    const { data: chats, isLoading } = useQuery({
      queryKey: [`chat`, id],
      queryFn: () => getConvo(id),
      enabled: !!id
    })
    useEffect(() => {
      socket.on("receiveMessage", data => {
        queryClient.setQueryData([`chat`, id], oldData => {
          return [...oldData, data ]
        })
      })
   }, [])

    useEffect(() => {
        setUserChatId(conversation?.find(c=> c.conversationId === id).members?.filter(user=> user._id !== auth.userId))
        setConvoCreated(conversation?.find(convo => convo.conversationId === id)?.conversationCreated)
        inputRef?.current?.focus()
        scroll.current?.scrollIntoView({ behavior: "smooth" })
        setMessage(null)
       
    }, [id])

    const sendMessageMutation = useMutation({
        mutationKey: [`sendMessage`],
        mutationFn: sendMessage,
        
    })

    const handleSendMessage = ()=>{
        sendMessageMutation.mutate({ conversationId: id, sender: auth.userId, text: message})   
        const recieverID = userChatId?.map(user => user._id)
        socket.emit(`sendMessage`, { conversationId: id, members: userChatId, sender: { _id: auth.userId, firstName: auth.firstName, lastName: auth.lastName, profilePhoto: auth.profilePhoto }, text: message, recieverID})
        setMessage("")
    }
  
  return (
        <Stack>
                <CardHeader avatar={<Avatar aria-label="recipe"> R </Avatar>}
                            action={ <IconButton  onClick={handleClick} aria-label="settings">
                                    <MoreVert />
                                    </IconButton>
                                  }
                            title={userChatId?.length === 1 ? userChatId[0]?.firstName +` `+ userChatId[0]?.lastName:  userChatId?.map(user=> user.firstName +` `) + `, and You`}
                            subheader={userChatId?.length === 1 ? `Conversation created: ${format(convoCreated)}` : `Groupchat created: ${format(convoCreated)}`}
                />
                <Menu
                    id="fade-menu"
                    MenuListProps={{ 'aria-labelledby': 'fade-button',}}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem component={Link} to={`/message`} sx={{ display: { xs: `flex`, md: `none` } }} onClick={handleClose}>Back</MenuItem>
                    <MenuItem onClick={handleClose}>Chat Members</MenuItem>
                </Menu>
            <Divider/>
       <CardContent sx={{ height: { xs: `75vh`, md: 310 }, overflowY: `auto`}} >
            <Stack gap={2} >
               {
                  isLoading ? <MessageSkeleton/>
                  : chats?.length < 1 ? 
                    <Stack alignItems={`center`} justifyContent={`center`}>
                        <Typography variant="body1" >No message available</Typography>
                    </Stack>
                  :  chats?.map((chat, index)=>(
                    <Stack key={index} gap={1} ref={scroll}>
                    <Stack direction={auth.userId === chat.sender._id ? `row-reverse` : `row`}alignItems={`flex-end`} gap={1}>
                        <Avatar src={chat.sender.profilePhoto}  sx={{ width: 35, height: 35, mb: 2.5 }}/>
                        <Stack>
                            <Typography sx={{ fontSize:  12 }}>{chat.sender._id !== auth.userId && chat.sender.firstName}</Typography>
                            <Paper sx={{ p: 1}} variant='outlined'>
                                <Typography sx={{  fontSize: 14}}>
                                    {chat.text}
                                </Typography>
                            </Paper>
                            <Typography sx={{ alignSelf: `end` }}  variant="caption">{format(chat.createdAt)}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                ))
                }
            </Stack>
       </CardContent>
       <Divider/>

       {
        auth.userId === `65476ef9b2e4aec8d2a8b46f` 
        ? <Button sx={{bottom: 0, width: "100%", }} variant="contained" color="error" disabled>disabled</Button>
        : <TextField
        inputRef={inputRef}
                id="standard-name"
                variant='outlined'
                size='small'
                multiline
                value={message}
                
                onChange={e => setMessage(e.target.value)}
                InputProps={{endAdornment:
                <Button onClick={handleSendMessage} 
                        disabled={sendMessageMutation.isPending || !message}
                        endIcon={<Send />} 
                        variant="contained" 
                        color="primary"
                >
                    Send
                </Button>}}
            />
       }
      
    </Stack>
  )
}

export default Chat