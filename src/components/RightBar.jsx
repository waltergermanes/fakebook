import styled from '@emotion/styled';
import { Avatar, Badge, Box, Button, CircularProgress, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useDebounce from '../hooks/useDebounce';
import { Link } from 'react-router-dom';

const RightBar = () => {
  const axiosPrivate = useAxiosPrivate()
  const [searchValue, setSearchValue] = useState(``)
  const debouncedValue = useDebounce(searchValue, 1000)
  const { auth, socket } = useAuth();
  
  const [data, setData] = useState([])
  useEffect(() => {
   socket.on('getUsers', data=>{
    setData(data)
   })
  }, [])
 
  const searchUser = async ()=>{
    const { data } =  await axiosPrivate.get(`/user/search?query=${searchValue}`) 
    return data
  }

  const { data: searchResult, isLoading } = useQuery({
    queryKey: [`search`, debouncedValue],
    queryFn: debouncedValue && searchUser,
    enabled: !!debouncedValue
  })


  let searchResultContent = ``

  if(isLoading) {
     searchResultContent = (
      <Stack alignItems={`center`} py={1}> 
            <CircularProgress size={30} sx={{ width: `100%`,}}/>
      </Stack>
     )
  }
  if(searchResult){
    searchResultContent = (
      searchResult.length < 1 
      ?  
          <Stack alignItems={`center`} p={1} width = {`100%`}> 
              <Typography variant="body1">No result found</Typography>
          </Stack>
      :   searchResult?.map(({ _id, firstName, lastName, profilePhoto }, index) => {    
            return <ListItemButton LinkComponent={Link}
            to={`/profile/${_id}`} key={index}>
                    <ListItemAvatar>
                      <Avatar alt="Profile Picture" src={profilePhoto} />
                    </ListItemAvatar>
                    <ListItemText primary={firstName +` `+ lastName} />
                  </ListItemButton>
              })
    )
  }
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
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
  }));
  return (
    <>
      <Box  flex={1}>
      <Stack display='flex'  flexDirection='column' gap={2} width='20%'  position='fixed' p={2} >
      <List  disablePadding={true} sx={{ position: `relative`, maxHeight: 400,}} >
      <TextField
                  sx={{ paddingY: 1, width: "100%" }}
                  size='small'
                  type='search'
                  value={searchValue}
                  onChange={(e)=> setSearchValue(e.target.value)}
                  placeholder='search user...'
                />
     <Paper sx={{ position: `absolute`, zIndex: 2, width: `100%` }}>
    { searchResultContent }
     </Paper>
        {
          data?.map((onlineUser, i)=>{
           return onlineUser.userId === auth.userId ? ``
                  :  <ListItemButton key={i}>
                      <ListItemAvatar>
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          >
                          <Avatar  sx={{ width: 35, height: 35 }} alt={ onlineUser.firstName +` ` + onlineUser.lastName } src={onlineUser.profilePhoto} />
                        </StyledBadge>
                      </ListItemAvatar>
                          <ListItemText primary={ onlineUser.firstName +` ` + onlineUser.lastName }/>
                    </ListItemButton>
          })
        }
      </List>
         </Stack>
      </Box>
    </>
  )
}

export default RightBar