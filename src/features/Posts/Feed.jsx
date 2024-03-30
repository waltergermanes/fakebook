import React, { useCallback, useEffect, useRef } from 'react'
import PostComponent from '../../components/PostComponent'
import { Alert, Stack, Button } from '@mui/material'
import { useInfiniteQuery } from '@tanstack/react-query'
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import PostSkeleton from '../loaders/PostSkeleton'
import FAB from '../../components/FAB'

const Feed = ({ userId }) => {
    const axiosPrivate = useAxiosPrivate()
    const { auth, socket, } = useAuth()

    const getFriendPosts = async ( pageParam = 1, options={} )=>{
        const { data } = userId 
        ? await axiosPrivate.get(`/post/profile/${userId}?page=${pageParam}`, options) 
        : await axiosPrivate.get(`/post/timeline/${auth?.userId}?page=${pageParam}`, options)
        return data
    }
   useEffect(() => {
    socket.emit("addUser", auth.userId)
   }, [])

    const { 
         fetchNextPage,
         hasNextPage, 
         isFetchingNextPage, 
         data: post, 
         status,
         isLoading,
         error
        } = useInfiniteQuery({
        queryKey: ['posts', userId],
        queryFn: ({ pageParam = 1 }) => getFriendPosts(pageParam),
        getNextPageParam: (lastPage, allPages) =>{
            return lastPage.length ? allPages.length + 1 : undefined
        }, 
       
    })
    const intObserver = useRef()
    const lastPostRef = useCallback(post=>{
        if (isFetchingNextPage) return

        if(intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts => {
        if(posts[0].isIntersecting && hasNextPage){
            console.log('we are near the last post')
            fetchNextPage()
        }
        })
        if(post) intObserver.current.observe(post)


    }, [isFetchingNextPage, fetchNextPage, hasNextPage])

    if (status === 'error') return <p className='center'>Error: {error.message}</p>
    const contentPost = isLoading 
                        ? <Stack  width={`100%`}>
                             <PostSkeleton/>
                          </Stack> 
                        : 
                        post?.pages < 1 
                        ? <Alert variant="outlined" severity="info">
                                No post available.
                          </Alert> 
                        : (post?.pages?.map((pg)=>{
                            return pg?.map((post, i)=>{
                            if (pg.length === i + 1){
                                return <PostComponent ref={lastPostRef} key={post._id} post={post}/>
                            }
                            return <PostComponent key={post._id} post={post}/>
                            }) 
                        }))
  return (
    <>
     <Stack position={`relative`} gap={3} px={{ md:5, xs: 1 }}>
        { contentPost }
        { isFetchingNextPage && 
           <Stack width={`100%`}>
             <PostSkeleton/>
            </Stack>
        }
       <FAB/>
    </Stack>
    </>
  )
}

export default Feed