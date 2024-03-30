import React, { useEffect, useState } from 'react'
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from '../hooks/useAuth'
import { Outlet } from 'react-router'

const PersistLogin = () => {

    const refresh = useRefreshToken()
    const [isLoading, setIsLoading] = useState(true)
    const { auth, persist, socket } = useAuth();
    useEffect(() => {
      let isMounted = true
        const verifyRefreshToken = async () => {
            try {
                await refresh();
          
            }
            catch (err) {
                console.log(err);
            }
            finally {
           isMounted && setIsLoading(false);
            }
        }

        // Avoids unwanted call to verifyRefreshToken
        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false);
          
      return () => isMounted =false
    }, [])

   /*  useEffect(()=>{
        console.log('isLoading: ', isLoading)
        console.log('at: ', JSON.stringify(auth?.accessToken))
    }, [isLoading]) */

       return (
        <>
           {!persist
                ? <Outlet />
                : isLoading
                    ? <p>Loading...</p>
                    : <Outlet />
            }
        </>
    )
}
export default PersistLogin