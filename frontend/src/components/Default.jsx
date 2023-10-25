import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setsearchCredentials } from '../searchSlice/searchSlice';

function Default() {
  const [locations, setLocations] = useState([]); // Store locations from the backend
  const [selectedLocation, setSelectedLocation] = useState(''); // Store the selected location
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of unique locations from the backend when the component mounts
    axios.get('users/defaultlocation')
      .then((response) => {
        setLocations(response.data.locations);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLocationChange = (e) => {
    const location = e.target.value;
    setSelectedLocation(location);

    // Filter turf data based on the selected location
    if (location) {
      axios.get(`/users/defaultfilter?location=${location}`)
        .then((response) => {
          dispatch(setsearchCredentials({ ...response.data.data }));
          navigate('/filter');
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Clear the turf data if no location is selected
      dispatch(setsearchCredentials([]));
     
    }
  };

  return (
    <>
    {/* <div style={{width:'10px',marginLeft:'-6rem'}} className="search-bar"> */}
    
      <select style={{width:'7rem',height:'20px',marginLeft:'-6rem',marginTop:'9px',backgroundColor:'transparent',color:'white',fontWeight: "bold",borderColor:'transparent'}} 
        className="location-select"
        onChange={handleLocationChange}
        value={selectedLocation}
      >
        <option  value="">Locations</option>
        {locations.map((location) => (
          <option style={{color:'black'}} key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
     
    {/* </div> */}
    </>
  );
}

export default Default;
