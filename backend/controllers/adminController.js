import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

import adgenerateToken from "../utils/adgenerateToken.js";

import User from "../models/userModel.js";

import Owner from "../models/ownerModel.js";

import Turf from "../models/turfModel.js";

import Booking from "../models/bookingModel.js";

import PDFDocument from 'pdfkit';

import fs from 'fs';
// -----login controller-----//
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    adgenerateToken(res, admin._id);
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ----- register controller-----//
const registerAdmin = asyncHandler(async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  //if password is good
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error("Password must contain 6 characters");
  }

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    confirmPassword,
  });

  if (admin) {
    adgenerateToken(res, admin._id);
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
  res.status(200).json({ message: "Register User" });
});

// -----logout controller-----//

const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("Adjwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Admin Logged out" });
});

// -----user data controller-----//
const userData = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query or default to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size from the query or default to 10
    const searchQuery = req.query.search || ''; // Get the search query from the query parameters

    const options = {
      page,
      limit: pageSize,
      select: { name: 1, email: 1, _id: 1, isBlocked: 1 },
    };

    // Create a filter object based on the search query
    const filter = {
      $or: [
        { name: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
        { email: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
      ],
    };

    const users = await User.paginate(filter, options);

    res.status(200).json({
      users: users.docs,
      totalCount: users.totalDocs,
      totalPages: users.totalPages,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
});

// Helper function to escape special characters in a search query for regex
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// ----- userblock controller-----//

const userBlock = asyncHandler(async (req, res) => {
  try {
    const userId = req.query.id;
    const users = await User.updateOne(
      { _id: userId },
      { $set: { isBlocked: true } }
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error blocking users:", error);
    throw error;
  }
});

// ----- user unblock controller-----//
const userUnBlock = asyncHandler(async (req, res) => {
  try {
    const userId = req.query.id;
    const users = await User.updateOne(
      { _id: userId },
      { $set: { isBlocked: false } }
    );
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error unblocking users:", error);
    throw error;
  }
});

// -----owner data controller-----//

const ownerData = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query or default to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Get the page size from the query or default to 10
    const searchQuery = req.query.search || ''; // Get the search query from the query parameters

    const options = {
      page,
      limit: pageSize,
      select: { name: 1, email: 1, _id: 1, isBlocked: 1 },
    };

    // Create a filter object based on the search query
    const filter = {
      $or: [
        { name: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
        { email: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
      ],
    };

    const owners = await Owner.paginate(filter, options);

    res.status(200).json({
      owners: owners.docs,
      totalCount: owners.totalDocs,
      totalPages: owners.totalPages,
    });
  } catch (error) {
    console.error('Error fetching owners:', error);
    throw error;
  }
});




// -----owner block controller-----//

const ownerBlock = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.query.id;

    const owners = await Owner.updateOne(
      { _id: ownerId },
      { $set: { isBlocked: true } }
    );
    res.status(200).json({ owners });
  } catch (error) {
    console.error("Error blocking owners:", error);
    throw error;
  }
});

// -----owner unblock controller-----//

const ownerUnBlock = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.query.id;
    const owners = await Owner.updateOne(
      { _id: ownerId },
      { $set: { isBlocked: false } }
    );
    res.status(200).json({ owners });
  } catch (error) {
    console.error("Error unblocking owners:", error);
    throw error;
  }
});

// -----admin jwt check controller-----//
const checkAdmin = asyncHandler(async (req, res) => {
  const token = req.cookies.Adjwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ message: "Authorized" });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

// -----turf details controller-----//

const turfData = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 2;
    const searchQuery = req.query.search || ''; // Get the search query from the query parameters

    const skip = (page - 1) * pageSize;

    const filter = {
      // Create a filter object to match your search criteria
      $or: [
        { turfname: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
        { ownername: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
      ],
    };

    const turf = await Turf.find(filter, {
      turfname: 1,
      time: 1,
      _id: 1,
      game: 1,
      location: 1,
      imagePath: 1,
      description: 1,
      isAprooved: 1,
      ownername: 1,
      number: 1,
      isRejected: 1,
    })
      .skip(skip)
      .limit(pageSize);

    const totalCount = await Turf.countDocuments(filter);

    res.status(200).json({ turf, totalCount });
  } catch (error) {
    console.error('Error fetching turf details:', error);
    throw error;
  }
});

// -----turf confirming controller-----//

const confirmTurf = asyncHandler(async (req, res) => {
  try {
    const Id = req.params.id;

    const result = await Turf.updateOne(
      { _id: Id },
      { $set: { isAprooved: true } }
    );

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error confirming ", error);
    throw error;
  }
});

// -----turf reject controller-----//

const rejectTurf = asyncHandler(async (req, res) => {
  try {
    const Id = req.params.id;
    console.log(Id);
    const result = await Turf.updateOne(
      { _id: Id },
      { $set: { isRejected: true } }
    );

    res.status(200).json({ result });
  } catch (error) {
    console.error("Error confirming ", error);
    throw error;
  }
});

// -----booking data controller-----//
const bookingData = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || ''; // Get the search query from the query parameters

    const skip = (page - 1) * limit;

    // Create a filter object to match your search criteria
    const filter = {
      $or: [
        { username: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
        { phoneNumber: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
        { turfname: { $regex: new RegExp(escapeRegex(searchQuery), 'i') } },
      ],
    };

    const turf = await Booking.find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await Booking.countDocuments(filter);

    res.status(200).json({ turf, totalCount });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
});

// -----all details count controller-----//

const countData = asyncHandler(async (req, res) => {
  console.log('kittumoo');
  try {
    const userCount = await User.countDocuments();
    const ownerCount = await Owner.countDocuments();
    const turfCount = await Turf.countDocuments();
    const bookingCount = await Booking.countDocuments();

    res.status(200).json({
      userCount,
      ownerCount,
      turfCount,
      bookingCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    throw error;
  }
});


// In your backend controller, add a new route to fetch monthly booking data
const fetchMonthlyBookings = asyncHandler(async (req, res) => {
  try {
    // Fetch and aggregate monthly booking data from your database
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: { month: { $month: "$selectedDate" }, year: { $year: "$selectedDate" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    

    res.status(200).json(monthlyBookings);
  } catch (error) {
    console.error("Error fetching monthly bookings:", error);
    throw error;
  }
});

// ----- controller-----//

const generatePDFReport = asyncHandler(async (req, res) => {
  try {
    // Example: Calculate weekly counts for the last 7 days
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 7);

    const weeklyUserCount = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const weeklyOwnerCount = await Owner.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const weeklyTurfCount = await Turf.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const weeklyBookingCount = await Booking.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Example: Calculate monthly counts for the last 30 days
    const monthlyStartDate = new Date();
    monthlyStartDate.setDate(monthlyStartDate.getDate() - 30);

    const monthlyUserCount = await User.countDocuments({
      createdAt: { $gte: monthlyStartDate, $lte: endDate },
    });

    const monthlyOwnerCount = await Owner.countDocuments({
      createdAt: { $gte: monthlyStartDate, $lte: endDate },
    });

    const monthlyTurfCount = await Turf.countDocuments({
      createdAt: { $gte: monthlyStartDate, $lte: endDate },
    });

    const monthlyBookingCount = await Booking.countDocuments({
      createdAt: { $gte: monthlyStartDate, $lte: endDate },
    });

    // Example: Calculate yearly counts for the last 365 days
    const yearlyStartDate = new Date();
    yearlyStartDate.setDate(yearlyStartDate.getDate() - 365);

    const yearlyUserCount = await User.countDocuments({
      createdAt: { $gte: yearlyStartDate, $lte: endDate },
    });

    const yearlyOwnerCount = await Owner.countDocuments({
      createdAt: { $gte: yearlyStartDate, $lte: endDate },
    });

    const yearlyTurfCount = await Turf.countDocuments({
      createdAt: { $gte: yearlyStartDate, $lte: endDate },
    });

    const yearlyBookingCount = await Booking.countDocuments({
      createdAt: { $gte: yearlyStartDate, $lte: endDate },
    });

    // Calculate total counts
    const totalUserCount = weeklyUserCount + monthlyUserCount + yearlyUserCount;
    const totalOwnerCount = weeklyOwnerCount + monthlyOwnerCount + yearlyOwnerCount;
    const totalTurfCount = weeklyTurfCount + monthlyTurfCount + yearlyTurfCount;
    const totalBookingCount = weeklyBookingCount + monthlyBookingCount + yearlyBookingCount;

    // Create a PDF document using pdfkit

    // Create a PDF document using pdfkit
    const doc = new PDFDocument();

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF document
    doc.fontSize(18).text('GREEN GLIDE Report', { align: 'center' });

    // Define the table headers
    const tableHeaders = ['Category', 'Weekly', 'Monthly', 'Yearly', 'Total'];

    // Define the table data
    const tableData = [
      ['Users', weeklyUserCount, monthlyUserCount, yearlyUserCount, totalUserCount],
      ['Owners', weeklyOwnerCount, monthlyOwnerCount, yearlyOwnerCount, totalOwnerCount],
      ['Turfs', weeklyTurfCount, monthlyTurfCount, yearlyTurfCount, totalTurfCount],
      ['Bookings', weeklyBookingCount, monthlyBookingCount, yearlyBookingCount, totalBookingCount],
    ];

    // Define table column widths
    const columnWidths = [150, 80, 80, 80, 80];

    // Set initial position for the table
    const initialX = 50;
    let currentX = initialX;
    let currentY = 150;

    // Draw table headers
    doc.font('Helvetica-Bold');
    for (let i = 0; i < tableHeaders.length; i++) {
      doc.text(tableHeaders[i], currentX, currentY,{ width: columnWidths[i], align: 'center' });
      currentX += columnWidths[i];
    }
    currentY += 30;

    // Draw table data
    doc.font('Helvetica');
    for (const rowData of tableData) {
      currentX = initialX;
      for (let i = 0; i < rowData.length; i++) {
        doc.text(rowData[i].toString(), currentX, currentY,{ width: columnWidths[i], align: 'center' });
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
  authAdmin,
  checkAdmin,
  logoutAdmin,
  userData,
  userBlock,
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
};
