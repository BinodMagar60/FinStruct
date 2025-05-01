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
const { getProfileDetails, updateProfileDetails, updateProfilePassword, deleteRolesAndSalaries, updateRolesAndSalaries, displayRolesAndSalaries, addRolesAndSalaries, getAllJobTitles, addNewUsers, getAllUserForUser, updateTheUsersInUserSection, deleteUserDetailUserSection } = require("../controllers/AdminControllers");
const JobTitle = require("../models/JobTitle");
const Company = require("../models/Company");





// ---------------------- User Profile---------------

//get data for profile of the user logged in
router.get("/profile/:email", getProfileDetails);


//update the data for profile of the user logged in
router.put("/profile/:email", updateProfileDetails);



//Update the password for profile of the user logged in
router.put("/password/:id", updateProfilePassword);


// ---------------------- User Profile End ---------------










// ----------------------  Salary Section ---------------

//get all the user data to Salary section
router.get('/salaries/:id', async(req, res)=>{
  try {
      const { id } = req.params;
  
      const existingCompany = await Company.findById(id);
      if (!existingCompany) {
        return res.status(404).json({ message: 'Company Id not found' });
      }
  
      const users = await User.find({ companyId: id }).populate({path: 'jobTitleId'}).select('-password -salt')
  
      res.status(200).json({message: 'successfully pulled users data', receivedData: users});
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
})


//add Roles and their salaries
router.post('/roles-salaries', addRolesAndSalaries);

// Show roles and salaries
router.get('/roles-salaries/:id', displayRolesAndSalaries)


//Update roles and salaries
router.put('/roles-salaries/:id', updateRolesAndSalaries)


//Delete role and salaries
  router.delete('/roles-salaries/:id', deleteRolesAndSalaries)


// ---------------------- Salary Section End ---------------










// ----------------------  User Section ---------------



//requesting job list from jobTitles for selecting roles
  router.get('/usersroles/:id', getAllJobTitles)


//Add users within the company
router.post('/users/:id', addNewUsers);



// get all users under a company 
router.get('/users/:id', getAllUserForUser);



//update the user detail in User section.
router.put('/users/:id', updateTheUsersInUserSection)



//delete the user detial in user section.
router.delete('/users/:id', deleteUserDetailUserSection)


// ----------------------  User Section ---------------












module.exports = router;
