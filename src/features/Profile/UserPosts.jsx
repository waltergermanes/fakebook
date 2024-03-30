import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import React from 'react'
import { useOutletContext } from 'react-router';
import Feed from '../Posts/Feed';
import Gallery from '../../components/Gallery';
import { Link } from 'react-router-dom';
import { EditNote } from '@mui/icons-material';

const UserPosts = () => {
    const [ user, userId, handleChangeTabValue ] = useOutletContext();
  return (
    <Stack sx={{  mt: 2 }} flexDirection={{xs: "column", lg: "row",}} gap={2}>
    <Stack gap={2} flex={1}  >
        <Card sx={{ position: "sticky", top: 70}}>
            <CardContent>
            <Typography sx={{ fontSize: 16, fontWeight: "bold" }} gutterBottom>Personal info</Typography>
                <Stack direction={`row`}>
                    <Stack flex={1}>
                        <Typography  sx={{ fontWeight: `bold` }}>
                                Address: 
                        </Typography>
                        
                    </Stack>
                    <Stack flex={1}>
                            <Typography variant="body1">
                            { user?.address }
                            </Typography>
                    </Stack>
                </Stack>
                <Stack mt={1}>
                    <Button size='small' onClick={(e)=> handleChangeTabValue(e, `about`)} LinkComponent={Link} to={`/profile/${userId}/about`} variant="outlined" color="primary" startIcon={<EditNote fontSize='small'/>}>
                        edit info
                    </Button>
                </Stack>
            </CardContent>
        </Card>
        <Card sx={{ position: "sticky", top: 70,}}>
            <CardContent>
                <Stack direction={`row`} alignItems={`center`} justifyContent={`space-between`}>
                 <Typography sx={{ fontSize: 16, fontWeight: "bold" }} gutterBottom>Gallery</Typography>
                    {
                        user?.userPosts?.length > 6 && 
                        <Button variant="text" onClick={(e)=> handleChangeTabValue(e, `gallery`)} LinkComponent={Link} to={`/profile/${userId}/gallery`} color="primary">
                          See more Image
                        </Button>
                    }
                </Stack>
            <Grid container spacing={0.5}>
                {
                    user?.userPosts?.filter((i, index) => index < 6).map((img, index)=>(
                       <Gallery img={img} key={index}/>
                    ))
                }
             </Grid>
            </CardContent>
        </Card>
    </Stack>
    <Stack flex={1.4} >
       {
         <Feed userId={userId}/>
       }
    </Stack>
</Stack>
  )
}

export default UserPosts