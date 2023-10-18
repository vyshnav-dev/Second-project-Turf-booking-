import { useState } from "react";

import { Button  } from "react-bootstrap";
// import FormContainer from "../components/FormContainer";
import { Link , useNavigate} from "react-router-dom";
// import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import './Register/Register.css';
import { useDispatch } from "react-redux";

import { useRegisterMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import Loader from "../../components/Loader";


function RegisterScreen() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [phone,setPhone] = useState('')
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const navigate=useNavigate();
    const dispatch=useDispatch();

    // const { userInfo } = useSelector((state) => state.auth);
    


    const [register, { isLoading }] = useRegisterMutation();

    // useEffect(() => {
    //     if(userInfo){
    //         navigate('/');
    //     }
    // },[navigate,userInfo])


   
    // const submitHandler = async (e) => {
    //     e.preventDefault();
      
    //     if (password !== confirmPassword) {
    //       toast.error('Passwords do not match');
    //     } else {
    //       try {
    //         await register({ name, email, password,confirmPassword }).unwrap();
    //         toast.success('Registration successful! Please check your email for the OTP.');
    //         navigate('/otp');
    //       } catch (err) {
    //         toast.error(err?.data?.message || err.error);
    //       }
    //     }
    //   };


    const submitHandler = async (e) => {
      e.preventDefault();

      // Validate the form fields
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim() || !confirmPassword.trim()) {
          toast.error('All fields are required.');
      } else if (password !== confirmPassword) {
          toast.error('Passwords do not match.');
      } else {
          try {
              // Make the registration request
             const response= await register({ name, email,phone,password,confirmPassword}).unwrap();
             console.log(response);
             dispatch(setCredentials({...response}));
              toast.success('Registration successful! Please check your email for the OTP.');
              navigate('/otp');
          } catch (err) {
              toast.error(err?.data?.message || err.error);
          }
      }
  };
   
    

  return (

    <>
    <div className="login">
      
      <form className="form1" onSubmit={submitHandler}>
        <h2 style={{color:'blue'}}>Sign Up</h2>
        
        <div className="div1">
          <label htmlFor="name"> Name:</label>
          <input type="text" name="name" id="name" value={name} placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="div1">
          <label htmlFor="lastName">Email</label>
          <input type="email" name="lastName" id="lastName" value={email} placeholder="Enter Email " onChange={(e) => setEmail(e.target.value)}  />
        </div>
        <div className="div1">
          <label htmlFor="lastName">Phone</label>
          <input type="text" name="phone" id="lastName" value={phone} placeholder="Enter phone number " onChange={(e) => setPhone(e.target.value)}  />
        </div>
        <div className="div1">
          <label htmlFor="password">Password:</label>
          <input type="password" name="Password" id="Password" value={password} placeholder="Enter Password " onChange={(e) => setPassword(e.target.value)}  />
        </div>
        <div className="div1">
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input type="password" name="confirm_password" id="confirm_password" value={confirmPassword} placeholder="Enter Confirmpassword " onChange={(e) => setConfirmPassword(e.target.value)}   />
        </div>
        
       
        <div>
        { isLoading && <Loader/>}
        <Button variant="primary" type="submit">sign Up</Button>
        </div>
        <div>
        Already have an account ? <Link to='/login'>Login</Link>
       
        </div>
        <div>
        You are an Owner ? <Link to='/owner/login'>Login</Link>
        </div>
      </form>
      </div>
      
    </>

  );
}

export default RegisterScreen;




