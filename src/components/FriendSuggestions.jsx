import { Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import UserCard from './UserCard'
import useAuth from '../hooks/useAuth'
import { ClipLoader } from 'react-spinners'
import useApi from '../hooks/useApi'

const FriendSuggestions = () => {
  const { auth  } = useAuth()
  const { friendSuggestion } = useApi()

  const { data, isLoading, isError, error } = useQuery({
      queryKey: [`friendsn`],
      queryFn: ()=> friendSuggestion(auth?.userId),
  })

  return (
      <>
      <Stack sx={{ px: { xs: 1, md: 20}, width: `100%`, height: `80vh` }}>
        <Typography>Following Suggestion</Typography>
          <Grid container spacing={2} sx={{ py: 2 }}>
              {
                isLoading 
                ?  <Stack alignItems={'center'} sx={{ width: "100%" }}>
                    <ClipLoader color="#36d7b7"/>
                  </Stack>
                :   data?.filter((i, x)=> i._id !== auth?.userId).map(user=> <UserCard key={user._id} user={user}/>)
              } 
          </Grid> 
      </Stack>
      </>
  )
}

export default FriendSuggestions