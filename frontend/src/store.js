// import {configureStore} from '@reduxjs/toolkit';

// import authReducer from './slices/authSlice'


// import { apiSlice } from './slices/apiSlice';



// const store = configureStore({
//     reducer:{
//         auth:authReducer,
//         [apiSlice.reducerPath] : apiSlice.reducer,
//     },
    
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
//     devTools:true
// });

// export default store;


import {configureStore,combineReducers} from '@reduxjs/toolkit';

import authReducer from './slices/authSlice'

import adminReducer from './adminSlices/adminSlice'

import ownerReducer from './ownerSlice/ownerSlice'

import turfReducer from './turfSlice/turfSlice'

import searchReducer from './searchSlice/searchSlice'

import { apiSlice } from './slices/apiSlice';



const rootReducer = combineReducers({
    auth: authReducer,
    admin: adminReducer,
    owner:ownerReducer,
    turf:turfReducer,
    search:searchReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  });
  
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
  });
  
  export default store;