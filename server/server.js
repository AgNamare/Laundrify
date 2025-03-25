import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import authRoutes from "./routes/auth.route.js";
import laundromatRoutes from "./routes/laundromat.route.js";
import clothesRoutes from "./routes/clothesType.route.js";
import errorHandler from "./middlewares/error.middleware.js";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/laundromats", laundromatRoutes);
app.use("/api/v1/clothes-types", clothesRoutes);

app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
