import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Https, LightMode, NightsStay, Notifications } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom'
import { Switch } from '@mui/material';
import useTheme from '../hooks/useTheme';
import useLogout from '../hooks/useLogout';
import useAuth from '../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export default function AccountMenu() {
  const { dark, toggleDark } = useTheme()
  const { auth, socket, setIsConnected } = useAuth()
  const logout = useLogout()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const signOut = async()=>{
    await logout()
    queryClient.clear()
    socket.off('connect', setIsConnected(false))
    socket.emit(`disconnect`, auth.userId)
    navigate("/login")
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center',  }}>
       <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', cursor: 'pointer' }}>
       {/* <Notifications sx={{ fontSize: { xs: 25, md: 35 } }}/> */}
       </Box>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar 
                  sx={{ width: 32, height: 32 }}
                  src={ auth?.profilePhoto }
                  >
                  {!auth?.profilePhoto && auth?.firstName?.substring(0, 1).toUpperCase()}</Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      > 
        <MenuItem component={Link} to={`/profile/${auth?.userId}`} onClick={handleClose}>
         <Avatar /> Profile
        </MenuItem>
        <Divider />
        <MenuItem >
          <ListItemIcon>
          { dark ? <LightMode fontSize="small"/> :  <NightsStay fontSize="small"/>}
          </ListItemIcon>
          <Switch
                onChange={toggleDark}
                inputProps={{ "aria-label": '' }}          
          />
        </MenuItem>
        <MenuItem  component={Link} to={`/activity/likes`} onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          My Activity
        </MenuItem>
      
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}