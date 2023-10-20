import express from "express";

import multer from "multer";

import path from "path";

const router = express.Router();
import { verify } from "crypto";
import {
  authOwner,
  editTurfData,
  getOwnerProfile,
  googleAuth,
  logoutOwner,
  registerOwner,
  resendOtp,
  turfData,
  turfdetails,
  updateOwnerProfile,
  verifyOTP,
  checkOwner,
  bookingList,
  confirmBooking,
  rejectBooking,
  getChatTurf,
  getDualChat,
  addedChatTurf,
  hideTime,
  unHideTime,
  ownerCountData,
  ownerMonthlyBookings,
  ownerGeneratePDFReport,
  getOwnerStatus,
} from "../controllers/ownerController.js";
import { ownerprotect } from "../middleware/ownerMiddleware.js";

router.post("/ownerregister", registerOwner);
router.post("/ownerlogin", authOwner);
router.post("/ownerlogout", logoutOwner);
router.post("/ownerotp", verifyOTP);
router.get("/ownerresendOtp", ownerprotect, resendOtp);
router.post("/ownergooglelogin", googleAuth);
router.get("/owner/:id", turfData);
router.get("/checkOwner", checkOwner);

router.get("/status/:Id", getOwnerStatus);

router.get("/booklist/:id", bookingList);

router.post("/confirm/:id", confirmBooking);

router.post("/reject/:id", rejectBooking);

router.get("/getChats", getChatTurf);

router.get("/getDualChat", getDualChat);

router.post("/sendedTurfMsg", addedChatTurf);

router.put('/hide-time/:venueId/:timeId', hideTime);

router.put('/unhide-time/:venueId/:timeId', unHideTime);

router.get('/owner-dashbord/:ownerId',ownerCountData)

router.get('/owner-monthlydata/:ownerId',ownerMonthlyBookings)

router.get('/generate-pdf-report/:ownerId',ownerGeneratePDFReport)


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/uploads");
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
  .get(ownerprotect, getOwnerProfile)
  .put(ownerprotect, upload.single("file"), updateOwnerProfile);

router.post("/add-turf", upload.array("file"), turfdetails);

router.put("/edit-turf/:id", upload.array("file"), editTurfData);

export default router;
