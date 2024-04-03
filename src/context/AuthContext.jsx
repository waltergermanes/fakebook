import React, { createContext, useState } from 'react'
import { io } from 'socket.io-client';

const AuthContext = createContext({})

const URL = `https://fakebook-api-kfi5.onrender.com`
const socket = io(URL, {
  autoConnect: false
})
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({})
  const [isConnected, setIsConnected] = useState(null);
  const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false)
  return (
    <AuthContext.Provider value = {{persist, setPersist, auth, setAuth, socket, isConnected, setIsConnected }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthContext