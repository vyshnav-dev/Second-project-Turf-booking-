import "../../css/success.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

function Success() {
  const [id, setId] = useState("");
  console.log(id);

  useEffect(() => {
    async function bookThisPlace() {
      try {
        const savedData = localStorage.getItem("bookingDetails");
        let bookingData = JSON.parse(savedData);
        console.log("zczcsc", bookingData);
        const response = await axios.post("/users/booking", {
          bookingData,
        });
        localStorage.clear();
        const bookingId = response.data;
        setId(bookingId);
      } catch (error) {
        console.log(error);
      }
    }

    bookThisPlace();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "50rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="main-container" style={{ marginBottom: "15rem" }}>
        <div className="check-container">
          <div className="check-background">
            <svg
              viewBox="0 0 65 51"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 25L27.3077 44L58.5 7"
                stroke="white"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="check-shadow"></div>
        </div>
        <h2>
          <strong style={{ color: "black" }}>BOOKING SUCCESS</strong>
        </h2>
        <Link to={"/history"}>Bookigs</Link>
      </div>
    </div>
  );
}

export default Success;
