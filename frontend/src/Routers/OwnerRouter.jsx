// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/ownerScreen/Home.jsx'
import Login  from '../pages/ownerScreen/Login.jsx'
import Register from '../pages/ownerScreen/Register.jsx'
import Ownerotp from '../pages/ownerScreen/Ownerotp.jsx'
import OwnerPrivateRoute from '../components/OwnerPrivateRoute.jsx';
import Profile from '../pages/ownerScreen/Profile.jsx';
import BookingScreen from '../pages/ownerScreen/BookingScreen.jsx';
import Error from '../pages/ErrorScreen/Error.jsx';
import Owdashbord from '../pages/ownerScreen/Owdashbord.jsx';

const OwnerRouter = () => {
    
    return (
        <>
        <Routes>
        
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/otp' element={<Ownerotp />} />
        <Route path='/*' element={<Error/>}/>

        
        

        <Route path='' element={<OwnerPrivateRoute/>}>
        <Route path='/dashbord' element={<Owdashbord/>}/>
        <Route  path='/profile' element={<Profile/>}/> 
        <Route path='/'  element={<Home/>} />
        <Route path='/booking'  element={<BookingScreen/>} />
      </Route>
        </Routes>
      </>
        
     )
    }
  
  export default OwnerRouter;