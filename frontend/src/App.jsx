import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
// import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminHeader from "./components/AdminHeader";
import OwnerHeader from "./components/OwnerHeader";
import "./App.css";
import axios from "axios";
// import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isOwnerpage = location.pathname.startsWith("/owner");

  axios.defaults.baseURL = "https://spexcart.online/api";
  axios.defaults.withCredentials = true;
  return (
    <>
      {isAdminPage ? (
        <AdminHeader />
      ) : isOwnerpage ? (
        <OwnerHeader />
      ) : (
        <Header />
      )}
      {/* {isOwnerpage ? <OwnerHeader/> : null} */}
      <ToastContainer />

      <Outlet />
    </>
  );
};

export default App;
