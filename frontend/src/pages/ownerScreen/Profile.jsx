import { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { Form, Button,Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useUpdateOwnerMutation } from '../../ownerSlice/ownerApiSlice'; 
import { setOwnerCredentials } from '../../ownerSlice/ownerSlice'; 


const Profile = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const dispatch = useDispatch();

  const navigate=useNavigate();

  const { ownerInfo } = useSelector((state) => state.owner);

  const [updateProfile, { isLoading }] = useUpdateOwnerMutation();

  useEffect(() => {
    setName(ownerInfo.name||ownerInfo.data.name);
    setEmail(ownerInfo.email || ownerInfo.data.email);
  }, [ownerInfo.email, ownerInfo.name]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
     
        const formData = new FormData();
        formData.append('_id', ownerInfo._id);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('file', image);
          // const res = await updateProfile({
          //   _id:userInfo._id,
          //   name,
          //   email,
          //   password,
          //   formdata: image ? new FormData().append('file', image) : undefined,
          // }).unwrap();
          console.log('kkkk',formData);
      
          const res = await updateProfile(formData).unwrap();
          console.log(res);
  
          dispatch( setOwnerCredentials(res));
          toast.success("Profile updated successfully");
          navigate("/owner")
        } 
   catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  
  return (
    <FormContainer  className="form-container">
      <div>
      <h1 style={{color:'blue', textAlign:'center'}}> Owner Profile</h1>
      </div>
      
      <div style={{display:'flex',justifyContent:'center',marginTop:'20px'}}>
        <Image style={{width:"90px",marginRight:"10px"}} src= { ownerInfo.image ?`https://spexcart.online/uploads/${ownerInfo.image}`:'https://cdn.vectorstock.com/i/preview-1x/99/94/default-avatar-placeholder-profile-icon-male-vector-23889994.jpg'} roundedCircle />
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

export default Profile;