import React from 'react'
import axios from '../api/axios'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import { Alert, Stack, Typography } from '@mui/material'
import { Check } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const EmailVerify = () => {
    const { userId, token} = useParams()
    
    const getEmailVerify = async () =>{
        const { data } = await axios.get(`/auth/${userId}/verify/${token}`)
        return data
    }
    const { data: verify, isError, error } = useQuery({
        queryKey: [`emailVerify`],
        queryFn: getEmailVerify
    })
    let content = ``
    if(isError){
     return content = (
        <Stack gap={2} sx={{ width: `100vw`, height: `100vh`, display: `grid`, placeContent: `center` }}>
            <Alert severity="error">
                {error.message}
            </Alert>
            <Button variant="contained" LinkComponent={Link} to={`/login`} color="error">Go to login</Button>           
        </Stack>
     )
    }
    if(verify){
        return content = (
            <Stack gap={2} sx={{ width: `100vw`, height: `100vh`, display: `grid`, placeContent: `center` }}>
              <Alert icon={<Check fontSize="inherit" />} severity="success">
               {verify.message}
                </Alert>
                <Button LinkComponent={Link} to={`/login`} variant="contained" color="success">Go to login</Button>           
            </Stack> 
        )
    }
  return content   
}

export default EmailVerify