import { Stack, TextField, Button, Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router'
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useMutation } from '@tanstack/react-query'

const About = () => {
 const [ user ] = useOutletContext()
 const { auth } = useAuth()
 const { userId } = useParams()
 const [err, setErr] = useState(``) 
 const [isSuccess, setSuccess] = useState(false) 
 const axiosPrivate = useAxiosPrivate()
 const [valueInput, setValueInput] = useState({ firstName: user?.firstName, lastName: user?.lastName, email: user?.email, address: user?.address })

 const inputHandler = e => setValueInput(prev=> ({...prev, [e.target.id]: e.target.value}))
 useEffect(() => {
  if (valueInput?.password && valueInput?.cpassword) {
    if (valueInput?.password !== valueInput?.cpassword) {
      setErr('Password do not match');
    } else {
      setErr('');
    }
  }
}, [valueInput?.password, valueInput?.cpassword])
 const updateUser = async() =>{
  const { data } = await axiosPrivate.put(`/user/${auth.userId}`, valueInput )
  return data
 }
 const { mutate, isPending } = useMutation({
  mutationKey: [`updateUser`],
  mutationFn: updateUser,
  onSuccess: ()=>{
    setSuccess(true)
  }
 })
 const submitHandler = () =>{
  mutate(valueInput)
 }

  return (
    <>
        {
          err &&  <Alert sx={{ my: 1}} variant='standard' severity="error">{err}</Alert>
        }
        {
          isSuccess &&  <Alert sx={{ my: 1}} variant='standard' severity="success">User info updated successfully.</Alert>
        }
    <Stack direction={`row`} gap={5}>
       
      <Stack gap={1}>
        
        <TextField
          onChange={inputHandler}
          id="firstName"
          label="First Name"
          value={valueInput?.firstName}
          variant="standard"
        />
         <TextField
          onChange={inputHandler}
          id="lastName"
          label="Last Name"
          value={valueInput?.lastName}
          variant="standard"
        />
        { auth.userId === userId && <TextField
         type='password'
          onChange={inputHandler}
          id="password"
          label="Change Password"
          variant="standard"
        />}
      </Stack>
      <Stack gap={1}>
       <TextField
            onChange={inputHandler}
            id="email"
            label="Email"
            value={valueInput?.email}
            variant="standard"
        />
        <TextField
          onChange={inputHandler}
          id="address"
          label="Address"
          value={valueInput?.address}
          variant="standard"
        />
        {
          auth.userId === userId &&  <TextField
          type='password'
          onChange={inputHandler}
           id="cpassword"
           label="Confirm Password"
           variant="standard"
         />
        }
        {
           auth.userId === `65476ef9b2e4aec8d2a8b46f` 
           ? <Button sx={{bottom: 0, width: "100%", }} variant="contained" color="error" disabled>disabled</Button>
           : <Button disabled={!valueInput || isPending} onClick={submitHandler} variant="outlined" color="primary">
            Save
          </Button>
        }
         
      </Stack>
     
    </Stack>
    </>
  )
}

export default About