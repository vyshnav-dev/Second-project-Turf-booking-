import express from "express";

import multer from "multer";

import path from "path";

const router = express.Router();
import {
  authUser,
  googleAuth,
  registerUser,
  logoutUser,
  updateUserProfile,
  getUserProfile,
  verifyOTP,
  resendOtp,
  checkAuth,
  getUserStatus,
  userTurfData,
  userTurfDetails,
  bookingDetails,
  bookHistory,
  chat,
  getChatsUser,
  searchTurfname,
  userLandData,
  payment,
  getUniqueLocations,
  filterTurfByLocation,
  bookingCancel,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { verify } from "crypto";

router.post("/register", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.post("/otp", verifyOTP);
router.get("/resendOtp", protect, resendOtp);
router.post("/googlelogin", googleAuth);
// router.get('/userinfo',userDatainfo)
router.get("/checkAuth", checkAuth);

router.get("/status/:Id", getUserStatus);

router.get("/turf-data", userTurfData);

router.get("/land-data", userLandData);

router.get("/turf-details/:id", userTurfDetails);

router.post("/booking", bookingDetails);

router.get("/bookhistory/:id", bookHistory);

router.post("/sendedMsg", chat);

router.get("/getChats", getChatsUser);

router.get('/search',searchTurfname)

router.post('/payment', payment)

router.get('/defaultlocation',getUniqueLocations)

router.get('/defaultfilter',filterTurfByLocation)

router.post('/cancel/:id',bookingCancel)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("file"), updateUserProfile);

export default router;
