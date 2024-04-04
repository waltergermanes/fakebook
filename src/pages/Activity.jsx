import { Comment, Recommend } from '@mui/icons-material';
import { Stack, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const Activity = () => {
  const { pathname } = useLocation()

  const currentTab = pathname.split(`/`)[2]
  
  const [value, setValue] = useState(currentTab || 0);
  const handleChangeTabValue = (event, newValue) => setValue(newValue)
  return (
      <Stack gap={2} height={`80vh`} px={{ md:5, xs: 1 }}>
        <Tabs paddi value={value} onChange={handleChangeTabValue}>              
            <Tab label="Likes"  icon={<Recommend />} iconPosition="start"  value={`likes`} LinkComponent={Link} to={`/activity/likes`}/>
            <Tab label="Comments" icon={<Comment />} iconPosition="start" value={`comment`} LinkComponent={Link} to={`/activity/comment`}/>
          </Tabs>
           <Outlet/>
      </Stack>
  )
}

export default Activity