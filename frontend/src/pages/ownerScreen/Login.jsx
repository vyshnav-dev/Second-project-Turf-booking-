/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

import { Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../../ownerSlice/ownerApiSlice";
import { setOwnerCredentials } from "../../ownerSlice/ownerSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
// import './Login/Login.css'
import { GoogleLogin } from "@react-oauth/google";
import "../../css/owner.css";

import jwt_decode from "jwt-decode";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { ownerInfo } = useSelector((state) => state.owner);

  useEffect(() => {
    if (ownerInfo) {
      navigate("/owner");
    }
  }, [navigate, ownerInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setOwnerCredentials({ ...res }));
      navigate("/owner");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const [googleLogin] = useGoogleLoginMutation();

  const handleGoogleSignInSuccess = async (response) => {
    const decoded = jwt_decode(response.credential); // Decode the Google response
    const { sub, name, email, picture } = decoded;

    try {
      const googleLoginData = {
        owner_id: sub,
        name: name,
        email: email,
        profileGoogleImage: picture,
      };

      // Use the useGoogleLoginMutation to perform the Google login
      const res = await googleLogin(googleLoginData).unwrap();
      console.log(res);
      // Dispatch the user credentials to update authentication status
      dispatch(setOwnerCredentials({ ...res }));

      // Redirect to the desired route
      navigate("/owner");
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      // Handle the error, show a toast, etc.
    }
  };

  return (
    <div className="logdiv">
      <div>
        <form className="form1" onSubmit={submitHandler}>
          <h1> Owner LogIn</h1>

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

          <div>
            {isLoading && <Loader />}
            <Button variant="primary" type="submit">
              sign in
            </Button>
          </div>
          <div>
            New Owner ? <Link to="/owner/register">Register</Link>
          </div>
        </form>
        <div
          className="googleAuth"
          style={{ marginTop: "4rem", marginLeft: "5rem", width: "50rem" }}
        >
          <div style={{ marginLeft: "36rem" }}>
            <GoogleLogin
              onSuccess={handleGoogleSignInSuccess}
              onError={() => console.log("error")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
