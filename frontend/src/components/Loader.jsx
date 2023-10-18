import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Spinner
     
    animation='right5231 0.9s linear infinite'
     
      role='status'
      style={{
        
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
        borderLeft:'5px solid #38ff8e',
        borderRadius:'50%'
        
      }}
    ></Spinner>
  );
};

export default Loader;