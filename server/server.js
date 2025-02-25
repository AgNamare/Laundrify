import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import authRoutes from "./routes/auth.route.js";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI ;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/v1/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

