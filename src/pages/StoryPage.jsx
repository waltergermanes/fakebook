import React, { useState } from 'react';
import Stories from 'react-insta-stories';
import { useNavigate, useParams } from 'react-router';
import {  Avatar, Box, Card, IconButton,  List,  ListItemAvatar,  ListItemButton,  ListItemIcon,  ListItemText,  Skeleton,  Stack, Typography } from '@mui/material';
import {  ArrowLeft,  ArrowRight, Visibility } from '@mui/icons-material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { format } from 'timeago.js';


const StoryPage = () => {
const navigate = useNavigate()
const visibleIndex = React.useRef(0);
const [selectedIndex, setSelectedIndex] = React.useState(0);
const { userId } = useParams()
const { auth } = useAuth()
const axiosPrivate = useAxiosPrivate()

const getStoryByUser = async ()=>{
    const { data } = await axiosPrivate.get(`/stories/story/${userId}`) 
    return data
}
const { data: stories, isError, isLoading, error } = useQuery({
    queryKey: [`stories`, userId],
    queryFn: getStoryByUser,
    enabled: !!userId
})

const viewStoryById = async () =>{
  const { data } = await axiosPrivate.get(`/stories/storySingle/${stories[selectedIndex]?._id}/${auth.userId}`) 
  return data
}

const { data: story } = useQuery({
  queryKey: [`story`,stories && stories[selectedIndex]?._id],
  queryFn: viewStoryById,
  enabled: !!userId
})

const onStoryStart = (index) => {
  visibleIndex.current = index;
  setSelectedIndex(index)
};

const onNext = () => {
    const i = visibleIndex.current + 1;
    visibleIndex.current = i;
    setSelectedIndex(i);
}

const onPrevious = () => {
  const i = visibleIndex.current - 1;
  visibleIndex.current = i;
  setSelectedIndex(i);
}
  const onAllStoriesEndHandler = () => {
   navigate(`/`)
  }

  const storyContent = {
    width: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 'auto',
  }
  function getStoriesObject() {
    const storyComponent = isLoading ? `Loading...` :
          stories?.map((item) => {
        
            if (item.type === "image") {
              return {
                content: (props) => {
                  return <Stack sx={{ position: `relative`, height: `100%`, width: `100%` }}>
                          <ListItemButton sx={{ position: `absolute`, top: 10, left: 3}}>
                            <ListItemAvatar >
                                  <Avatar
                                         component={Link}
                                         to={`/profile/${item.header._id}`}
                                          alt={item.header.heading}
                                          src={item.header.profileImage}
                                          sx={{ width: 37, height: 37, textDecoration: `none` }}
                                      />
                            </ListItemAvatar>
                              <ListItemText primaryTypographyProps={{fontSize: 16, color: `white`}}  primary={item.header.heading} secondary={``}/>
                             
                            </ListItemButton>
                           <Box component={`img`} 
                                width={`100%`}  
                                height={`100%`} 
                                src={item.url} 
                                sx={{ objectFit: `contain` }}/>
                           <List disablePadding={true} dense={true} 
                              sx={{ 
                                    maxHeight: 400, 
                                    display: { xs: `block`, md: `none` },
                                    width: `100%`,
                                    overflowY: `auto`, 
                                    position: `absolute`, 
                                    bottom: 0, 
                                    backgroundColor: `rgba(255, 255, 255, 0.4)`, 
                                    backdropFilter: `blur(5px)`}}>
                              <ListItemButton>
                                <ListItemIcon>
                                <Visibility/>
                                </ListItemIcon>
                                <ListItemText primary={stories[selectedIndex]?.viewerList?.length} />
                              </ListItemButton>
                            {
                              stories[selectedIndex]?.viewerList?.map((viewer, i)=> (
                                <ListItemButton component={Link} to={`/profile/${viewer._id}`}  key={i}>
                                  <ListItemAvatar >
                                    <Avatar
                                          
                                            alt={viewer.firstName + ` ` + viewer.lastName}
                                            src={viewer.profilePhoto}
                                            sx={{ width: 37, height: 37, textDecoration: `none` }}
                                        />
                                  </ListItemAvatar>
                                  <ListItemText primaryTypographyProps={{fontSize: 14}}  primary={viewer.firstName + ` ` + viewer.lastName} secondary={format(viewer.viewedAt)}/>
                                </ListItemButton>
                              ))
                            }
                          </List>
                         </Stack>
                },
              }
            }
          })
    return storyComponent
  }
  return (
    <React.Fragment>
     <Stack width={`100%`}  direction={`row`} alignItems={`center`} mt={3} justifyContent={`center`}>
       {  isLoading ? <Typography variant="body1">Loading story</Typography> :
        <>
        <IconButton onClick={onPrevious} aria-label="ArrowBack" >
          <ArrowLeft />
        </IconButton>
        <Stories
        stories={getStoriesObject()}
        defaultInterval={2000}
         width={{ xs: `70vw`, md: `20vw` }}
        height={`70vh`}
       /*  style={{
          display: 'flex',
          justifyContent: 'center',
          background: 'red',
          cursor: 'pointer',
        }} */
        storyStyles={storyContent}
      
        loop={true}
        keyboardNavigation={true}
        isPaused={() => {}}
        currentIndex={selectedIndex}
        onStoryStart={onStoryStart}
        onStoryEnd={() => {}}
        onAllStoriesEnd={onAllStoriesEndHandler}
      />
        <IconButton  onClick={onNext} aria-label="ArrowForward">
        <ArrowRight />
      </IconButton>
      <Card sx={{ width: `20vw`, height: `70vh`,  display: { xs: `none`, md: `flex` }}}>
        <Stack p={1}>
        
          {
            isLoading ? `Loadibng` :
            <List disablePadding={true} dense={true} sx={{ maxHeight: 400, overflowY: `auto`, }} >
                <ListItemButton>
                  <ListItemIcon>
                  <Visibility/>
                  </ListItemIcon>
                  <ListItemText primary={stories[selectedIndex]?.viewerList?.length} />
                </ListItemButton>
              {
                stories[selectedIndex]?.viewerList?.map((viewer, i)=> (
                  <ListItemButton component={Link} to={`/profile/${viewer._id}`}  key={i}>
                    <ListItemAvatar >
                      <Avatar
                            
                              alt={viewer.firstName + ` ` + viewer.lastName}
                              src={viewer.profilePhoto}
                              sx={{ width: 37, height: 37, textDecoration: `none` }}
                          />
                    </ListItemAvatar>
                    <ListItemText primaryTypographyProps={{fontSize: 14}}  primary={viewer.firstName + ` ` + viewer.lastName} secondary={format(viewer.viewedAt)}/>
                  </ListItemButton>
                ))
              }
             </List>
          }
        </Stack>
      </Card>
     </>
      }
       </Stack>
    </React.Fragment>
  );
};

export default StoryPage;
