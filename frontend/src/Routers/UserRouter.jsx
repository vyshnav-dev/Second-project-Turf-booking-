
import { Routes, Route } from 'react-router-dom';

import HomeScreen from '../pages/screens/HomeScreen.jsx'
import LoginScreen from '../pages/screens/LoginScreen.jsx';
import RegisterScreen from '../pages/screens/RegisterScreen.jsx';
import Otp from '../pages/screens/Otp.jsx'
import PrivateRoute from '../components/PrivateRouter.jsx';
import ProfileScreen from '../pages/screens/ProfileScreen.jsx'

import Details from '../pages/screens/Details.jsx';
import Booking from '../pages/screens/Booking.jsx';
import LandingScreen from '../pages/screens/LandingScreen.jsx';
import About from '../pages/screens/About.jsx';
import Chatapp from '../pages/screens/Chatapp.jsx';
import Success from '../pages/screens/Success.jsx';
import Filter from '../pages/screens/Filter.jsx';
import Error from '../pages/ErrorScreen/Error.jsx';


const UserRouter = () => {
    
    return (
        <>
        <Routes>
        
        <Route  path='/login' element={<LoginScreen/>}/>
        <Route  path='/register' element={<RegisterScreen/>}/>
        <Route  path='/otp' element={<Otp/>}/>
        
        
        

        
        <Route index={true} path='/' element={<LandingScreen/>}/>
       
        

        <Route path='/*' element={<Error/>}/>


        

        {/* private routes */}
      <Route path='' element={<PrivateRoute/>}>
      <Route  path='/profile' element={<ProfileScreen/>}/>
               <Route  path='/details/:id' element={<Details/>}/>
               <Route  path='/venue' element={<HomeScreen/>}/>
               <Route path='/history'  element={<Booking/>} />
               <Route path='/about' element={<About/>}/>
               <Route path='/chat' element={<Chatapp/>}/>

              <Route path='details/success' element={<Success/>}/>

              <Route path='/filter' element={<Filter/>}/>
               
      </Route>
        </Routes>
      </>
            )
    }
  
  export default UserRouter;


