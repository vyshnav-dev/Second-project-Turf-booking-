import { Table, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

function BookingScreen() {
  // const { turfInfo } = useSelector((state) => state.turf);
  // console.log('qwqqq',turfInfo);
  // const turfId = turfInfo._id;

  const { ownerInfo } = useSelector((state) => state.owner);
  const ownerId = ownerInfo._id;

  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(`/owner/booklist/${ownerId}`, {
          withCredentials: true,
          params: { page: currentPage, search: searchQuery }, // Include searchQuery in the request
        });

        console.log("API Response:", response.data.docs);
        setList(response.data.docs);

        setTotalPages(response.data.length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchList();
  }, [ownerId, currentPage, searchQuery]); // Include turfId and currentPage in the dependency array

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  console.log(list);

  const handleConfirm = async (Id) => {
    console.log(Id);
    const result = await Swal.fire({
      title: "Confirm Accept",
      text: "Are you sure you want to accept this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Accept",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/owner/confirm/${Id}`);
        console.log(response);

        // Show a success alert
        Swal.fire({
          title: "Success!",
          text: "Booking accepted successfully",
          icon: "success",
        });
      } catch (error) {
        console.log(error);

        // Show an error alert
        Swal.fire({
          title: "Error!",
          text: "An error occurred while accepting the booking",
          icon: "error",
        });
      }
    }
  };

  const handleReject = async (Id) => {
    console.log(Id);
    const result = await Swal.fire({
      title: "Confirm Reject",
      text: "Are you sure you want to reject this booking?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`/owner/reject/${Id}`);
        console.log(response);

        // Show a success alert
        Swal.fire({
          title: "Success!",
          text: "Booking rejected successfully",
          icon: "success",
        });
      } catch (error) {
        console.log(error);

        // Show an error alert
        Swal.fire({
          title: "Error!",
          text: "An error occurred while rejecting the booking",
          icon: "error",
        });
      }
    }
  };

  const filteredList =
    list && list.length > 0
      ? list.filter((item) => {
          if (item.username && item.selectedGame) {
            return (
              item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.phoneNumber && item.phoneNumber.includes(searchQuery)) ||
              item.selectedGame
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
          } else {
            return false;
          }
        })
      : [];

  return (
    <>
      <h3 style={{ textAlign: "center", color: "white" }}>Turf Booking List</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: "1rem",
          paddingRight: "8rem",
        }}
      >
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Search by name, mobile, or game"
            value={searchQuery}
            onChange={handleSearch}
          />
        </Form.Group>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Table
          style={{ marginTop: "3rem", width: "80rem" }}
          striped
          bordered
          hover
          responsive
          variant="light"
        >
          <thead>
            <tr>
              <th>No</th>
              <th>TURF NAME</th>
              <th>NAME</th>
              <th>MOBILE</th>
              <th>DATE</th>
              <th>TIME</th>
              <th>GAME</th>
              <th>STATUS</th>
              <th>OPTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.turfname}</td>
                <td>{item.username}</td>
                <td>{item.phoneNumber}</td>
                <td>
                  {new Date(item.selectedDate).toLocaleDateString("en-GB")}
                </td>
                <td>{item.selectedTime}</td>
                <td>{item.selectedGame}</td>
                <td
                  style={{
                    color: item.isBooked
                      ? "green"
                      : item.isRejected || item.isCancel
                      ? "red"
                      : "orange",
                  }}
                >
                  {item.isBooked
                    ? "Success"
                    : item.isRejected || item.isCancel
                    ? "Cancel"
                    : "Pending"}
                </td>
                <td>
                  {item.isBooked || item.isRejected || item.isCancel ? null : (
                    <>
                      <Button
                        variant="success"
                        onClick={() => {
                          handleConfirm(item._id);
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          handleReject(item._id);
                        }}
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
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
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
          disabled={currentPage === filteredList.length}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </>
  );
}

export default BookingScreen;
