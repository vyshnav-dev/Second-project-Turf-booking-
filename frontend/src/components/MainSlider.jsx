
import { useEffect, useState } from 'react';
import '../css/mailSlider.css'
import image from '../data';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
const MainSlider = () => {

    const [current,setCurrent] = useState(0)
    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(current===2){
                setCurrent(0)
            }else{
                setCurrent(current+1)
            }
        },4000)
        return ()=> clearTimeout(timer)
    },[current])
    const bgimage = {
        backgroundImage:`url(${image[current].url})`,
        backgroundPosition:'center',
        backgroundSize:'cover',
        height:'100%',
        marginTop:'-80px'
    }

    const navigate=useNavigate()

  const submit=()=>{
          navigate('/venue') 
        
  }

    const goToNext = (current)=>{
        setCurrent(current)
    }
  return (
    <div className='mainslide1'>
      <div style={bgimage}>
        <Header/>
        <div className='mainDescription'>
            <h1>LET THE WORLD PLAY</h1>
            <p>Book Your Ideal Sports Turf and Elevate Your Game!</p>
        </div>

      <div className='inner1' >
            <Button style={{width:'14rem',borderRadius:'6rem'}} onClick={submit} variant='outline-light'>Explore</Button>
            
      </div>
      </div>
      

      <div className='mainslide2'>
        {   image.map((image,current)=>(
            <span key={current} onClick={()=>goToNext(current)}></span>

        ))
        }
        </div>
    </div>
   
  );
}

export default MainSlider;
