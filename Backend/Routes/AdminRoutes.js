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
const { getProfileDetails, updateProfileDetails, updateProfilePassword, deleteRolesAndSalaries, updateRolesAndSalaries, displayRolesAndSalaries, addRolesAndSalaries, getAllJobTitles, addNewUsers, getAllUserForUser, updateTheUsersInUserSection, deleteUserDetailUserSection, getAllUserToSalarySection, updateUserSalaryInSalarySection } = require("../controllers/AdminControllers");
const JobTitle = require("../models/JobTitle");
const Company = require("../models/Company");
const Note = require("../models/Note");




// ---------------------- Navbar---------------

//save notes in navbar
router.post("/navbar", async(req, res)=> {
  try{
    const {userId, companyId, content, date} =req.body
    
    const isUser = await User.findById(userId)
    if(!isUser){
      return res.status(404).json({message: "User not found"})
    }
    const isCompany = await Company.findById(companyId)
    if(!isCompany){
      return res.status(404).json({message: "Company not found"})
    }
    const newData = new Note({
      userId,
      companyId,
      content,
      createdAt: date
    })
    await newData.save()
    res.status(200).json({message: "Note Added", dataSaved: newData})
  }
  catch(error){
    res.status(500).json({message: "Server Error"})
  }
})

//get data of saved notes in navbar
router.get('/navbar/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const isUser = await User.findById(id);
    if (!isUser) {
      return res.status(404).json({ message: "User Id not found" });
    }

    const notes = await Note.find({ userId: id }).lean();

    const mappedNotes = notes.map(note => ({
      ...note,
      date: note.createdAt
    }));

    res.status(200).json({ message: 'notes received', receivedData: mappedNotes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


//update data of saved notes in navbar
router.put('/navbar/:id', async (req, res)=> {
  try{
    const {id} = req.params;
    const {content} =req.body

    const existNotes = await Note.findById(id)
    if(!existNotes){
      return res.status(404).json({message: "Note not found"})
    }

    await Note.findByIdAndUpdate(id, {content}, {new: true})
    res.status(200).json({message: "Notes Updated"})
    

  }
  catch(error){
    res.status(500).json({message: "Server Error"})
  }
})

//Delete note in navbar
router.delete('/navbar/:id', async(req,res)=> {
  try{
    const {id} = req.params;

    const existNotes = await Note.findById(id)
    if(!existNotes){
      return res.status(404).json({message: "Note not found"})
    }

    await Note.findByIdAndDelete(id)
    res.status(200).json({message: "Deleted Successfully"})
  }
  catch(err){
    res.status(500).json({message: "Server Error"})
  }
})




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


// ----------------------  User Section ---------------












module.exports = router;
