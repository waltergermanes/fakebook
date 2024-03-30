import React, { useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import useAuth from '../hooks/useAuth';

const Example = () => {
    
  const socket = useRef()
  const { auth }= useAuth()
    useEffect(() => {
        
        socket.current = io(`ws://localhost:8800`);
        socket.current.emit("addUser", auth.userId)
        socket.current.on("getUsers", message =>{
                        console.log(message)
        })
      
     }, [])
  return (
    <div>Example</div>
  )
}

export default Example