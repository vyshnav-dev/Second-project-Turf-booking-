import { apiSlice } from "./adapiSlice";
const ADMIN_URL = '/api/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        login:builder.mutation({
            query:(data) => ({
                url:`${ADMIN_URL}/admin`,
                method:'POST',
                body:data
            }),
        }),
        register:builder.mutation({
            query:(data) => ({
                url:`${ADMIN_URL}/adminregister`,
                method:'POST',
                body:data
            }),
        }),
        logout:builder.mutation({
            query:() => ({
                url:`${ADMIN_URL}/logout`,
                method:'POST',
                
            })
        }),

    })
})

    export const {useLoginMutation,useRegisterMutation,useLogoutMutation}=adminApiSlice;