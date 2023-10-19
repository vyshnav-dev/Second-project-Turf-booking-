import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import axios from "axios";
import { toast } from "react-toastify";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log("priv", userInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    // Fetch user status from the backend
    const fetchUserStatus = async () => {
      try {
        const { data } = await axios.get(`/users/status/${userInfo._id}`);

        if (data.isBlocked) {
          // If user status is true, perform logout and navigate to /landing
          await logoutApiCall().unwrap();
          dispatch(logout());
          toast.error("you are blocked");
          navigate("/login");
        }
      } catch (error) {
        console.error("Fetch user status error:", error);
      }
    };

    if (userInfo) {
      fetchUserStatus();
    }
  }, [userInfo, dispatch, logoutApiCall, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://spexcart.online/api/users/checkAuth",
          {
            credentials: "include", // Include cookies in the request
          }
        );
        console.log("joooo", response);
        if (!response.ok) {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate("/login");
        }
      } catch (error) {
        console.error("Check auth error:", error);
      }
    };

    if (userInfo) {
      checkAuth();
    }
  }, [userInfo, dispatch, logoutApiCall, navigate]);

  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};
export default PrivateRoute;
