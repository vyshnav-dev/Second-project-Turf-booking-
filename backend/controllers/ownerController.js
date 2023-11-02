import asyncHandler from "express-async-handler";

import Owner from "../models/ownerModel.js";

import Turf from "../models/turfModel.js";

import Booking from "../models/bookingModel.js";

import Room from "../models/roomModel.js";

import Chat from "../models/chatModel.js";

import mongoose from "mongoose";

import PDFDocument from 'pdfkit';

import fs from 'fs';

// import generateToken from "../utils/generateToken.js";

import owgenerateToken from "../utils/owgenerateToken.js";

import jwt from "jsonwebtoken";

import nodemailer from "nodemailer";

// -----owner login controller-----//

const authOwner = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const owner = await Owner.findOne({ email });

  if (!owner.verified) {
    res.status(401);
    throw new Error("Your account is not verified");
  }
  if (owner.isBlocked == true) {
    res.status(401);
    throw new Error("Your account is  blocked");
  }

  if (owner && (await owner.matchPassword(password))) {
    owgenerateToken(res, owner._id);
    res.status(201).json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      phone: owner.phone,
      image: owner.imagePath,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// -----verify otp controller-----//
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Find the user by email
  const owner = await Owner.findOne({ email: email });

  if (!owner) {
    return res.status(400).json({ message: "Owner not found" });
  }

  // Compare theowner's stored OTP with the provided OTP
  if (owner.otp === otp) {
    owner.verified = true;
    await owner.save();

    // generateToken(res,owner._id);

    res.status(201).json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      verified: owner.verified,
      profileImage: owner.profileImage,
      status: owner.status,
    });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// ----resend otp -----//
const resendOtp = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.owner._id; // Assuming you have access to theowner ID from the authenticated session

    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Generate a new OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000);

    // Update the user's OTP in the database
    owner.otp = newOtp;
    await owner.save();

    // Send the new OTP to the owner's email
    await sendOTPByEmail(owner.email, newOtp);

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error while resending OTP:", error);
    res.status(500).json({ message: "An error occurred while resending OTP" });
  }
});
// ----------------------------------//
const sendOTPByEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.GENARATE_ETHREAL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

//^----------------GOOGLE-AUTH-----------------------------------------

const googleAuth = asyncHandler(async (req, res) => {
  const { name, email, profileGoogleImage } = req.body; // Assuming these fields are part of the user object from Google Sign-In
  console.log(name, email, profileGoogleImage);
  // Check if the user already exists
  let owner = await Owner.findOne({ email });

  if (owner) {
    if (owner.status) {
      res.status(401);
      throw new Error("Your account is temporarily blocked");
    }
    if (!owner.verified) {
      res.status(401);
      throw new Error("Your account is not verified");
    }

    // owner exists, generate token and send success response
    owgenerateToken(res, owner._id);
    res.status(200).json({
      _id: owner._id,
      name: owner.name,
      email: owner.email,
      profileImage: owner.profileImage,
      profileGoogleImage: owner.profileGoogleImage,
      status: owner.status,
    });
  } else {
    // User doesn't exist, create a new user
    owner = await Owner.create({
      name,
      email,
      profileGoogleImage,
      verified: true,
    });

    if (owner) {
      owgenerateToken(res, owner._id);
      res.status(201).json({
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        profileGoogleImage: owner.profileGoogleImage,
      });
    } else {
      res.status(400);
      throw new Error("Invalid owner data");
    }
  }
});

//^--------------------------------------------------------------------

// Register a new user
const registerOwner = asyncHandler(async (req, res) => {
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const confirmPassword = req.body.confirmPassword.trim();
  const phone = req.body.phone.trim();
  //if password is good
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must contain 6 characters");
  }
  if (!phone || phone.length < 10) {
    res.status(400);
    throw new Error("it must contain 10 numbers");
  }

  const ownerExists = await Owner.findOne({ email: email });

  if (ownerExists) {
    res.status(400);
    throw new Error("owner already exists");
  }

  // Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Send OTP to owner's email
  await sendOTPByEmail(email, otp);

  const owner = await Owner.create({
    name,
    email,
    phone,
    password,
    confirmPassword,
    otp,
  });

  if (owner) {
    owgenerateToken(res, owner._id);
    res.status(201).json({
      id: owner._id,
      name: owner.name,
      email: owner.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid owner data");
  }
  res.status(200).json({ message: "Register owner" });
});


// ----- logout controller-----//
const logoutOwner = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Owner Logged out" });
});


// -----profile controller-----//
const getOwnerProfile = asyncHandler(async (req, res) => {
  const owner = {
    _id: req.owner._id,
    name: req.owner.name,
    email: req.owner.email,
  };

  res.status(200).json({ message: "Owner profile" });
});

// -----update profile controller-----//
const updateOwnerProfile = asyncHandler(async (req, res) => {
  const owner = await Owner.findById(req.owner._id);

  if (owner) {
    owner.name = req.body.name || owner.name;
    owner.email = req.body.email || owner.email;
    if (req.file) {
      owner.imagePath = req.file.filename || owner.imagePath;
    }

    if (req.body.password) {
      owner.password = req.body.password;
    }

    const updateOwner = await owner.save();

    res.status(200).json({
      _id: updateOwner._id,
      name: updateOwner.name,
      email: updateOwner.email,
      image: updateOwner.imagePath,
      verified:updateOwner.verified,
    });
  } else {
    res.status(404);
    throw new Error("Owner not found");
  }
});

// -----jwt authentication controller-----//

const checkOwner = asyncHandler(async (req, res) => {
  const token = req.cookies.owjwt;
   
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json();
  } catch (error) {
    return res.status(401).json();
  }
});

// -----owner block check controller-----//

const getOwnerStatus = asyncHandler(async (req, res) => {
  const ownerId = req.params.Id; // Get user ID from the route parameter
  const owner = await Owner.findById(ownerId);

  if (owner) {
    res.status(200).json({ isBlocked: owner.isBlocked }); // Send the user's status
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// -----turf details controller-----//

const turfdetails = asyncHandler(async (req, res) => {
  try {
    const {
      turfname,
      time,
      game,
      price,
      address,
      location,
      description,
      ownerId,
      ownername,
      number,
    } = req.body;
    console.log('sjxs',req.files)

    const detail = [];

    for (let i = 0; i < req.files.length; i++) {
      detail.push(req.files[i].filename);
    }

    // Ensure that time is formatted as an array of objects with the 'times' property
    const parsedTime = JSON.parse(time).map((times) => ({ times }));
    // const parsedTime = JSON.parse(time);
    const parsedGame = JSON.parse(game);

    const tdata = await Turf.create({
      turfname,
      time: parsedTime,
      game: parsedGame,
      price,
      address,
      location,
      description,
      ownerId,
      imagePath: detail,
      ownername,
      number,
    });
    const turf = await Turf.find(
      {},
      {
        turfname: 1,
        time: 1,
        _id: 1,
        game: 1,
        price:1,
        address:1,
        location: 1,
        imagePath: 1,
        description: 1,
      }
    );
    res.status(200).json({ turf });
  } catch (error) {
    console.log(error);
  }
});

// -----turf data by id controller-----//
const turfData = asyncHandler(async (req, res) => {
  const Id = req.params.id;
  try {
    const turf = await Turf.find(
      { ownerId: Id },
      {
        turfname: 1,
        time: 1,
        _id: 1,
        game: 1,
        price:1,
        address:1,
        location: 1,
        imagePath: 1,
        description: 1,
        isAprooved: 1,
        isRejected: 1,
      }
    );
    res.status(200).json({ turf });
  } catch (error) {
    console.error("Error fetching turf details:", error);
    throw error;
  }
});

// -----edit turf data controller-----//

const editTurfData = asyncHandler(async (req, res) => {
  try {
    const { turfname, time, game,price,address, location, description, ownerId } = req.body;

    const { id } = req.params; // Assuming you pass the turfId in the URL

    const detail = [];

    for (let i = 0; i < req.files.length; i++) {
      detail.push(req.files[i].filename);
    }

    const parsedTime = JSON.parse(time).map((times) => ({ times }));
    const parsedGame = JSON.parse(game);

    // Find the turf record by its ID
    const turf = await Turf.findById(id);

    // Check if the ownerId matches the user's ID (security check)
    // if (turf.ownerId !== ownerId) {
    //   return res.status(403).json({ message: "You don't have permission to edit this turf." });
    // }

    // Update the turf record with the new data
    turf.turfname = turfname;
    turf.time = parsedTime;
    turf.game = parsedGame;
    turf.ownerId = ownerId;
    turf.price = price;
    turf.address = address;
    turf.location = location;
    turf.description = description;
    turf.imagePath = detail;

    await turf.save();

    // Send back the updated turf record or a success message
    res.status(200).json({ message: "Turf updated successfully", turf });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -----booking list controller-----//

const bookingList = asyncHandler(async (req, res) => {
  const ownerId = req.params.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const searchQuery = req.query.search; // Get the search query from the query parameters

  try {
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 2),
    };

    const filter = { ownerId };

    if (searchQuery) {
      // If a search query is provided, add conditions to filter the results
      const searchRegex = new RegExp(escapeRegex(searchQuery), 'i'); // Case-insensitive search
      filter.$or = [
        { username: searchRegex },
        { phoneNumber: searchQuery },
        { selectedGame: searchRegex },
      ];
    }

    const result = await Booking.paginate(filter, options);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching booking list:", error);
    throw error;
  }
});

// Helper function to escape special characters in a search query for regex
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// ----- confirm booking controller-----//

const confirmBooking = asyncHandler(async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id);
    const book = await Booking.updateOne(
      { _id: Id },
      { $set: { isBooked: true } }
    );

    res.status(200).json({ book });
  } catch (error) {
    console.error("Error booking ", error);
    throw error;
  }
});

// -----reject booking controller-----//
const rejectBooking = asyncHandler(async (req, res) => {
  try {
    const Id = req.params.id;

    const book = await Booking.updateOne(
      { _id: Id },
      { $set: { isRejected: true } }
    );

    res.status(200).json({ book });
  } catch (error) {
    console.error("Error booking ", error);
    throw error;
  }
});

// -----------------chat section--------------//

const getChatTurf = async (req, res) => {
  try {
    const turfId = req.query.tId;
    console.log('qwert',turfId);
    const rooms = await Room.find({ turfID: turfId });
      console.log('uuuu',rooms);
    if (rooms.length) {
      return res.json(rooms);
    } else {
      return res.json([]);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getDualChat = async (req, res) => {
  try {
    const roomId = req.query.roomId;
    const chats = await Chat.find({ roomID: roomId });

    if (chats.length) {
      return res.json(chats);
    } else {
      return res.json({ not: null });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addedChatTurf = async (req, res) => {
  try {
    const { message, roomId, userId, tId, sender } = req.body;
    const result = await Chat.create({
      roomID: roomId,
      turfID: tId,
      userID: userId,
      message: message,
      sender: sender,
    });

    // Emit the new message to all connected clients in the room (if using Socket.io)
    // io.to(roomId).emit('newMessage', result);

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// -----time hiding controller-----//
  const hideTime = async (req, res) => {

    console.log('kitty');
  try {
    const { venueId, timeId } = req.params;

    // Find the venue by ID
    const venue = await Turf.findById(venueId);

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Find the specific time to update
    const timeToHide = venue.time.find((time) => time._id == timeId);

    if (!timeToHide) {
      return res.status(404).json({ message: 'Time not found' });
    }

    // Update the ishide property to true
    timeToHide.ishide = true;

    // Save the updated venue
    await venue.save();

    res.status(200).json({ message: 'Time hidden successfully' });
  } catch (error) {
    console.error('Error hiding time:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ----- time unhide controller-----//

const unHideTime = async (req, res) => {

  
try {
  const { venueId, timeId } = req.params;

  // Find the venue by ID
  const venue = await Turf.findById(venueId);

  if (!venue) {
    return res.status(404).json({ message: 'Venue not found' });
  }

  // Find the specific time to update
  const timeToHide = venue.time.find((time) => time._id == timeId);

  if (!timeToHide) {
    return res.status(404).json({ message: 'Time not found' });
  }

  // Update the ishide property to true
  timeToHide.ishide = false;

  // Save the updated venue
  await venue.save();

  res.status(200).json({ message: 'Time unhidden successfully' });
} catch (error) {
  console.error('Error unhiding time:', error);
  res.status(500).json({ message: 'Internal server error' });
}
};



// -----owner count controller-----//

const ownerCountData = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    // Count unique users based on ownerId
    const userCount = await Booking.distinct("userId", { ownerId });
    console.log('gddf',userCount);

    // Count bookings and turfs based on ownerId
    const bookingCount = await Booking.countDocuments({ ownerId });
    const turfCount = await Turf.countDocuments({ ownerId });

    console.log('edsf',bookingCount);
    console.log('ncnv',turfCount);

    res.status(200).json({
      userCount: userCount.length,
      bookingCount,
      turfCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    throw error;
  }
});

// -----ownerMonthlyBookings controller-----//

const ownerMonthlyBookings = asyncHandler(async (req, res) => {
  try {
    // Fetch and aggregate monthly booking data from your database
    const ownerId = req.params.ownerId; // Assuming ownerId is provided in the format "650555d48fa4b88f2efc4a90"

    
    const ownerIdObject = new mongoose.Types.ObjectId(ownerId);


    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          ownerId: ownerIdObject, // Use ownerId as an ObjectId for matching
        },
      },
      {
        $group: {
          _id: {
            ownerId: "$ownerId",
            month: { $month: "$selectedDate" },
            year: { $year: "$selectedDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    console.log('hdhbc',monthlyBookings);

    res.status(200).json(monthlyBookings);
  } catch (error) {
    console.error("Error fetching monthly bookings:", error);
    throw error;
  }
});



// -----report controller-----//

const ownerGeneratePDFReport = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.ownerId;
    const owner = await Owner.findById(ownerId);

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Example: Calculate weekly counts for the last 7 days
    const endDate = new Date();
    const startDateWeekly = new Date(endDate);
    startDateWeekly.setDate(endDate.getDate() - 7);
    const startDateMonthly = new Date(endDate);
    startDateMonthly.setDate(endDate.getDate() - 30);
    const startDateYearly = new Date(endDate);
    startDateYearly.setDate(endDate.getDate() - 365);

    // Calculate user counts for weekly, monthly, and yearly periods
    const weeklyUserCount = await Booking.distinct("userId", {
      ownerId,
      createdAt: { $gte: startDateWeekly, $lte: endDate },
    });

    const monthlyUserCount = await Booking.distinct("userId", {
      ownerId,
      createdAt: { $gte: startDateMonthly, $lte: endDate },
    });

    const yearlyUserCount = await Booking.distinct("userId", {
      ownerId,
      createdAt: { $gte: startDateYearly, $lte: endDate },
    });

    // Calculate booking counts for weekly, monthly, and yearly periods
    const weeklyBookingCount = await Booking.countDocuments({
      ownerId,
      createdAt: { $gte: startDateWeekly, $lte: endDate },
    });

    const monthlyBookingCount = await Booking.countDocuments({
      ownerId,
      createdAt: { $gte: startDateMonthly, $lte: endDate },
    });

    const yearlyBookingCount = await Booking.countDocuments({
      ownerId,
      createdAt: { $gte: startDateYearly, $lte: endDate },
    });

    // Calculate turf counts for weekly, monthly, and yearly periods
    const weeklyTurfCount = await Turf.countDocuments({
      ownerId,
      createdAt: { $gte: startDateWeekly, $lte: endDate },
    });

    const monthlyTurfCount = await Turf.countDocuments({
      ownerId,
      createdAt: { $gte: startDateMonthly, $lte: endDate },
    });

    const yearlyTurfCount = await Turf.countDocuments({
      ownerId,
      createdAt: { $gte: startDateYearly, $lte: endDate },
    });

    // Calculate total user, turf, and booking counts
    const totalUserCount = weeklyUserCount.length + monthlyUserCount.length + yearlyUserCount.length;
    const totalBookingCount = weeklyBookingCount + monthlyBookingCount + yearlyBookingCount;
    const totalTurfCount = weeklyTurfCount + monthlyTurfCount + yearlyTurfCount;

    // Create a PDF document using pdfkit
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report_${ownerId}.pdf"`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF document
    doc.fontSize(18).text(`GREEN GLIDE: ${owner.name}`, { align: 'center' });

    // Define table headers
    const headers = ['Period', 'User ', 'Booking ', 'Turf ', 'Total'];

    // Define table data
    const tableData = [
      ['Weekly', weeklyUserCount.length, weeklyBookingCount, weeklyTurfCount, totalUserCount],
      ['Monthly', monthlyUserCount.length, monthlyBookingCount, monthlyTurfCount, totalBookingCount], // Total left blank
      ['Yearly', yearlyUserCount.length, yearlyBookingCount, yearlyTurfCount, totalTurfCount], // Total left blank
    ];

    // Define table column widths
    const columnWidths = [150, 100, 100, 100, 100];

    // Set initial position for the table
    const initialX = 30;
    let currentX = initialX;
    let currentY = 150;

    // Draw table headers
    doc.font('Helvetica-Bold');
    for (let i = 0; i < headers.length; i++) {
      doc.text(headers[i], currentX, currentY, { width: columnWidths[i], align: 'center' });
      currentX += columnWidths[i];
    }
    currentY += 30;

    // Draw table rows
    doc.font('Helvetica');
    for (const rowData of tableData) {
      currentX = initialX;
      for (let i = 0; i < rowData.length; i++) {
        doc.text(rowData[i].toString(), currentX, currentY, { width: columnWidths[i], align: 'center' });
        currentX += columnWidths[i];
      }
      currentY += 40;
    }

    // End the PDF document
    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ error: 'Error generating PDF report' });
  }
});








export {
  authOwner,
  googleAuth,
  verifyOTP,
  sendOTPByEmail,
  resendOtp,
  registerOwner,
  logoutOwner,
  turfdetails,
  turfData,
  getOwnerProfile,
  updateOwnerProfile,
  editTurfData,
  checkOwner,
  getOwnerStatus,
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
  ownerGeneratePDFReport
};
