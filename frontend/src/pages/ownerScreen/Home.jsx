import { OverlayTrigger, Tooltip } from "react-bootstrap";

import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { setturfCredentials } from "../../turfSlice/turfSlice";
import { useDispatch } from "react-redux";
import Ownerchat from "./Ownerchat";

function Home() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [turf, setTurf] = useState([]);
  const [turfname, setTurfname] = useState("");
  const [time, setTime] = useState([]);
  const [game, setGame] = useState([]);
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState([]);
  const [description, setDescription] = useState("");

  const [editingVenue, setEditingVenue] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModal = () => setShowEditModal(false);
  const handleShowEditModal = () => setShowEditModal(true);

  // State for error messages
  const [errors, setErrors] = useState({
    turfname: "",
    time: "",
    game: "",
    price: "",
    address: "",
    location: "",
    description: "",
    file: "",
  });

  const { ownerInfo } = useSelector((state) => state.owner);

  const { turfInfo } = useSelector((state) => state.turf);

  console.log("kitteelaa", turfInfo);

  const id = ownerInfo._id;
  const name = ownerInfo.name;
  const number = ownerInfo.phone;

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        const response = await axios.get(`/owner/owner/${id}`);
        console.log("kooo", response);
        setTurf([...response.data.turf]);
        dispatch(setturfCredentials({ ...response.data.turf }));
      } catch (error) {
        console.error("Error fetching turf:", error);
      }
    };

    fetchTurf();
  }, [setTurf, id]);

  const handleEditClick = (venue) => {
    setEditingVenue(venue);
    setTurfname(venue.turfname);
    setTime(
      venue.time.map((timeItem) => ({
        label: timeItem.times,
        value: timeItem.times,
      }))
    );
    setGame(venue.game.map((game) => ({ label: game, value: game })));
    setPrice(venue.price);
    setAddress(venue.address);
    setLocation(venue.location);
    setDescription(venue.description);
    // You may also need to set 'file' with the current image files, but it depends on your implementation.
    // If you want to edit the image files, you would need to handle that separately.
    // setFile(venue.imagePath);
    handleShowEditModal();
  };

  const submitEditHandler = async (e) => {
    e.preventDefault();

    // Validate required fields
    const validationErrors = {};

    if (!turfname || !turfname.trim()) {
      validationErrors.turfname = "Turf Name is required";
    }

    if (time.length === 0) {
      validationErrors.time = "At least one Time selection is required";
    }

    if (game.length === 0) {
      validationErrors.game = "At least one Game selection is required";
    }

    if (!price || !price.trim()) {
      validationErrors.price = "Price is required";
    }

    if (!address || !address.trim()) {
      validationErrors.address = "Address is required";
    }

    if (!location || !location.trim()) {
      validationErrors.location = "location is required";
    }

    if (!description || !description.trim()) {
      validationErrors.description = "Description is required";
    }

    if (file.length === 0) {
      validationErrors.file = "At least one image is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Prevent form submission if there are errors
    }

    // Rest of your form submission logic
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("file", file[i]);
    }

    formData.append("turfname", turfname);
    formData.append("ownerId", id);
    formData.append("ownername", name);
    formData.append("number", number);
    formData.append("price", price);
    formData.append("address", address);
    formData.append("location", location);

    formData.append("description", description);

    const timeValues = time.map((option) => option.value);
    const gameValues = game.map((option) => option.value);

    formData.append("time", JSON.stringify(timeValues));
    formData.append("game", JSON.stringify(gameValues));

    // Clear errors
    setErrors({
      turfname: "",
      time: "",
      game: "",
      price: "",
      address: "",
      location: "",
      description: "",
      file: "",
    });

    try {
      // Your axios.put() logic here
      await axios.put(`/owner/edit-turf/${editingVenue._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedTurf = turf.map((venue) =>
        venue._id === editingVenue._id
          ? { ...venue, turfname, location, description }
          : venue
      );

      setTurf(updatedTurf);

      handleCloseEditModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit venue. Please try again.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate required fields
    const validationErrors = {};

    if (!turfname.trim()) {
      validationErrors.turfname = "Turf Name is required";
    }

    if (time.length === 0) {
      validationErrors.time = "At least one Time selection is required";
    }

    if (game.length === 0) {
      validationErrors.game = "At least one Game selection is required";
    }

    if (!price.trim()) {
      validationErrors.price = "Price is required";
    }

    if (!address.trim()) {
      validationErrors.address = "Address is required";
    }
    if (!location.trim()) {
      validationErrors.location = "Address is required";
    }

    if (!description.trim()) {
      validationErrors.description = "Description is required";
    }

    if (file.length === 0) {
      validationErrors.file = "At least one image is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Prevent form submission if there are errors
    }

    // Rest of your form submission logic
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("file", file[i]);
    }

    formData.append("turfname", turfname);
    formData.append("ownerId", id);
    formData.append("ownername", name);
    formData.append("number", number);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("address", address);
    formData.append("description", description);

    const timeValues = time.map((option) => option.value);
    const gameValues = game.map((option) => option.value);

    formData.append("time", JSON.stringify(timeValues));
    formData.append("game", JSON.stringify(gameValues));

    // Clear errors
    setErrors({
      turfname: "",
      time: "",
      game: "",
      price: "",
      address: "",
      location: "",
      description: "",
      file: "",
    });

    try {
      // Your axios.post() logic here
      await axios.post("/owner/add-turf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const response = await axios.get(`/owner/owner/${id}`);
      console.log("looooo", response);
      setTurf([...response.data.turf]);

      handleClose();

      setTurfname("");
      setTime([]);
      setGame([]);
      setPrice("");
      setAddress("");
      setLocation("");
      setDescription("");
      setFile([]);
    } catch (error) {
      console.log(error);
      toast.error("Please fill out the fields");
    }
  };

  console.log("xcvvc", turf);

  const handleHideTimeClick = async (venueId, timeId) => {
    try {
      await axios.put(`/owner/hide-time/${venueId}/${timeId}`);

      // Update the local state to set ishide to true
      const updatedTurf = turf.map((venue) => {
        if (venue._id === venueId) {
          return {
            ...venue,
            time: venue.time.map((time) =>
              time._id === timeId ? { ...time, ishide: true } : time
            ),
          };
        }

        return venue;
      });

      setTurf(updatedTurf);

      toast.success("Time hidden successfully", { position: "top-center" });
    } catch (error) {
      console.error("Error hiding time:", error);
      toast.error("Failed to hide time. Please try again.");
    }
  };

  const handleunHideTimeClick = async (venueId, timeId) => {
    try {
      await axios.put(`/owner/unhide-time/${venueId}/${timeId}`);

      // Update the local state to set ishide to true
      const updatedTurf = turf.map((venue) => {
        if (venue._id === venueId) {
          return {
            ...venue,
            time: venue.time.map((time) =>
              time._id === timeId ? { ...time, ishide: false } : time
            ),
          };
        }

        return venue;
      });

      setTurf(updatedTurf);

      toast.success("Time unhidden successfully", { position: "top-center" });
    } catch (error) {
      console.error("Error unhiding time:", error);
      toast.error("Failed to unhide time. Please try again.");
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "end", paddingRight: "5rem" }}
      >
        <Button
          style={{ marginTop: "2rem", marginBottom: "2rem" }}
          variant="primary"
          onClick={handleShow}
        >
          Add Venue
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>ADD VENUE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Turf Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter turfname"
                value={turfname}
                onChange={(e) => setTurfname(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.turfname}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Time</Form.Label>
              <CreatableSelect
                placeholder="add time"
                value={time}
                onChange={(selectedOption) => {
                  setTime(selectedOption);
                  setErrors({ ...errors, time: "" }); // Clear time error when user selects a value
                }}
                isMulti
              />
              <Form.Text className="text-danger">{errors.time}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Games</Form.Label>
              <CreatableSelect
                placeholder="add game"
                value={game}
                onChange={(selectedOption) => {
                  setGame(selectedOption);
                  setErrors({ ...errors, game: "" }); // Clear game error when user selects a value
                }}
                isMulti
              />
              <Form.Text className="text-danger">{errors.game}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.price}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.address}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.location}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Form.Text className="text-danger">
                {errors.description}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                placeholder="Enter image name"
                onChange={(e) => setFile(e.target.files)}
                multiple
              />
              <Form.Text className="text-danger">{errors.file}</Form.Text>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Venue modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>EDIT VENUE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitEditHandler}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Turf Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter turfname"
                value={turfname}
                onChange={(e) => setTurfname(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.turfname}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Time</Form.Label>
              <CreatableSelect
                placeholder="add time"
                value={time}
                onChange={(selectedOption) => {
                  setTime(selectedOption);
                  setErrors({ ...errors, time: "" }); // Clear time error when user selects a value
                }}
                isMulti
              />
              <Form.Text className="text-danger">{errors.time}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Games</Form.Label>
              <CreatableSelect
                placeholder="add game"
                value={game}
                onChange={(selectedOption) => {
                  setGame(selectedOption);
                  setErrors({ ...errors, game: "" }); // Clear game error when user selects a value
                }}
                isMulti
              />
              <Form.Text className="text-danger">{errors.game}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.price}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.address}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Form.Text className="text-danger">{errors.location}</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Form.Text className="text-danger">
                {errors.description}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Images</Form.Label>
              <Form.Control
                type="file"
                placeholder="Enter image name"
                onChange={(e) => setFile(e.target.files)}
                multiple
              />
              <Form.Text className="text-danger">{errors.file}</Form.Text>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Table
        style={{ marginTop: "3rem", width: "90%", margin: "auto" }}
        striped
        bordered
        hover
        responsive
        variant="light"
      >
        <thead>
          <tr>
            <th>No</th>
            <th>IMAGE</th>
            <th>TURF NAME</th>
            <th>TIME</th>
            <th>GAME</th>
            <th>
              PRICE <br />
              (Rs)
            </th>
            <th>ADDRESS</th>
            <th>DESCRIPTION</th>
            <th>STATUS</th>
            <th>OPTION</th>
          </tr>
        </thead>
        <tbody>
          {turf.map((venue, index) => (
            <tr key={venue._id}>
              <td>{index + 1}</td>
              <td>
                <img
                  style={{ height: "50px", width: "50px" }}
                  src={`http://localhost:5000/uploads/${venue.imagePath[0]}`}
                  alt=""
                />
              </td>
              <td>{venue.turfname}</td>
              <td>
                {venue.time.map((timeItem, i) => (
                  <div style={{ margin: "5px" }} key={i}>
                    {timeItem.times}{" "}
                    {timeItem.ishide ? (
                      <Button
                        variant="success"
                        onClick={() =>
                          handleunHideTimeClick(venue._id, timeItem._id)
                        }
                      >
                        unhide
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleHideTimeClick(venue._id, timeItem._id)
                        }
                      >
                        hide
                      </Button>
                    )}{" "}
                    <br />
                  </div>
                ))}
              </td>

              <td>
                {venue.game.map((game, i) => (
                  <span key={i}>
                    {game}
                    <br />
                  </span>
                ))}
              </td>
              <td>{venue.price}</td>
              <td>{venue.address}</td>
              <td style={{ width: "400px" }}>
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-${venue._id}`}>
                      {venue.description}
                    </Tooltip>
                  }
                >
                  <div
                    style={{
                      maxHeight: "50px",
                      maxWidth: "400px",
                      overflowY: "scroll",
                    }}
                  >
                    {venue.description}
                  </div>
                </OverlayTrigger>
              </td>
              <td
                style={{
                  color: venue.isAprooved
                    ? "green"
                    : venue.isRejected
                    ? "red"
                    : "orange",
                }}
              >
                {venue.isAprooved
                  ? "Success"
                  : venue.isRejected
                  ? "Cancel"
                  : "Pending"}
              </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleEditClick(venue)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Ownerchat />
    </>
  );
}

export default Home;


