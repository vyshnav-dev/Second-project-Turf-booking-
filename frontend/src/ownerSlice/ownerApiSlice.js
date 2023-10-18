import { apiSlice } from "./owapiSlice";
const OWNER_URL = '/api/owner';

export const ownerApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        login:builder.mutation({
            query:(data) => ({
                url:`${OWNER_URL}/ownerlogin`, 
                method:'POST',
                body:data
            }),
        }),
        register:builder.mutation({
            query:(data) => ({
                url:`${OWNER_URL}/ownerregister`,
                method:'POST',
                body:data
            }),
        }),
        logout:builder.mutation({
            query:() => ({
                url:`${OWNER_URL}/ownerlogout`,
                method:'POST',
                
            })
        }),
        otp:builder.mutation({
            query:(data) => ({
                url:`${OWNER_URL}/ownerotp`,
                method:'POST',
                body:data
            }),
        }),
        googleLogin:builder.mutation({
            query:(data) => ({
                url:`${OWNER_URL}/ownergooglelogin`,
                method:'POST',
                body:data
            }),
        }),
        updateOwner: builder.mutation({
            query: (data) => ({
              url: `${OWNER_URL}/profile`,
              method: 'PUT',
              body: data,
            }),
          }),

    })
})

    export const {useLoginMutation,useRegisterMutation,useLogoutMutation,useGoogleLoginMutation,useOtpMutation,useUpdateOwnerMutation}=ownerApiSlice;