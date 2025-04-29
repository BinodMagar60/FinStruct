const express = require("express");
const router = express.Router();
const User = require("../models/User");
const JobTitle = require("../models/JobTitle");
const mongoose = require("mongoose");
const {
  generateCustomSalt,
  customHash,
  xorEncrypt,
  xorDecrypt
} = require("../utils/passwordUtils");





// ---------------------- User Profile ---------------

//get the data for profile of the user logged in
const getProfileDetails = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email }).select("-password -salt").populate("companyId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



//update the data for profile of the user logged in
const updateProfileDetails = async (req, res) => {
  try {
    const { email } = req.params;

    const { username, phoneNumber, personalEmail, location, bio, photo } =
      req.body;

    const updateData = {
      username,
      phoneNumber,
      personalEmail,
      location,
      bio,
      photo,
    };

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    }).select("-password -salt");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User Updated successfully", user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server Error" });
  }
}





//update the password for the profile of the user logged in
const updateProfilePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ show: "error", message: "User not found" });
    }

    const inputHash = customHash(currentPassword, user.salt);
    const originalHash = xorDecrypt(user.password);

    if (!originalHash || originalHash !== inputHash) {
      return res.status(401).json({ show: "error", message: "Invalid Current Password" });
    }

    
    const sameAsOld = customHash(newPassword, user.salt);
    if (sameAsOld === inputHash) {
      return res.status(400).json({
        show: "error",
        message: "New Password Cannot be Current Password",
      });
    }

    const newSalt = generateCustomSalt(16, user.username);
    const newHashedPassword = customHash(newPassword, newSalt);
    const encryptedPassword = xorEncrypt(newHashedPassword);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: encryptedPassword, salt: newSalt },
      { new: true }
    ).select("password salt");

    res.status(200).json({
      show: "success",
      message: "Password Updated Successfully",
      updatedFields: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      show: "error",
      message: "Server Error",
    });
  }
}

// ---------------------- User Profile End ---------------









// ----------------------  Salary Section ---------------

//add Roles and their salaries
const addRolesAndSalaries = async (req, res) => {
  try {
    const { titleName, companyId, role, defaultSalary } = req.body;


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
};




// Show roles and salaries
const displayRolesAndSalaries = async(req, res) => {

  try{
    const {id} = req.params
    const roles = await JobTitle.find({companyId: id})

    return res.status(200).json({message: "data retrived", allRolesData: roles})
  }
  catch(error){
    res.status(500).json({message: "Server Error", error: error.message})
  }

}


//Update roles and salaries
const updateRolesAndSalaries = async(req, res)=> {
  try{
    const {id} = req.params

    const {_id, titleName, defaultSalary, role, companyId} = req.body

    const updateData = {
      _id,
      titleName,
      defaultSalary,
      role,
      companyId
    }
    
    const updatedData = await JobTitle.findByIdAndUpdate(id, updateData, {new: true})

    if(!updatedData){
      return res.status(400).json({message: "Role not found"})
    }

    res.status(200).json({message: "Update Successfull", updatedValues: updatedData})


  }
  catch(error){
    res.status(500).json({message: "Server Error", error: error.message})
  }
}


//Delete role and salaries
  const deleteRolesAndSalaries = async(req, res)=> {
    try{
      const {id} = req.params;

      const existingJobTitle = await JobTitle.findById(id)

      

      if(!existingJobTitle){
        return res.status(404).json({message: "Role not found"})
      }

      const isUserUsingJobTitle = await User.findOne({jobTitleId: id})

      if(isUserUsingJobTitle){
        return res.status(400).json({message: "The role is currently being used"})
      }

      await JobTitle.findByIdAndDelete(id)
      res.status(200).json({message: 'Deleted Successfully.'})

    }
    catch (error){
      res.status(500).json({message: "Server Error", error: error.message})
    }
  }


// ---------------------- Salary Section End ---------------




module.exports = {getProfileDetails, updateProfileDetails, updateProfilePassword, deleteRolesAndSalaries, updateRolesAndSalaries, displayRolesAndSalaries, addRolesAndSalaries} 