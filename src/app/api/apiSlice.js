import { createApi } from '@reduxjs/toolkit/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
    tagTypes: ['Post', 'User'],
    endpoints: builder => ({})
})