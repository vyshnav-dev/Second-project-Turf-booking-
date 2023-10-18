import express from "express";

const router = express.Router();
import {
  authAdmin,
  logoutAdmin,
  userData,
  userBlock,
  checkAdmin,
  userUnBlock,
  ownerData,
  ownerBlock,
  ownerUnBlock,
  registerAdmin,
  turfData,
  confirmTurf,
  rejectTurf,
  bookingData,
  countData,
  fetchMonthlyBookings,
  generatePDFReport,
} from "../controllers/adminController.js";
import { protect } from "../middleware/adminMiddleware.js";

router.post("/admin", authAdmin);
router.post("/adminregister", registerAdmin);

router.post("/logout", logoutAdmin);
// router.get('/user',adprotect,userData)
router.get("/user", protect, userData);
router.post("/blockuser", userBlock);
router.post("/unblockuser", userUnBlock);

router.get("/adminowner", ownerData);
router.post("/blockowner", ownerBlock);
router.post("/unblockowner", ownerUnBlock);
router.get("/checkAdmin", checkAdmin);

router.get("/turf", turfData);

router.get("/booking", bookingData);

router.post("/confirm/:id", confirmTurf);

router.post("/reject/:id", rejectTurf);

router.get('/dashbord',countData)

router.get('/fetchMonthlyBookings',fetchMonthlyBookings)

router.get('/generatePDFReport',generatePDFReport)

export default router;
