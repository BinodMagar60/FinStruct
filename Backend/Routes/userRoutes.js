const express = require("express");
const router = express.Router();
const User = require("../User/User");

router.post("/add-user", async (req, res) => {
    try {
      console.log("Request body:", req.body); 
  
      const newUser = new User(req.body);
      await newUser.save();
  
      res.status(201).json({ message: "User added successfully" });
    } catch (err) {
      console.error("Error saving user:", err.message);
      res.status(500).json({ error: err.message }); 
    }
  });
  

module.exports = router;


