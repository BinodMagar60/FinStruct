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
const { getProfileDetails, updateProfileDetails, updateProfilePassword, deleteRolesAndSalaries, updateRolesAndSalaries, displayRolesAndSalaries, addRolesAndSalaries, getAllJobTitles, addNewUsers, getAllUserForUser, updateTheUsersInUserSection, deleteUserDetailUserSection, getAllUserToSalarySection, updateUserSalaryInSalarySection, addNotes, getNotes, updateNotes, deleteNotes, getNavbarNotification, addMails, getMailSection, getRecommendedUsers, updateReadMails, deleteMail } = require("../controllers/Controllers");
const JobTitle = require("../models/JobTitle");
const Company = require("../models/Company");
const Note = require("../models/Note");
const Mail = require('../models/Mail')




// ---------------------- Navbar---------------

//save notes in navbar
router.post("/navbar", addNotes)

//get data of saved notes in navbar
router.get('/navbar/:id', getNotes);


//update data of saved notes in navbar
router.put('/navbar/:id', updateNotes)

//Delete note in navbar
router.delete('/navbar/:id', deleteNotes)

//get notification about mails in top
router.get('/navbarNotfication/:id', getNavbarNotification)


// ---------------------- Navbar End ---------------









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
router.get('/salaries/:id', getAllUserToSalarySection)


//update users salary in salary section
router.put('/salaries/:id', updateUserSalaryInSalarySection)



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


// ----------------------  User Section End ---------------








// ----------------------  Mail Section ---------------



//save mail about mails in mail section
router.post('/mails/data', addMails);


//get Data about mails in mail section
router.get('/mails/data', getMailSection);


//get users data for showing recommend in compose mail
router.get('/mailUsers/data', getRecommendedUsers);

//update if the mail is read or not
router.put('/mail/:id', updateReadMails);


//delete mail

router.delete('/mail/:id', deleteMail)




// ----------------------  Mail Section End ---------------









module.exports = router;
