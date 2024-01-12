import { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import { ToastContainer, toast, Zoom } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { Button } from 'react-bootstrap';

export default function Forgotpassword () {
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(true)
  const [password, setPassword] = useState('')
  const [Cpassword, setCpassword] = useState('')

  const location = useLocation()
  const id = location.pathname.split('/')[2]
  const navigate = useNavigate()

  const handlePassword = e => {
    setPassword(e.target.value)
  }

  const handleCPassword = e => {
    setCpassword(e.target.value)
  }
  const handleChangePasword = async () => {
    console.log('frooooo');
    const data = {
      password: password,
      Cpassword: Cpassword
    }
    try {
      const result = await axios.put(`/users/changePassword/${id}`, data)
      console.log(result)
      if (result) {
        await Swal.fire({
          title: 'Success!',
          text: 'Your password changed success',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        navigate('/login')
      }
    } catch (error) {
      console.log(error.response.data.message)
      toast.warn(error.response.data.message, {
        transition: Zoom,
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  return (
    <div>
      <Modal
        show={open}
        //   onRequestClose={closeModal }
        // style={ProfileModalStyles}
        contentLabel='Edit Profile Modal'
      >
        <div className='modalSecondIn'>
          <h4 style={{textAlign:'center'}}>Change Password</h4>
          <div style={{display:'flex',justifyContent:'center'}} className='modalTextfelidContainer'>
            <div>
            <input
            style={{borderColor:'black'}}
              id='password'
              onChange={handlePassword}
              placeholder='Enter password'
              type='password'
              
            />
            </div>
            <div>
            <input
              style={{borderColor:'black'}}
              id='Cpassword'
              onChange={handleCPassword}
              placeholder='confirm-password'
              type='password'
              
            />
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'end',marginTop:'3rem'}}>
            <Button
              onClick={handleChangePasword}
              Button
              variant='success'
              
            >
              Send
            </Button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  )
}