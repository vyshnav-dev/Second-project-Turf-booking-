import { Routes, Route } from "react-router-dom";

import AdLoginScreen from "../pages/adminScreens/AdLoginScreen.jsx";
import AdHomeScreen from "../pages/adminScreens/AdHomeScreen.jsx";
import AdPrivateRoute from "../components/AdPrivateRouter.jsx";
import AdOwnerScreen from "../pages/adminScreens/AdOwnerScreen.jsx";
import AdRegister from "../pages/adminScreens/AdRegister.jsx";
import AdTurf from "../pages/adminScreens/AdTurf.jsx";
import Adbooking from "../pages/adminScreens/Adbooking.jsx";
import Dashbord from "../pages/adminScreens/Dashbord.jsx";

const AdminRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AdLoginScreen />} />
        <Route path="/register" element={<AdRegister />} />

        <Route path="/dashbord" element={<Dashbord />} />

        <Route path="" element={<AdPrivateRoute />}>
          <Route path="/user" element={<AdHomeScreen />} />
          <Route path="/owner" element={<AdOwnerScreen />} />
          <Route path="/turf" element={<AdTurf />} />
          <Route path="/booking" element={<Adbooking />} />
        </Route>
      </Routes>
    </>
  );
};

export default AdminRouter;
