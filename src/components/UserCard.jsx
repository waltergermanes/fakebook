import { Avatar, Box, Button, Card, CardActionArea, Grid, Stack, Typography } from '@mui/material';
import * as React from 'react'
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
  const userFullName = `${user.firstName} ${user?.lastName}`
   return (
    <Grid item xs={6} md={3} >
      <Card>
        <CardActionArea  sx={{ display: `flex`,flexDirection: `column`, alignItems: `center`, gap: 1, p: 2, cursor: "pointer", }} LinkComponent={Link} to={`/profile/${user._id}`}>
          <Avatar src={user.profilePhoto}
              sx={{ width: 75, height: 75 }}/>
          <Typography sx={{ fontSize:14 }} >{userFullName.length > 12 ? userFullName.substring(0, 10)+`...` : userFullName}</Typography>
          <Button sx={{ width: `100%` }} variant='outlined' size='small'>Follow</Button>
        </CardActionArea>
      </Card>
    </Grid>
  );
}