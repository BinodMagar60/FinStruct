const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); 
const app = express();


const servers = ["http://localhost:5173","http://localhost:5174","http://localhost:5175"]


app.use(express.json());
app.use(cors({
  origin: servers,
  credentials:true
}));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
    res.send("API is running...");
});


const authRoutes = require("./Routes/LoginSignupRoutes");
const AdminRoutes = require('./Routes/Routes')
const ProjectRoutes = require('./Routes/ProjectRoutes')
const UserActivity = require('./Routes/UserActivityRoutes')
const Dashboard = require('./Routes/DashboardRoute')
app.use("/auth", authRoutes);
app.use('/admin/user', AdminRoutes)
app.use('/projects', ProjectRoutes)
app.use('/useractivity', UserActivity)
app.use('/dashbaord', Dashboard)



const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));








