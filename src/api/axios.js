import axios from "axios";
export const BASE_URL = "http://localhost:5000/"

export default axios.create({
    baseURL: BASE_URL
})

/* export const loginUser = async(user)=>{
    return await api.post("/auth", user)
}  */

/* export const refreshLogin = async()=>{
    return await api.get("/auth/refresh", {
        withCredentials: true
    })
}  */
/* export default axios.create({
    baseURL: BASE_URL
}); */
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
