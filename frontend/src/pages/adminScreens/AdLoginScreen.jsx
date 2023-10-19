import { useState, useEffect } from "react";

import { Form, Button } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../adminSlices/adminApiSlice";
import { setAdminCredentials } from "../../adminSlices/adminSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

function AdLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { adminInfo } = useSelector((state) => state.admin);
  console.log(adminInfo);

  useEffect(() => {
    if (adminInfo) {
      navigate("/admin/dashbord");
    }
  }, [navigate, adminInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setAdminCredentials({ ...res }));
      navigate("/admin/dashbord");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <FormContainer>
      <h1>Admin Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {isLoading && <Loader />}

        <Button type="submit" variant="primary" className="mt-3">
          Sign In
        </Button>
      </Form>
    </FormContainer>
  );
}

export default AdLoginScreen;
