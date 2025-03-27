import app from "./app.js";
import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import orderRoutes from "./routes/order.routes.js";
import laundromatRoutes from "./routes/laundromat.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
});

app.use("/api/v1/orders", orderRoutes);

app.use("/api/laundromats", laundromatRoutes);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
