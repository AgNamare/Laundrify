import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import authRoutes from "./routes/auth.route.js";
import laundromatRoutes from "./routes/laundromat.route.js";
import clothesRoutes from "./routes/clothesType.route.js";
import orderRoutes from "./routes/order.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import reviewRoutes from "./routes/review.routes.js";
import cors from "cors";
import mpesaRoutes from './routes/mpesa.routes.js';
import userRoutes from './routes/user.route.js';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI; // process.env.MONGO_URI
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://laundrify-app.onrender.com"], // Allow all origins (change this in production)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/laundromats", laundromatRoutes);
app.use("/api/v1/clothes-types", clothesRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use('/api/v1/mpesa', mpesaRoutes);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
