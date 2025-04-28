const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const {
  generateCustomSalt,
  customHash,
  xorEncrypt,
  xorDecrypt
} = require("../utils/passwordUtils");
const { getProfileDetails, updateProfileDetails, updateProfilePassword } = require("../controllers/AdminControllers");
const JobTitle = require("../models/JobTitle");

//get data for profile of the user logged in
router.get("/profile/:email", getProfileDetails);


//update the data for profile of the user logged in
router.put("/profile/:email", updateProfileDetails);



//Update the password for profile of the user logged in
router.put("/password/:id", updateProfilePassword);



//add Roles and their salaries
router.post('/roles-salaries', async (req, res) => {
  try {
    const { titleName, companyId, role, defaultSalary } = req.body;

    // Check if a role with the same title already exists in the same company (case-insensitive)
    const existingJobTitle = await JobTitle.findOne({
      companyId,
      titleName: { $regex: `^${titleName}$`, $options: 'i' }
    });

    if (existingJobTitle) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const jobTitleData = new JobTitle({
      companyId,
      role,
      titleName: titleName,
      defaultSalary,
    });

    await jobTitleData.save();

    res.status(201).json({ message: "Successfully Created" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});




// Show roles and salaries
router.get('/roles-salaries/:id', async(req, res) => {

  try{
    const {id} = req.params
    const roles = await JobTitle.find({companyId: id})

    return res.status(200).json({message: "data retrived", allRolesData: roles})
  }
  catch(error){
    res.status(500).json({message: "Server Error", error: error.message})
  }

})


//Update roles and salaries
router.put('/roles-salaries', async(req, res)=> {
  try{

  }
  catch(error){
    res.status(500).json({message: "Server Error", error: error.message})
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
