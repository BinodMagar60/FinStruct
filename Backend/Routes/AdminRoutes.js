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
const { getProfileDetails, updateProfileDetails, updateProfilePassword, deleteRolesAndSalaries, updateRolesAndSalaries, displayRolesAndSalaries, addRolesAndSalaries } = require("../controllers/AdminControllers");
const JobTitle = require("../models/JobTitle");





// ---------------------- User Profile---------------

//get data for profile of the user logged in
router.get("/profile/:email", getProfileDetails);


//update the data for profile of the user logged in
router.put("/profile/:email", updateProfileDetails);



//Update the password for profile of the user logged in
router.put("/password/:id", updateProfilePassword);


// ---------------------- User Profile End ---------------








// ----------------------  Salary Section ---------------

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







// ----------------------  User Section ---------------












module.exports = router;
