import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server! 🚀");
});

export default app;
