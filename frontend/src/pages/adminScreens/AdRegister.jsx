
import { useState,useEffect } from "react";
// import Swal from 'sweetalert2';
import { Form, Button, Row, Col,  } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { Link , useNavigate} from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useRegisterMutation } from "../../adminSlices/adminApiSlice"; 
import { setAdminCredentials } from "../../adminSlices/adminSlice";
import Loader from "../../components/Loader";

function AdRegister() {
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const navigate=useNavigate();
    const dispatch=useDispatch();

    const { adminInfo } = useSelector((state) => state.admin);
 

    const [register, { isLoading }] = useRegisterMutation();

    useEffect(() => {
        if(adminInfo){
            navigate('/admin');
        }
    },[navigate,adminInfo])


    const submitHandler = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
        } else {
          try {
            const res = await register({ name, email, password }).unwrap();
            dispatch(setAdminCredentials({ ...res }));
            navigate('/admin');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        }
      };

   
    

  return (
   <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler}>

        <Form.Group className="my-2" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}>    
                 </Form.Control>
            </Form.Group>  

            <Form.Group className="my-2" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>    
                 </Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>    
                 </Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="confirmpassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter ConfirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}>    
                 </Form.Control>
            </Form.Group>
                { isLoading && <Loader/>}
            <Button type="submit" variant="primary" className="mt-3" >
                Sign Up
            </Button>

            <Row className="py-3">
                <Col>
                Already have an account ? <Link to='/admin/login'>Login</Link>
                </Col>
            </Row>
        </Form>
   </FormContainer>
  );
}

export default AdRegister;





// import { useState,useEffect } from "react";

// // import { Form, Button, Row, Col,  } from "react-bootstrap";
// // import FormContainer from "../components/FormContainer";
// import { Link , useNavigate} from "react-router-dom";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";
// // import './Register/Register.css'

// import { useRegisterMutation } from "../adminSlices/adminApiSlice"; 
// // import { setCredentials } from "../slices/authSlice";
// import Loader from "../components/Loader";

// function AdRegister() {
//     const [name,setName] = useState('');
//     const [email,setEmail] = useState('');
//     const [password,setPassword] = useState('');
//     const [confirmPassword,setConfirmPassword] = useState('');

//     const navigate=useNavigate();
//     // const dispatch=useDispatch();

//     const { adminInfo } = useSelector((state) => state.admin);
//     console.log('dcf',adminInfo);
 

//     const [register, { isLoading }] = useRegisterMutation();

//     useEffect(() => {
//         if(adminInfo){
//             navigate('/admin');
//         }
//     },[navigate,adminInfo])


   
//     // const submitHandler = async (e) => {
//     //     e.preventDefault();
      
//     //     if (password !== confirmPassword) {
//     //       toast.error('Passwords do not match');
//     //     } else {
//     //       try {
//     //         await register({ name, email, password,confirmPassword }).unwrap();
//     //         toast.success('Registration successful! Please check your email for the OTP.');
//     //         navigate('/ownerotp');
//     //       } catch (err) {
//     //         toast.error(err?.data?.message || err.error);
//     //       }
//     //     }
//     //   };
//     const submitHandler = async (e) => {
//       e.preventDefault();

//       // Check if any of the fields are empty
//       if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
//           toast.error('Please fill in all fields.');
//       } else if (password !== confirmPassword) {
//           toast.error('Passwords do not match.');
//       } else {
//           try {
//               // Make the registration request
//               await register({ name, email, password, confirmPassword }).unwrap();
//               toast.success('Registration successful! Please check your email for the OTP.');
//               navigate('/admin');
//           } catch (err) {
//               toast.error(err?.data?.message || err.error);
//           }
//       }
//   };
   
    

//   return (

//     <div>
//       <form className="form1" onSubmit={submitHandler}>
//         <h1>Admin SignUp</h1>
        
//         <div className="div1">
//           <label htmlFor="name"> Name:</label>
//           <input type="text" name="name" id="name" value={name} placeholder="Enter Name" onChange={(e) => setName(e.target.value)} required />
//         </div>
//         <div className="div1">
//           <label htmlFor="lastName">Email</label>
//           <input type="text" name="lastName" id="lastName" value={email} placeholder="Enter Email " onChange={(e) => setEmail(e.target.value)} required />
//         </div>
//         <div className="div1">
//           <label htmlFor="password">Password:</label>
//           <input type="password" name="Password" id="Password" value={password} placeholder="Enter Password " onChange={(e) => setPassword(e.target.value)} required />
//         </div>
//         <div className="div1">
//           <label htmlFor="confirm_password">Confirm Password:</label>
//           <input type="password" name="confirm_password" id="confirm_password" value={confirmPassword} placeholder="Enter Confirmpassword " onChange={(e) => setConfirmPassword(e.target.value)}  required />
//         </div>
        
       
//         <div>
//         { isLoading && <Loader/>}
//           <button className="btn" type="submit">sign up</button>
//         </div>
//         <div>
//         Already have an account ? <Link to='/ownerlogin'>Login</Link>
//         </div>
//       </form>
//     </div>

//   );
// }

// export default AdRegister;