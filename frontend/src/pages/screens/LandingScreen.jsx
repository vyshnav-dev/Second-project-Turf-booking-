import "../../css/land.css";
import Card from "react-bootstrap/Card";
// import ListGroup from 'react-bootstrap/ListGroup';

import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import MainSlider from "../../components/MainSlider";
import Footer from "../../components/Footer";

function LandingScreen() {
  const [turf, setTurf] = useState([]);

  useEffect(() => {
    const fetchUserTurf = async () => {
      try {
        const response = await axios.get("/users/land-data");

        // Filter the turfs with isAprooved set to true
        const approvedTurfs = response.data.turf.filter(
          (turfItem) => turfItem.isAprooved === true
        );
        setTurf(approvedTurfs);
        console.log("www", approvedTurfs[0]);
      } catch (error) {
        console.error("Error fetching turf:", error);
      }
    };

    fetchUserTurf();
  }, []);

  return (
    <>
      <MainSlider></MainSlider>
      {/* {/* 
    <div className="land2">
      
    </div> */}
      <div
        className="land3"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
        }}
      >
        {turf.map((turfItem, index) => (
          <Card
            className="newone1"
            key={index}
            style={{
              width: "18rem",
              marginBottom: "20px",
              height: "20rem",
              backgroundColor: "white",
              marginTop: "50px",
            }}
          >
            <Link
              style={{ textDecoration: "none" }}
              to={"/details/" + turfItem._id}
            >
              <Card.Img
                style={{ height: "20rem", width: "18rem" }}
                variant="top"
                src={`https://spexcart.online/Images/${turfItem.imagePath[0]}`}
              />
              <Card.Body>
                <Card.Title
                  style={{
                    position: "absolute",
                    marginTop: "-5rem",
                    color: "white",
                  }}
                  className="tf1"
                >
                  {turfItem.turfname}
                </Card.Title>
                <h6
                  style={{
                    marginTop: "-3rem",
                    color: "white",
                    textDecoration: "none",
                  }}
                  className="tf2"
                >
                  {turfItem.location}
                </h6>
              </Card.Body>
            </Link>
          </Card>
        ))}
      </div>

      <div className="land1">
        <div className="land1-2">
          <h1>
            Meet Your Pals <br /> Over Game
          </h1>

          <p>
            Want to play games ?<br />
            But do not get an opponent team?
            <br />
            You can Invite a team or Join a pre scheduled match Through
            GreenGlide
          </p>
        </div>
        <div className="land1-3">
          <img
            src="https://www.playspots.in/wp-content/uploads/2020/02/meet-pals.png"
            alt=""
          />
        </div>
      </div>

      <div className="land4">
        <div style={{ display: "flex", margin: "auto" }}>
          <div className="raja" style={{ fontSize: "1rem", display: "flex" }}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <h2>Search</h2>
            <p>
              Are you looking to play after work, organize your Sunday Fives
              football match? Explore the largest network of sports facilities
              whole over the kochi
            </p>
          </div>
          <div className="raja" style={{ fontSize: "1rem", display: "flex" }}>
            <i className="fa-regular fa-calendar-check"></i>
            <h2>Book</h2>
            <p>
              Once you’ve found the perfect ground, court or gym, Connect with
              the venue through the Book Now Button to make online booking &
              secure easier payment
            </p>
          </div>
          <div className="raja" style={{ fontSize: "1rem", display: "flex" }}>
            <i className="fa-regular fa-futbol"></i>
            <h2>Play</h2>
            <p>
              You’re the hero, you’ve found a stunning turf or court, booked
              with ease and now its time to play. The scene is set for your epic
              match
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LandingScreen;
