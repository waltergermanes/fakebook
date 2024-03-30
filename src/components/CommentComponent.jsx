import { FavoriteBorder } from '@mui/icons-material';
import { Avatar, Box, Card, Fade, Paper, Stack, Typography } from '@mui/material';
import React from 'react'
import { format } from 'timeago.js';

const CommentComponent = ({ comment }) => {
  return (
    <>
        <Paper variant='outlined' sx={{ gap: 0.5, mb: 1, borderRadius: 2, p: 1,  zIndex: 2}}>
            <Stack direction={`row`} gap={1}>
                <Stack flex={1}>
                
                   <Avatar  sx={{ height: 32, width: 32 }}  aria-label="recipe"
                            src={comment?.userId?.profilePhoto}
                            >{comment?.userId?.firstName.substring(0, 1).toUpperCase()}
                    </Avatar>
                </Stack>
                <Stack flex={10} gap={0.5}>
                   <Typography variant="caption">
                                <span style={{ float: `left`, marginRight: 5, fontWeight: `bold`, cursor: `pointer`}}>{comment?.userId?.firstName} {comment?.userId?.lastName}</span>
                                {comment.comment}
                        </Typography>
                        <Stack direction={`row`}  gap={2}>
                            <Typography variant="caption">{format(comment.createdAt)}</Typography>
                            <Typography variant="caption">{comment.likes?.length > 0 && comment.likes?.length}</Typography>
                        </Stack>
                </Stack>
                <Stack flex={1}>
                    <FavoriteBorder sx={{ display: `flex`, justifyItems: `flex-end` }} fontSize='small'/>

                </Stack>
            </Stack>
        </Paper>
    </>
  )
}
export default CommentComponent