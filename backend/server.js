import path from "path";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware


const corsOptions = {
  origin: ["https://spexcart.online"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// dirname configuration
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
console.log("gooo", __filename);
const __dirname = dirname(__filename);
//middlewares
console.log(__dirname, "dfjv");
app.use("/Images", express.static(__dirname + "/public/Images"));

// MongoDB Connection (adjust the URI)
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/yourdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust the origin to match your frontend URL
    methods: ["GET", "POST"],
  },
});

// Socket.io
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("sendMessage", (data) => {
    try {
      // Handle the 'sendMessage' event here
      console.log("Received message:", data);
      // Broadcast the message
      io.emit("newMessage", data);
    } catch (error) {
      console.error("Error handling sendMessage:", error);
    }
  });

  // Handle other events as needed

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Routes

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const newPath = path.join(__dirname, "..");
  app.use(express.static(path.join(newPath, "frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(newPath, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("Server is ready"));
}

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
