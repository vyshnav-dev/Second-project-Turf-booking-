import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ScaleLoader} from 'react-spinners'; // Import the ClipLoader spinner
import '../../css/userhome.css'

const HomeScreen = () => {
  const [turf, setTurf] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserTurf = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const response = await axios.get(`/users/turf-data?page=${currentPage}&filter=${selectedFilter}`);
        setTurf(response.data.docs);
        setTotalPages(response.data.totalPages);
        setLoading(false); // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching turf:", error);
        setLoading(false); // Make sure to set loading to false in case of an error
      }
    };

    fetchUserTurf();
  }, [currentPage, selectedFilter,setTurf]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <>
    <div >
      <div style={{ marginLeft: '20px', marginTop: '20px' }}>
        <h4 style={{ color: 'white' }}>Filter By Game:</h4>
        <Button variant='outline-info' onClick={() => handleFilterChange('All')}>All</Button>
        <Button variant='outline-info' onClick={() => handleFilterChange('football')}>Football</Button>
        <Button variant='outline-info' onClick={() => handleFilterChange('cricket')}>Cricket</Button>
      </div>
      {loading ? ( // Render the spinner if loading is true
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <ScaleLoader  color={'white'} loading={loading} size={100} />
        </div>
      ) : (
        // Render the turf cards when loading is false
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px', flexWrap: 'wrap' }}>
          {turf.map((turfItem, index) => (
            <Card className='homecard' key={index} style={{ width: '20rem', marginBottom: '20px', height: '22rem', backgroundColor: 'white' }}>
              <Link to={'/details/' + turfItem._id}>
                <Card.Img style={{ height: '22rem', width: '20rem' }} variant="top" src={`http://localhost:5000/uploads/${turfItem.imagePath[0]}`} />
                <Card.Body>
                  <Card.Title style={{ position: 'absolute', marginTop: '-5rem', color: 'white' }} className='tf1'>{turfItem.turfname}</Card.Title>
                  <ListGroup.Item style={{ marginTop: '-3rem', color: 'white', textDecoration: 'none' }} className='tf2'>{turfItem.location}</ListGroup.Item>
                </Card.Body>
              </Link>
            </Card>
          ))}
        </div>
      )}
      <div style={{ height: '40px', display: 'flex', justifyContent: 'center', marginTop: '30px' }} className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
      </div>
    </>
  )
  
};

export default HomeScreen;


