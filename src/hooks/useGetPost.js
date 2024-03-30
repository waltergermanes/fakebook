import { useQuery, useQueryClient } from "@tanstack/react-query"
import useApi from "./useApi"

export const useGetPost = (postID)=>{
    const { fetchPostByID } = useApi()

    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [`post`, postID],
        queryFn: ()=> fetchPostByID(postID),
        initialData: () => {
            const post = queryClient.getQueryData(postID)?.data?.find(post=> post._id === Number(postID))
         
            if(post){
                
                return {data: post}
            }else{
                return undefined
            }
        }
    })
}