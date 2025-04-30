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
  router.get('/usersroles/:id', async(req, res) => {
    try{
      const {id} = req.params

      const allRoles = await JobTitle.find({companyId: id})

      res.status(200).json({message: "successfull pulled data", allRoles})
    }catch(error){
      res.status(500).json({ show: "error", message: "Server Error", error: error.message });
    }
  })



//Add users within the company
router.post('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, personalEmail, role, jobTitleId, phoneNumber } = req.body;

    
    const jobTitleDoc = await JobTitle.findOne({ companyId: id, titleName: jobTitleId.name });
    if (!jobTitleDoc) return res.status(400).json({ message: "Invalid job title" });

    const companyDoc = await Company.findById(id);
if (!companyDoc) {
  return res.status(400).json({ message: "Invalid or missing company name" });
}

const randomDigits = Math.floor(100 + Math.random() * 900);
const newUsername = username.toLowerCase()
const defaultEmail = `${newUsername.replace(/\s/g, "")}${randomDigits}@${companyDoc.name.toLowerCase().replace(/\s/g, "")}.com`;

    const defaultPassword = "12345678";
    const salt = generateCustomSalt(16, username);
    const hashedPassword = customHash(defaultPassword, salt);
    const encryptedPassword = xorEncrypt(hashedPassword);


    let newUserData = {};

    if (role === "admin" || role === "employee") {
      newUserData = {
        username,
        personalEmail,
        email: defaultEmail,
        phoneNumber,
        password: encryptedPassword,
        salt,
        isOwner: false,
        role,
        companyId: id,
        jobTitleId: jobTitleDoc._id,
        salary: jobTitleDoc.defaultSalary,
        lastLogin: null,
        lastLogout: null,
      };
    } else {
      newUserData = {
        username,
        personalEmail,
        phoneNumber,
        email: "",
        password: "",
        salt: "",
        isOwner: false,
        role,
        companyId: id,
        jobTitleId: jobTitleDoc._id,
        salary: jobTitleDoc.defaultSalary,
        lastLogin: null,
        lastLogout: null,
      };
    }

    const newUser = new User(newUserData);
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});




//get the detail of all the users in User section
// router.get('/users/:id', async(req,res)=> {
//   try{
//     const {id} = req.params

//     const existingCompany = await Company.findById(id);
//     if(!existingCompany){
//       return res.status(404).json({message: 'Company Id not found'})
//     }


//     const users = await User.find({companyId: id})




//   }
//   catch(error){
//     res.status(500).json({ message: "Server Error", error: error.message });

//   }
// })





// GET all users under a company with cleaned and transformed data
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    
    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return res.status(404).json({ message: 'Company Id not found' });
    }

    
    const users = await User.find({ companyId: id })
      .populate('jobTitleId')
      .lean(); //helps in direct modification

   
    const sanitizedUsers = users.map(user => {
      const { password, salt, jobTitleId, ...rest } = user;

      return {
        ...rest,
        jobTitleId: jobTitleId
          ? {
              ...jobTitleId,
              name: jobTitleId.titleName,
            }
          : null,
      };
    });

    // Return cleaned users
    res.status(200).json({message: 'successfully pulled users data', sanitizedUsers});
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});













// ----------------------  User Section ---------------












module.exports = router;
