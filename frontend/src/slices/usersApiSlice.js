import { apiSlice } from "./apiSlice";
const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        login:builder.mutation({
            query:(data) => ({
                url:`${USERS_URL}/auth`,
                method:'POST',
                body:data
            }),
        }),
        otp:builder.mutation({
            query:(data) => ({
                url:`${USERS_URL}/otp`,
                method:'POST',
                body:data
            }),
        }),

        googleLogin:builder.mutation({
            query:(data) => ({
                url:`${USERS_URL}/googlelogin`,
                method:'POST',
                body:data
            }),
        }),


        register:builder.mutation({
            query:(data) => ({
                url:`${USERS_URL}/register`,
                method:'POST',
                body:data
            }),
        }),
        logout:builder.mutation({
            query:() => ({
                url:`${USERS_URL}/logout`,
                method:'POST',
                
            })
        }),
        updateUser: builder.mutation({
            query: (data) => ({
              url: `${USERS_URL}/profile`,
              method: 'PUT',
              body: data,
            }),
          }),
    }),

});

export const { useLoginMutation,useOtpMutation,useGoogleLoginMutation, useLogoutMutation , useRegisterMutation , useUpdateUserMutation } =usersApiSlice;