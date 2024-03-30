import useAuth from "./useAuth"
import axios from "../api/axios"
import useLogout from "./useLogout";
import { useNavigate } from "react-router";

const useRefreshToken = () => {
    const { setAuth, auth, socket, setIsConnected } = useAuth();
    const logout = useLogout()
    const navigate = useNavigate()
    const refresh = async () => {
        try {
            const { data } = await axios.get('/auth/refresh', {
                withCredentials: true
            });
            setAuth(prev => {
              //  console.log(JSON.stringify(prev));
              //  console.log(data.accessToken);
    
                return {...prev,...data } })
            socket.connect()
            socket.on(`connect`, ()=> {
                setIsConnected(true)
            })
            socket.emit("addUser", auth.userId)
            return data.accessToken;
        } catch (error) {
            console.log(error)
            await logout()
            navigate(`/`)
        }
    }
    return refresh;
};

export default useRefreshToken;