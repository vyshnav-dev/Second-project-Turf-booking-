import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";

import Turf from "../models/turfModel.js";

import Room from "../models/roomModel.js";

import Chat from "../models/chatModel.js";

import generateToken from "../utils/generateToken.js";

import nodemailer from "nodemailer";

import Booking from "../models/bookingModel.js";

import jwt from "jsonwebtoken";

import { Stripe } from "stripe";

import dotenv from 'dotenv';

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user.verified) {
    res.status(401);
    throw new Error("Your account is not verified");
  }
  if (user.isBlocked == true) {
    res.status(401);
    throw new Error("Your account is  blocked");
  }

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone:user.phone,
      image: user.imagePath,
      isBlocked: user.isBlocked,
      verified: user.verified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Find the user by email
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Compare the user's stored OTP with the provided OTP
  if (user.otp === otp) {
    user.verified = true;
    await user.save();

    // generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      profileImage: user.profileImage,
      status: user.status,
    });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});

// ----resend otp -----//
const resendOtp = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have access to the user ID from the authenticated session

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new OTP
    const newOtp = Math.floor(1000 + Math.random() * 9000);

    // Update the user's OTP in the database
    user.otp = newOtp;
    await user.save();

    // Send the new OTP to the user's email
    await sendOTPByEmail(user.email, newOtp);

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

  // Check if the user already exists
  let user = await User.findOne({ email });

  if (user) {
    if (user.status) {
      res.status(401);
      throw new Error("Your account is temporarily blocked");
    }
    if (!user.verified) {
      res.status(401);
      throw new Error("Your account is not verified");
    }

    // User exists, generate token and send success response
    generateToken(res, user._id);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      profileGoogleImage: user.profileGoogleImage,
      status: user.status,
      verified:user.verified
    });
  } else {
    // User doesn't exist, create a new user
    user = await User.create({
      name,
      email,
      profileGoogleImage,
      verified: true,
    });
    console.log("uuuuu" + user);
    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileGoogleImage: user.profileGoogleImage,
        verified:user.verified
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
});

//^--------------------------------------------------------------------

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const phone = req.body.phone.trim();
  const password = req.body.password.trim();
  const confirmPassword = req.body.confirmPassword.trim();
  // const {name,email,password,confirmPassword} =req.body
  //if password is good
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must contain 6 characters");
  }
  if (!phone || phone.length < 10) {
    res.status(400);
    throw new Error("number must contain 10 characters");
  }



  const userExists = await User.findOne({ email: email });
 

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Send OTP to user's email
  await sendOTPByEmail(email, otp);

  const user = await User.create({
    name,
    email,
    phone,
    password,
    confirmPassword,
    otp,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone:user.phone,
      verified: user.verified,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  res.status(200).json({ user });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User Logged out" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };

  res.status(200).json({ message: "User profile" });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(req.file);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.file) {
      user.imagePath = req.file.filename || user.imagePath;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      image: updateUser.imagePath,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;

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

const getUserStatus = asyncHandler(async (req, res) => {
  const userId = req.params.Id; // Get user ID from the route parameter
  const user = await User.findById(userId);

  if (user) {
    res.status(200).json({ isBlocked: user.isBlocked }); // Send the user's status
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const userTurfData = asyncHandler(async (req, res) => {
  const { page, limit, filter } = req.query;

  try {
    const options = {
      page: parseInt(page, 10) || 1, // Current page number, default to 1
      limit: parseInt(limit, 4) || 4, // Number of items per page, default to 10
    };

    // Define the filter criteria based on the 'filter' parameter
    // const filterCriteria = filter === 'All' ? { isAprooved: true } : { isAprooved: true, 'game': filter };

    const filterCriteria =
    filter === 'All'
      ? { isAprooved: true }
      : {
          isAprooved: true,
          game: [filter], // Match exactly one game, 'Cricket' in this case
        };


    const result = await Turf.paginate(
      filterCriteria,
      options
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching turf details:", error);
    throw error;
  }
});


const userTurfDetails = asyncHandler(async (req, res) => {
  const turfId = req.params.id;

  try {
    const turf = await Turf.findById(turfId);

    if (!turf) {
      return res.status(404).json({ error: "Turf not found" });
    }

    res.status(200).json({ turf });
  } catch (error) {
    console.error("Error fetching turf details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const bookingDetails = asyncHandler(async (req, res) => {
  console.log('sdccsdv',req.body);
  try {
    const {
      bookingData
    } = req.body;

    // Check if the selected time slot is already booked
    const existingBooking = await Booking.findOne({
      selectedDate:bookingData.selectedDate,
      selectedTime:bookingData.selectedTime,
      turfId:bookingData.turfId,
    });

    if (existingBooking) {
      // Time slot is already booked, return an error response
      return res.status(201).json({ message: "Time slot is already booked" });
    }

    // Create a new booking and mark the time slot as booked
    await Booking.create({
      selectedDate:bookingData.selectedDate,
      selectedGame:bookingData.selectedGame,
      selectedTime:bookingData.selectedTime,
      username:bookingData.username,
      phoneNumber:bookingData.phoneNumber,
      userId:bookingData.userId,
      turfId:bookingData.turfId,
      ownerId:bookingData.ownerId,
      turfname:bookingData.turfname,
      price:bookingData.price,
    });

    res.status(200).json({ message: "Booking success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Booking failed" });
  }
});

const bookHistory = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 3;
  const searchQuery = req.query.search || ''; // Get the search query from the query parameter

  try {
    const skip = (page - 1) * limit;

    // Build a query to search for bookings that match the search query
    const searchFilter = {
      userId,
      $or: [
        { turfname: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on turfname
        { selectedGame: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on selectedGame
      ],
    };

    console.log('ckncdc',searchFilter);
    

    const list = await Booking.find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

      

    res.status(200).json({ list });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});


// -----------chat section---------------------//

const chat = async (req, res) => {
  const { message, tId, userId, sender, name } = req.body;

  try {
    if (!message.trim()) {
      return res.json({ not: "empty" });
    }
    if (!tId) {
      return res.json({ error: "Server error, please relogin" });
    }
    if (!userId) {
      return res.json({ error: "Server error, please relogin" });
    }

    // Check if a room exists for this user and turf
    const room = await Room.find({ turfID: tId, userID: userId });
    if (room.length) {
      const roomId = room[0]._id;
      const details = await Chat.create({
        roomID: roomId,
        turfID: tId,
        userID: userId,
        message: message,
        sender: sender,
        username: name,
      });

      return res.json(details);
    } else {
      // Create a new room for this user and turf
      const roomDetails = await Room.create({
        turfID: tId,
        userID: userId,
        username: name,
      });
      const thisRoomId = roomDetails._id;
      const chatDetails = await Chat.create({
        roomID: thisRoomId,
        turfID: tId,
        userID: userId,
        message: message,
        sender: sender,
        username: name,
      });

      return res.json(chatDetails);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getChatsUser = async (req, res) => {
  const { tId, userId } = req.query;

  try {
    const result = await Chat.find({ turfID: tId, userID: userId });

    if (result.length) {
      return res.json(result);
    } else {
      return res.json({ not: null });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const searchTurfname = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Please provide a turfname or location to search for.' });
    }

    // Search for users by turfname or location (case-insensitive)
    const data = await Turf.find({
      $or: [
        { turfname: { $regex: new RegExp(searchTerm, 'i') } },
        { location: { $regex: new RegExp(searchTerm, 'i') } },
      ],
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No data found with the provided criteria.' });
    }

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const userLandData = asyncHandler(async (req, res) => {
  console.log("toooo");
  try {
    const turf = await Turf.find(
      {},
      {
        turfname: 1,
        time: 1,
        _id: 1,
        game: 1,
        location: 1,
        imagePath: 1,
        description: 1,
        isAprooved: 1,
      }
    )
    .sort({ createdAt: -1 }) // Sort by 'time' in descending order (latest first)
    .limit(3); // Limit the results to the latest 4 turfs
    
    res.status(200).json({ turf });
  } catch (error) {
    console.error("Error fetching turf details:", error);
    throw error;
  }
});


dotenv.config();


const key = process.env.STRIPE_KEY

const stripe = new Stripe(key); 

const payment = asyncHandler(async(req, res)=>{
  console.log('zzccx',req.body);
    const {price, name,turf} =  req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode: 'payment',
            line_items:[
                {
                price_data:{
                    currency: 'inr',
                product_data: {
                    name: name,
                },
                unit_amount: price * 100,    
                },
                quantity: 1,
            },
        ],
            success_url: 'https://spexcart.online/details/success',
            cancel_url: `https://spexcart.online/details/${turf}`,
        })

        res.json({ id: session.id });
    } catch (error) {
        
    }
})



const getUniqueLocations = async (req, res) => {
  try {
    // Use case-insensitive regex to find unique locations
    const locations = await Turf.distinct('location', { location: { $regex: new RegExp(req.query.location, 'i') } });

    res.json({ locations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const filterTurfByLocation = async (req, res) => {
  

  try {
    const { location } = req.query;

    // Create a query object for filtering
    const query = {};

    // If a location is selected, add it to the query
    if (location) {
      query.location = location;
    }

    // Perform the query to filter turf data
    const filteredTurfData = await Turf.find(query);
    
    res.json({ data: filteredTurfData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const bookingCancel = asyncHandler(async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id);
    const book = await Booking.updateOne(
      { _id: Id },
      { $set: { isCancel: true } }
    );

    res.status(200).json({ book });
  } catch (error) {
    console.error("Error booking ", error);
    throw error;
  }
});

export {
  authUser,
  googleAuth,
  verifyOTP,
  sendOTPByEmail,
  resendOtp,
  registerUser,
  logoutUser,
  updateUserProfile,
  getUserProfile,
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
};
