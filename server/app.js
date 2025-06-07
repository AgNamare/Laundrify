import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://ecom-frontend-7ymd.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Express Server! 🚀");
});

export default app;
