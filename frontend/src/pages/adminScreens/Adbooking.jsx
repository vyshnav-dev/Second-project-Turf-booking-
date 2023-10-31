import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Card, Button, Form } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import '../../css/adbooking.css'


function Adbooking() {
  const [turf, setTurf] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // const [filteredTurf, setFilteredTurf] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Number of rows per page

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const response = await axios.get(`/admin/booking?page=${currentPage}&limit=${pageSize}&search=${searchQuery}`);
        setTurf([...response.data.turf]);
      } catch (error) {
        console.error('Error fetching booking:', error);
      }
    };

    fetchTurf();
  }, [currentPage, searchQuery,setTurf]);

  

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100vh',
          width: '100vw',
          backgroundColor:'lightgray',
          margin:'auto'
        }}
      >
        <Sidebar />
        <Card className="adbookcard" >
          <Card.Body>
            <h3 style={{ textAlign: 'center' }}>Booking Details</h3>
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '2rem' }}>
              <Form.Group style={{ width: '18rem' }} controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search by name, mobile, or turf name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </Form.Group>
            </div>
            <Table
              style={{ marginTop: '3rem', width: '100%', margin: 'auto' }}
              striped bordered hover responsive
              variant="dark"
            >
              <thead>
                <tr>
                  <th>No</th>
                  <th>NAME</th>
                  <th>MOBILE</th>
                  <th>TURF NAME</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>GAME</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {turf.map((lists, index) => (
                  <tr key={lists._id}>
                    <td>{index + 1}</td>
                    <td>{lists.username}</td>
                    <td>{lists.phoneNumber}</td>
                    <td>{lists.turfname}</td>
                    <td>
                      {new Date(lists.selectedDate).toLocaleDateString(
                        'en-GB'
                      )}
                    </td>
                    <td>{lists.selectedTime}</td>
                    <td>{lists.selectedGame}</td>
                    <td>{lists.price}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
            >
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <div style={{ margin: '0 1rem' }}>
                Page {currentPage}
              </div>
              <Button
                variant="secondary"
                disabled={turf.length < pageSize}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default Adbooking;
