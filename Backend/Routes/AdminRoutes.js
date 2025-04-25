const express = require("express");
const router = express.Router();
const User = require("../User/User");
const Worker = require("../User/worker");
const mongoose = require('mongoose')

//get data for profile of the user logged in

router.get('/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Requested user email:", email);

    const user = await User.findOne({ email }).select('-password -salt');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Server Error' });
  }
});

//update the data for profile of the user logged in
router.put('/profile/:email', async(req, res)=> {
  try{
    const {email} = req.params;
    
    const {username, phoneNumber, personalEmail, location, bio, photo} = req.body

    const updateData = {username, phoneNumber, personalEmail, location, bio, photo}

    const updatedUser = await User.findOneAndUpdate(
      { email },                 
      updateData,
      { new: true }             
    ).select('-password -salt'); 

    if(!updatedUser){
      return res.status(404).json({message: "User not found."})
    }

    res.json({message: "User Updated successfully", user: updatedUser})

  }
  catch (err){
    console.log(err)
    res.status(500).json({message: "server Error"})
  }
})



//add user
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




//add worker
  router.post("/add-worker", async (req, res) => {
      try {
          const newWorker = new Worker(req.body);
          await newWorker.save();
          res.status(201).json({ message: "Worker added successfully" });
      } catch (err) {
          res.status(500).json({ error: "Error adding worker" });
      }
  });
  

  

module.exports = router;
