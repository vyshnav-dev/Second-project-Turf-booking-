import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLogoutMutation } from "../ownerSlice/ownerApiSlice";
import { logout } from "../ownerSlice/ownerSlice";
import axios from "axios";
const OwnerPrivateRoute = () => {
  const { ownerInfo } = useSelector((state) => state.owner);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    // Fetch user status from the backend
    const fetchUserStatus = async () => {
      try {
        const { data } = await axios.get(`/owner/status/${ownerInfo._id}`);

        if (data.isBlocked) {
          // If user status is true, perform logout and navigate to /landing
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate("/owner/login");
        }
      } catch (error) {
        console.error("Fetch user status error:", error);
      }
    };

    if (ownerInfo) {
      fetchUserStatus();
    }
  }, [ownerInfo, dispatch, logoutApiCall, navigate]);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/owner/checkOwner",
          {
            credentials: "include", // Include cookies in the request
          }
        );
        console.log("joooo", response);
        if (!response.ok) {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate("/owner/login");
        }
      } catch (error) {
        console.error("Check auth error:", error);
      }
    };

    if (ownerInfo) {
      checkOwner();
    }
  }, [ownerInfo, dispatch, logoutApiCall, navigate]);

  return ownerInfo ? <Outlet /> : <Navigate to="/owner/login" replace />;
};
export default OwnerPrivateRoute;
