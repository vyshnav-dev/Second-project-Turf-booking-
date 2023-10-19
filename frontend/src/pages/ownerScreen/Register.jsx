import { useState } from "react";

import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import { toast } from "react-toastify";
// import './Register/Register.css'
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../ownerSlice/ownerApiSlice";
import { setOwnerCredentials } from "../../ownerSlice/ownerSlice";
import Loader from "../../components/Loader";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Check if any of the fields are empty
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill in all fields.");
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
    } else {
      try {
        // Make the registration request
        const response = await register({
          name,
          email,
          phone,
          password,
          confirmPassword,
        }).unwrap();
        console.log(response);
        dispatch(setOwnerCredentials({ ...response }));
        toast.success(
          "Registration successful! Please check your email for the OTP."
        );
        navigate("/owner/otp");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="logdiv">
      <form className="form1" onSubmit={submitHandler}>
        <h1>Owner SignUp</h1>

        <div className="div1">
          <label htmlFor="name"> Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="div1">
          <label htmlFor="lastName">Email</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={email}
            placeholder="Enter Email "
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="div1">
          <label htmlFor="lastName">Mobile</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            value={phone}
            placeholder="Enter Mobile number "
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="div1">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="Password"
            id="Password"
            value={password}
            placeholder="Enter Password "
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="div1">
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            value={confirmPassword}
            placeholder="Enter Confirmpassword "
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div>
          {isLoading && <Loader />}
          <Button variant="primary" type="submit">
            sign Up
          </Button>
        </div>
        <div>
          Already have an account ? <Link to="/owner/login">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
