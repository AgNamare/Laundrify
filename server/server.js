app.use(
  cors({
    origin: ["http://localhost:5173", "https://app-laundrify.onrender.com/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
