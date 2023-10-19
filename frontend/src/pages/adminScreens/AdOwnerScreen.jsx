import Swal from "sweetalert2";
import { Button, Card, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

const AdOwnerScreen = () => {
  const headerStyle = {
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  };
  const containerStyle = {
    paddingTop: "5rem",
    paddingLeft: "5rem",
    paddingRight: "5rem",
    width: "97%",
    overflowY: "scroll",
  };

  const [owners, setOwners] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Set your desired page size here
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get(`/admin/adminowner`, {
          withCredentials: true,
          params: {
            page: currentPage,
            pageSize: pageSize,
            search: searchQuery, // Send the search query to the backend
          },
        });
        console.log(response.data.owners);
        setOwners(response.data.owners);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };

    fetchOwners();
  }, [currentPage, pageSize, searchQuery, setOwners, setTotalPages]);

  const blockOwner = async (ownerId) => {
    const result = await Swal.fire({
      title: "Confirm Block Owner",
      text: "Are you sure you want to block this owner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, block it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/blockowner?id=${ownerId}`);
        console.log("Blocked owner:", response.data.owners);
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner._id === ownerId ? { ...owner, isBlocked: true } : owner
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const unblockOwner = async (ownerId) => {
    const result = await Swal.fire({
      title: "Confirm Unblock Owner",
      text: "Are you sure you want to unblock this owner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, unblock it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/admin/unblockowner?id=${ownerId}`);
        console.log(response);
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner._id === ownerId ? { ...owner, isBlocked: false } : owner
          )
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        backgroundColor: "lightgray",
      }}
    >
      <Sidebar />
      <div style={containerStyle}>
        <Card>
          <Card.Body>
            <h2 style={headerStyle}>Owner List</h2>
            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginBottom: "1rem",
              }}
            >
              <input
                style={{ borderColor: "black" }}
                type="text"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Option</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner, index) => (
                  <tr key={owner._id}>
                    <td>{index + 1}</td>
                    <td>{owner.name}</td>
                    <td>{owner.email}</td>
                    {!owner.isBlocked ? (
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => blockOwner(owner._id)}
                        >
                          Block
                        </Button>
                      </td>
                    ) : (
                      <td>
                        <Button
                          variant="success"
                          onClick={() => unblockOwner(owner._id)}
                        >
                          Unblock
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <div style={{ margin: "0 1rem" }}>
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default AdOwnerScreen;
