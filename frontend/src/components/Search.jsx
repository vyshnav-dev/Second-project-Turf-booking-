import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import { setsearchCredentials } from '../searchSlice/searchSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../css/search.css';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Use the useLocation hook to get the current location

  useEffect(() => {
    // Get the search query parameter from the URL
    const searchQuery = new URLSearchParams(location.search).get('q');
    if (searchQuery) {
      setSearchTerm(searchQuery); // Set the search term from the query parameter
    } else {
      setSearchTerm(''); // If no query parameter, set it to an empty string
    }
  }, [location]);

  const handleSearch = async () => {
    try {
      // Log the searchTerm state variable
      console.log('Search Term:', searchTerm);

      // Make an Axios request to your backend
      const response = await axios.get(`/users/search`, { params: { searchTerm } });

      // Handle the response from the backend here
      console.log(response.data.data);
      dispatch(setsearchCredentials({ ...response.data.data }));
      navigate('/filter');
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  };

  return (
    <div className="search-bar">
      <input style={{backgroundColor:'#ffffff62'}}
        className="search-input"
        type="text"
        placeholder="Search......."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <i
        onClick={handleSearch}
        style={{ fontSize: '20px' }}
        className="fa-solid fa-magnifying-glass"
      ></i>
    </div>
  );
}

export default Search;



