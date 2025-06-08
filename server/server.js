import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from 'cookie-parser';
import laundromatRoutes from "./routes/laundromat.route.js";
import clothesRoutes from "./routes/clothesType.route.js";
import orderRoutes from "./routes/order.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import reviewRoutes from "./routes/review.routes.js";
import cors from "cors";
import mpesaRoutes from './routes/mpesa.routes.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";

if (process.env.NODE_ENV === 'production') {
  // Set the static folder to the build folder from React
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Catch-all route to serve the React index.html for all non-API requests
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to the server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://laundrify-app.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    console.log(`🔵 User joined chat room: ${chatId}`);
  });

  socket.on("send_message", (message) => {
    const { chatId } = message;
    socket.to(chatId).emit("receive_message", message);
    console.log(`📩 Message sent to chat ${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Middlewares and Routes
app.use(
  cors({
    origin: ["http://localhost:5173", "https://laundrify-app.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/laundromats", laundromatRoutes);
app.use("/api/v1/clothes-types", clothesRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/mpesa", mpesaRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use(errorHandler);

app.set("io", io); 
// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
