import axios from "../api/axios"
import useAuth from "./useAuth"

const useLogout = () =>{
    const { setAuth } = useAuth()
    const logout = async()=>{
        setAuth({})
        try {
            const { data } = await axios.get("auth/logout", {
                withCredentials: true
            })
            return data
        } catch (error) {
            console.error(error)
        }
    }   
    return logout
}
export default useLogout