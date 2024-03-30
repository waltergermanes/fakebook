import { Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import React from 'react'

const UpdateUserInfo = () => {
    const [value, setValue] = React.useState('female');

    const handleChange = (e) => {
      setValue(e.target.value);
    };
    
  return (
    <FormControl>
    <Stack direction={`row`} p={5} divider={<Divider/>} gap={2}>
          <Stack flex={1}>
            <Typography>Update Password</Typography>
            <TextField
                    id="npassword"
                    label="Enter New Password"
                    size='small'
                        />
              <TextField
                    id="cpassword"
                    label="Confirm Password"
                    size='small'
                        />
              <TextField
                    id="password"
                    label="Enter Old password"
                    size='small'
                        />
          </Stack>
          
          <Stack flex={1} gap={1.5}>
          <Typography>Update Basic Info</Typography>
            <TextField
                    id="username"
                    label="Enter username"
                    size='small'
                        />
             <TextField
                    id="firstName"
                    label="Firstname"
                    size='small'
                        />
             <TextField
                    id="lastName"
                    label="Lastname"
                    size='small'
                        />
             <TextField
                    id="email"
                    label="Email"
                    size='small'
                        />
             <TextField
                    id="Address"
                    label="Address"
                    size='small'
                        />
            <Stack>
                <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={value}
                    onChange={handleChange}
                    sx={{ display: `flex`, gap: 1}}
                >
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
               
            </Stack>
          </Stack>
    </Stack>
 </FormControl>
  )
}

export default UpdateUserInfo