const express = require("express");
const router = express.Router();
const User = require("../User/User");
const Worker = require("../User/worker");

//get data for profile of the user
router.get('/profile/:id', async(req, res) => {
    try{
        const user = await User.findById(req.params.id).select('-password','-salt');
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        res.json(user)
    }
    catch (err) {
        res.status(500).json({message: 'Server Error'})
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
