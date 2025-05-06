const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); 
const app = express();


const servers = ["http://localhost:5173","http://localhost:5174","http://localhost:5175"]


app.use(express.json());
app.use(cors({
  origin: servers ,
  credentials:true
}));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


app.get("/", (req, res) => {
    res.send("API is running...");
});


const authRoutes = require("./Routes/LoginSignupRoutes");
app.use("/auth", authRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server running on port ${PORT}`));



const AdminRoutes = require('./Routes/Routes')

app.use('/admin/user', AdminRoutes)




