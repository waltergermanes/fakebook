import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { Stack } from '@mui/material';

function Media() {

  return (
   <Stack width={`100%`}>
         <Card sx={{ width: `100%`,}}>
      <CardHeader
        avatar={ <Skeleton animation="wave" variant="circular" width={40} height={40} /> }
        title= {
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
            }
        subheader={ <Skeleton animation="wave" height={10} width="40%" /> }
      />
      <Skeleton sx={{ height: 240 }} animation="wave" variant="rectangular" />
      <CardContent>
            <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="80%" />
      </CardContent>
    </Card>
   </Stack>
  );
}

export default function PostSkeleton() {
  return (
    <div>
      <Media />
    </div>
  );
}