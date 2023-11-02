import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "../../css/booking.css";
import { Button } from "react-bootstrap";
// import Chatapp from './Chatapp';
// import Swal from 'sweetalert2';
function Booking() {
  const [list, setList] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;
  const [page, setPage] = useState(1);
  const limit = 3;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(`/users/bookhistory/${userId}`, {
          params: {
            page,
            limit,
            search: searchQuery,
          },
          withCredentials: true,
        });
        console.log("zvvvvv", response.data.list);
        setList(response.data.list);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchList();
  }, [userId, page, limit, searchQuery, setList]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to the first page when changing the search query
  };

  let maintb = {
    width: "80%",
    margin: "1rem auto",
    marginTop: "3rem",
  };

  let tbhead = {
    display: "flex",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: "12px",
    padding: ".5rem",
    fontSize: "10px",
  };

  let tableBody = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "12px",
  };

  const handleCancel = async (Id, index) => {
    try {
      const response = await axios.post(`/users/cancel/${Id}`);
      // Update the status and remove the button for the canceled booking
      console.log(response);
      const updatedList = [...list];
      updatedList[index].isCancel = true;
      updatedList[index].isBooked = false;
      setList(updatedList);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="outer" style={maintb}>
        <div style={{ textAlign: "center", color: "white" }}>
          <h2>Bookings</h2>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "end",
            marginBottom: "2rem",
          }}
          className="search"
        >
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearchChange}
            value={searchQuery}
          />
        </div>

        <div className="bkheaddiv"  style={tbhead}>
          <h4 className="no">No</h4>
          <h4 className="name">TURF NAME</h4>
          <h4 className="name">DATE</h4>
          <h4 className="time">TIME</h4>
          <h4 className="game">GAME</h4>
          <h4 className="game">PRICE</h4>
          <h4 className="status">STATUS</h4>
        </div>
        <div className="bkdatadiv">
          {list.map((booking, index) => (
            <div className="list-booking" key={index} style={tableBody}>
              <h5 className="no">{index + 1}</h5>
              <h5 className="name">{booking.turfname}</h5>
              <h5 className="name">
                {new Date(booking.selectedDate).toISOString().split("T")[0]}
              </h5>
              <h5 className="time">{booking.selectedTime}</h5>
              <h5 className="game">{booking.selectedGame}</h5>
              <h5 className="game">{booking.price}</h5>

              <h5
                className="status"
                style={{
                  color: booking.isBooked
                    ? "green"
                    : booking.isRejected || booking.isCancel
                    ? "red"
                    : "orange",
                }}
              >
                {booking.isBooked
                  ? "Success"
                  : booking.isRejected || booking.isCancel
                  ? "Cancel"
                  : "Pending"}
              </h5>
              <h5>
                {booking.isCancel || booking.isRejected ? null : (
                  <Button onClick={() => handleCancel(booking._id, index)}>
                    Cancel
                  </Button>
                )}
              </h5>

              {/* Pass turfId to Chatapp component */}
              {/* <Chatapp turfId={booking.turfId} /> */}
            </div>
          ))}
        </div>
      </div>
      {/* Pagination and Search Controls */}
      <div className="pagination-search-controls">
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page: {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={list.length < limit}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Booking;
