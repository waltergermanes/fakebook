import { Alert, Button, Card, CardContent, FormControl, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axios'
import { useMutation } from '@tanstack/react-query'


const Register = () => {

  const [value, setValue] = useState(null)
  const [err, setErr] = useState(``)
  const [success, setSuccess] = useState(``)
  const inputHandler = e => setValue(prev=> ({...prev, [e.target.id]: e.target.value}))


  useEffect(() => {
    if (value?.password && value?.cpassword) {
      if (value?.password !== value?.cpassword) {
        setErr('Password do not match');
      } else {
        setErr('');
      }
    }
  }, [value?.password, value?.cpassword])

  const  registerUser = async (user)=>{
    const { data } = await axios.post(`/auth/register`, { user })
    return data
  }

  const { mutate, isPending } = useMutation({
    mutationKey: [`register`],
    mutationFn: registerUser,
    onSuccess: data =>{
      setSuccess(data.message)
    }, 
    onError: err =>{
     setErr(err.message)
    }
  })

  const hasValue = Boolean(value?.email) && Boolean(value?.firstName) && Boolean(value?.lastName) && Boolean(value?.password)

  const inputRef = useRef()
  useEffect(() => {
    inputRef.current.focus()
  }, [])
  return (
    <>
    <Stack sx={{display: 'grid', placeContent: `center`, width: '100vw', height: '100vh'}}>
      <Card>
        <CardContent>
          <FormControl sx={{ width: { xs: `80vw`, md: `35vw`}, gap: 2}}>
          {
              err &&  <Alert variant='filled' severity="error">{err}</Alert>
          }
          
          {
              success &&  <Alert severity="success">{success}</Alert>
          }
        <Stack flexDirection={'row'} gap={1}>
              <TextField
                  inputRef={inputRef}
                  id="firstName"
                  label="Enter firstname"
                  size='small'
                  onChange={inputHandler}
              />
                  <TextField
                  id="lastName"
                  label="Enter lastname"
                  size='small'
                  onChange={inputHandler}
              />
        </Stack>
              <TextField
                type='email'
                id="email"
                label="Enter email"
                size='small'
                onChange={inputHandler}
              />
          <Stack flexDirection={'row'} gap={1}>
            
              <TextField
                  id="password"
                  label="Enter Password"
                  size='small'
                  onChange={inputHandler}
              />
                  <TextField
                  id="cpassword"
                  label="Confirm Password"
                  size='small'
                  onChange={inputHandler}
              />
        </Stack>
        <Button onClick={()=> mutate(value)} disabled={isPending || !hasValue}  variant="contained" color="primary">
          Register
        </Button>
        <Typography sx={{ fontSize: 13 }}>Are you already registered? click <Link to='/login'>here</Link></Typography>
        </FormControl>
        </CardContent>
      </Card>
    </Stack>
    </>
  )
}

export default Register