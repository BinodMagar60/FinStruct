const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

// Connect to MongoDB using the URI from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Routes
const authRoutes = require("./Routes/authRoutes");
app.use("/auth", authRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
