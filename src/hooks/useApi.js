import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const useApi = ()=>{
    const axiosPrivate = useAxiosPrivate()

const loginUser = async(user)=>{
    const { data } = await axios.post("/auth", user,
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
    return data
  }

  const friendSuggestion = async (userId)=> {
    const { data } = await axiosPrivate.get(`/user/followsuggestion/${userId}`)
    return data 
  }

const getUserInfo =async (userId)=>{
    const { data } = await axiosPrivate.get(`/user?userId=${userId}`)
    return data
}
const getUserPhotos = (userId)=>{
    return axiosPrivate.get(`/user?userId=${userId}`)
}

const createPost = async(data)=>{
    return await axiosPrivate.post("/post", data)
  }

const fetchPostByID = async (postId) => {
    const { data } = await axiosPrivate.get(`/post/${postId}`);
    return data;
  };
const getPostComment = async(postId)=>{
    const { data } = await axiosPrivate.get(`/post/comment/${postId}`)
    return data
  }
  return { loginUser, friendSuggestion, getUserInfo, getUserPhotos, createPost, fetchPostByID, getPostComment }
}
export default useApi