import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
// import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import Chatapp from "./Chatapp";
import Carousel from "react-bootstrap/Carousel";
import { setturfCredentials } from "../../turfSlice/turfSlice";
import { useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import "../../css/details.css";
function Details() {
  const pKey =
    "pk_test_51NyV1ISEiJ26p4TqBUGzGFL0VU7NFv4lxQexYKiM4cs4fG5eKkP60VH4SCqJW52GmpjXdNlZgvJfj4rzjgUw8yE400eXeI9dV9";
  const dispatch = useDispatch();

  const { id } = useParams();
  const [turf, setTurf] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedGame, setSelectedGame] = useState("Select a game");
  const [selectedTime, setSelectedTime] = useState("");
  const { userInfo } = useSelector((state) => state.auth);
  // const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const resetErrorMessage = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    const fetchUserTurf = async () => {
      try {
        const response = await axios.get(`/users/turf-details/${id}`);
        setTurf(response.data.turf);
        dispatch(setturfCredentials({ ...response.data.turf }));
      } catch (error) {
        console.error("Error fetching turf:", error);
      }
    };

    fetchUserTurf();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    resetErrorMessage(); // Reset error message

    const formData = {
      selectedDate: selectedDate.toISOString().split("T")[0],
      selectedGame,
      selectedTime,
      userId: userInfo._id,
      username: userInfo.name,
      turfId: turf._id,
      ownerId: turf.ownerId,
      turfname: turf.turfname,
      price: turf.price,
    };

    localStorage.setItem("bookingDetails", JSON.stringify(formData));

    payment();
  };

  async function payment() {
    const stripe = await loadStripe(pKey);

    const { data } = await axios.post("/users/payment", {
      name: turf.turfname,
      price: turf.price,
      turf: turf._id,
    });

    const result = await stripe.redirectToCheckout({
      sessionId: data.id,
    });
    if (result?.error) {
      toast.error(result.error);
    }
  }

  const handleDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    setSelectedDate(selectedDate);
  };

  const handleGameChange = (event) => {
    const selectedGame = event.target.value;
    setSelectedGame(selectedGame);
  };

  console.log("turf:", turf);

  return (
    <div className="details-container">
      <div className="image-carousel">
        {turf.imagePath && (
          <Carousel indicators={false.toString()} arrows={true.toString()}>
            {turf.imagePath.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  style={{
                    width: "28rem",
                    height: "28rem",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                  }}
                  className="d-block w-400"
                  src={`https://spexcart.online/Images/${image}`}
                  alt={`Product Image ${index + 1}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>

      <div className="details-info">
        <h2>{turf.turfname}</h2>
        <p style={{color:'black'}}>{turf.description}</p>
        <h4>{turf.address}</h4>
        <h4>{turf.location}</h4>
        <h4>{turf.number}</h4>
        <h3>₹{turf.price}</h3>

        <form onSubmit={handleSubmit}>
          <div>
            <div>
              <label>Select Date:</label>
              <input
                style={{ width: "15rem" }}
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div style={{ paddingTop: "10px" }}>
              <label>Select Game:</label>
              <select
                style={{ width: "15rem", height: "42px", borderRadius: "10px" }}
                value={selectedGame}
                onChange={handleGameChange}
              >
                <option value="">Select a game</option>
                {turf.game &&
                  turf.game.map((game, i) => (
                    <option key={i} value={game}>
                      {game}
                    </option>
                  ))}
              </select>
            </div>

            <div style={{ paddingTop: "10px" }}>
              <label>Select Time:</label>
              <select
                style={{ width: "15rem", height: "42px", borderRadius: "10px" }}
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Select a time</option>
                {turf.time &&
                  turf.time.map((timeSlot, index) => (
                    <option key={index} value={timeSlot.times}>
                      {timeSlot.ishide ? null : timeSlot.times}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div style={{ paddingTop: "10px" }}>
            <Button variant="success" type="submit">
              Book Now
            </Button>
          </div>
        </form>
        <div className="error-message">{errorMessage}</div>
      </div>
      <Chatapp />
    </div>
  );
}

export default Details;
