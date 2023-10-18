import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Form, Button,Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useUpdateUserMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import '../../css/profile.css'


const ProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const dispatch = useDispatch();

  const navigate=useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  console.log('eeeee',userInfo);

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    setName(userInfo.name || userInfo.data.name);
    setEmail(userInfo.email || userInfo.data.email);
  }, [userInfo.email, userInfo.name]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
     
        const formData = new FormData();
        formData.append('_id', userInfo._id);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('file', image);
          
          console.log("formdata",formData);
      
          const res = await updateProfile(formData).unwrap();
          console.log(res);
  
          dispatch(setCredentials(res));
          toast.success("Profile updated successfully");
          navigate("/")
        } 
   catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  
  return (
    <FormContainer>
      <h1>Update Profile</h1>

        <div style={{display:'flex',justifyContent:'center',marginTop:'-65px'}}>
        <Image style={{width:"90px",marginRight:"10px"}} src= { userInfo.image ?`http://localhost:5000/Images/${userInfo.image}`:'https://cdn.vectorstock.com/i/preview-1x/99/94/default-avatar-placeholder-profile-icon-male-vector-23889994.jpg'} roundedCircle />
        </div>

      <Form  onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="image">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          ></Form.Control>
        </Form.Group>

        <Button  type='submit' variant='primary' className='mt-3'>
          Update
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;