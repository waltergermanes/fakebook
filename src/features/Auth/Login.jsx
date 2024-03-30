import React, { useEffect, useRef, useState } from 'react'
import TextField from '@mui/material/TextField'
import { FormControl, Button, Typography, Alert, FormControlLabel, FormGroup, Checkbox, Stack, Input, InputAdornment, IconButton, Card, CardContent } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useAuth from '../../hooks/useAuth'
import useInput from '../../hooks/useInput'
import useToggle from '../../hooks/useToggle'
import useApi from '../../hooks/useApi'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const Login = () => {
  const {setAuth, socket, isConnected, setIsConnected } = useAuth()
  const { loginUser } = useApi()
  const [email, resetUser, setAttribute] = useInput('user', '')
  const [check, toggleCheck] = useToggle('persist', '')
  const [pwd, setPwd] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
 

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data)=>{
    
      setAuth(data)
      socket.connect()
      socket.on(`connect`, ()=> {
        setIsConnected(true)
    })
       navigate(from, { replace: true })
    }
  })

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = event => event.preventDefault()

  const { mutate, isError, error } = loginMutation
  const handleLogin = ()=>{
    resetUser()
    mutate({ email, password: pwd })
  }
  const inputRef = useRef()
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  // const togglePersist = () => {
  //   setPersist(prev=> !prev)
    
  // }
  // useEffect(() => {
  //   localStorage.setItem('persist', persist)
  // }, [persist]) 
  const canSave = Boolean(email) && Boolean(pwd)
  return (
    <>
  
     <Stack sx={{display: 'grid', placeContent: `center`, gap: 1, width: '100vw', height: '100vh'}}>
      <Card>
       <CardContent>
       <FormControl sx={{ width: { sm: `100vw`, md: `40vw`}, gap: 2}}>
        { isError &&  <Alert  severity="error">{error?.response?.data.message}</Alert> }
       <TextField
         inputRef={inputRef}
         variant='standard'
         id="email"
         label="Enter email"
         {...setAttribute}
         size='small'
       />
        <TextField
            id="password"
            label='Enter password'
            variant='standard'
            size='small'
            type={showPassword ? 'text' : 'password'}
            onChange={(e)=> setPwd(e.target.value)}
            endadornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
      
       <Button disabled={!canSave} onClick={handleLogin} variant="contained" color="primary">
         Login
       </Button>
       <FormGroup>
          <FormControlLabel control={<Checkbox 
            
            id='persist'
            onChange={toggleCheck}
            checked={check}
           />}label={<Typography variant="caption">Trust this device.</Typography>} />
       </FormGroup>
       <Typography sx={{ fontSize: 13 }}>Not registered yet? click <Link to='/register'>here</Link></Typography>

      </FormControl>
       </CardContent>
     </Card>
     <Card sx={{width: { xs: 200, md: `40vw`}, display: `flex`, flexDirection: `column`, p:1}}>
     <Typography variant="caption">Demo account: email: user1, password: user1</Typography>
     <Typography variant="caption">Note: Some features of this account has been disabled. If you want to experience all features of this site, you can register new account</Typography>
     </Card>
     </Stack>
    </>
  )
}

export default Login