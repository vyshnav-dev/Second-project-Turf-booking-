import  { useEffect, useState } from "react";
import axios from "axios";
import { Table, OverlayTrigger, Tooltip, Button, Card, Form } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import Swal from 'sweetalert2';
import '../../css/adTurf.css'

function AdTurf() {
  const [turf, setTurf] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTurf, setFilteredTurf] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2; // Set the desired page size here

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const response = await axios.get(`/admin/turf?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`);
        setTurf([...response.data.turf]);
        // You can also update the total number of pages if needed
      } catch (error) {
        console.error('Error fetching turf:', error);
      }
    };

    fetchTurf();
  }, [currentPage, pageSize, searchQuery,setTurf]);

  console.log('efsd',turf);

  const handleConfirm = async (Id) => {
    console.log(Id);

    // Show a confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Accept",
      text: "Are you sure you want to accept this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Accept",
      cancelButtonText: "Cancel",
    });

    // If the user clicks "OK," proceed with the action
    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/confirm/${Id}`);
        console.log(response);

        // Show a success SweetAlert when accepted
        Swal.fire({
          icon: "success",
          title: "Accepted",
          text: "The request has been accepted successfully!",
        });

        // You can also reload the data or update the state here if needed

      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleReject = async (Id) => {
    console.log(Id);

    // Show a confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Reject",
      text: "Are you sure you want to reject this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    });

    // If the user clicks "OK," proceed with the action
    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/reject/${Id}`);
        console.log(response);

        // Show a success SweetAlert when rejected
        Swal.fire({
          icon: "error",
          title: "Rejected",
          text: "The request has been rejected!",
        });

        // You can also reload the data or update the state here if needed

      } catch (error) {
        console.log(error);
      }
    }
  }


  useEffect(() => {
    // Filter the turf data based on the search query
    const filteredResults = turf.filter((venue) =>
    venue.turfname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    
    venue.ownername.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTurf(filteredResults);
  }, [searchQuery, turf,setFilteredTurf]);
  // const filteredTurf = turf.filter((venue) =>
  //   venue.turfname.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   venue.ownername.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  

 
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', width: '100vw', margin:'auto',backgroundColor:'lightgray',}}>
        <Sidebar />
        
        <Card className="landcard" style={{ width: '80%', margin: 'auto' }}>
          <Card.Body>
            <h3 style={{ textAlign: 'center' }}>Turf Details</h3>
            <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '2rem' }}>
              <Form.Group style={{ width: '18rem' }} controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search by turf name or owner name"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </Form.Group>
            </div>
            
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>IMAGE</th>
                    <th>TURF NAME</th>
                    <th>NAME</th>
                    <th>MOBILE</th>
                    <th>TIME</th>
                    <th>GAME</th>
                    <th>ADDRESS</th>
                    <th>DESCRIPTION</th>
                    <th>OPTION</th>
                  </tr>
                </thead>
                <tbody>
                {filteredTurf.map((venue, index) => (
                  <tr key={venue._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        style={{ height: '50px', width: '50px' }}
                        src={`http://localhost:5000/Images/${venue.imagePath[0]}`}
                        alt=""
                      />
                    </td>
                    <td>{venue.turfname}</td>
                    <td>{venue.ownername}</td>
                    <td>{venue.number}</td>
                    <td>
  {venue.time.map((timeItem, i) => (
    <span key={i}>#{timeItem.times} <br /></span>
  ))}
</td>
                    <td>
                      {venue.game.map((game, i) => (
                        <span key={i}>{game}<br /></span>
                      ))}
                    </td>
                    <td >{venue.location}</td>
                    <td style={{ width: '400px' }}>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${venue._id}`}>{venue.description}</Tooltip>}
                      >
                        <div style={{ maxHeight: '50px', maxWidth: '400px', overflowY: 'scroll' }}>{venue.description}</div>
                      </OverlayTrigger>
                    </td>
                    <td>
                      {venue.isAprooved || venue.isRejected ? null : (
                        <>
                          <Button
                            variant="success"
                            onClick={() => { handleConfirm(venue._id) }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => { handleReject(venue._id) }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </Table>
          
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
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
                disabled={filteredTurf.length < pageSize}
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

export default AdTurf;

