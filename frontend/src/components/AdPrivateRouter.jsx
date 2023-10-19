import { useNavigate, Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { useLogoutMutation } from "../adminSlices/adminApiSlice";
import { logout } from "../adminSlices/adminSlice";
// import axios from 'axios';

const AdPrivateRoute = () => {
  const { adminInfo } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(
          "https://spexcart.online/api/admin/checkAdmin",
          {
            credentials: "include", // Include cookies in the request
          }
        );
        if (!response.ok) {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Check auth error:", error);
      }
    };

    if (adminInfo) {
      checkAdmin();
    }
  }, [adminInfo, dispatch, logoutApiCall, navigate]);

  return adminInfo ? <Outlet /> : <Navigate to="/admin/login" replace />;
};
export default AdPrivateRoute;
