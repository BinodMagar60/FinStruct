const express = require("express");
const router = express.Router();
const User = require("../models/User");
const JobTitle = require("../models/JobTitle");
const Company = require("../models/Company");

const mongoose = require("mongoose");
const {
  generateCustomSalt,
  customHash,
  xorEncrypt,
  xorDecrypt,
} = require("../utils/passwordUtils");





// ---------------------- User Profile ---------------





//get the data for profile of the user logged in
const getProfileDetails = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email })
      .select("-password -salt")
      .populate("companyId")
      .populate("jobTitleId");
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
};

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
      return res
        .status(401)
        .json({ show: "error", message: "Invalid Current Password" });
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
};

// ---------------------- User Profile End ---------------









// ----------------------  Salary Section ---------------

//get all the user data to Salary section
const getAllUserToSalarySection = async(req, res)=>{
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
}

//update users salary in salary section
const updateUserSalaryInSalarySection = async(req, res)=> {
  try{
    const {id} = req.params;

    const {salary} = req.body;

    const newData = {
      salary: salary
    }

    const updatedData = await User.findByIdAndUpdate(id, newData, {new: true})

    if(!updatedData){
      return res.status(404).json({message: "User doesnot exist"})
    }

    res.status(200).json({message: "Salary Updated", recievedData: updatedData})
    
  }
  catch(error){
    res.status(500).json({message: "Server Error", error: error.message})
  }
}


//add Roles and their salaries
const addRolesAndSalaries = async (req, res) => {
  try {
    const { titleName, companyId, role, defaultSalary } = req.body;

    const existingJobTitle = await JobTitle.findOne({
      companyId,
      titleName: { $regex: `^${titleName}$`, $options: "i" },
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
const displayRolesAndSalaries = async (req, res) => {
  try {
    const { id } = req.params;
    const roles = await JobTitle.find({ companyId: id });

    return res
      .status(200)
      .json({ message: "data retrived", allRolesData: roles });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Update roles and salaries
const updateRolesAndSalaries = async (req, res) => {
  try {
    const { id } = req.params;

    const { _id, titleName, defaultSalary, role, companyId } = req.body;

    const updateData = {
      _id,
      titleName,
      defaultSalary,
      role,
      companyId,
    };

    const updatedData = await JobTitle.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedData) {
      return res.status(400).json({ message: "Role not found" });
    }

    res
      .status(200)
      .json({ message: "Update Successfull", updatedValues: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Delete role and salaries
const deleteRolesAndSalaries = async (req, res) => {
  try {
    const { id } = req.params;

    const existingJobTitle = await JobTitle.findById(id);

    if (!existingJobTitle) {
      return res.status(404).json({ message: "Role not found" });
    }

    const isUserUsingJobTitle = await User.findOne({ jobTitleId: id });

    if (isUserUsingJobTitle) {
      return res
        .status(400)
        .json({ message: "The role is currently being used" });
    }

    await JobTitle.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ---------------------- Salary Section End ---------------









// ----------------------  User Section ---------------

//requesting job list from jobTitles for selecting roles
const getAllJobTitles = async (req, res) => {
  try {
    const { id } = req.params;

    const allRoles = await JobTitle.find({ companyId: id });

    res.status(200).json({ message: "successfull pulled data", allRoles });
  } catch (error) {
    res
      .status(500)
      .json({ show: "error", message: "Server Error", error: error.message });
  }
};

//Add users within the company
const addNewUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, personalEmail, role, jobTitleId, phoneNumber } = req.body;

    const jobTitleDoc = await JobTitle.findOne({
      companyId: id,
      titleName: jobTitleId.name,
    });
    if (!jobTitleDoc)
      return res.status(400).json({ message: "Invalid job title" });

    const companyDoc = await Company.findById(id);
    if (!companyDoc) {
      return res
        .status(400)
        .json({ message: "Invalid or missing company name" });
    }

    const randomDigits = Math.floor(100 + Math.random() * 900);
    const newUsername = username.toLowerCase();
    const defaultEmail = `${newUsername.replace(
      /\s/g,
      ""
    )}${randomDigits}@${companyDoc.name.toLowerCase().replace(/\s/g, "")}.com`;

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

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get all users under a company
const getAllUserForUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return res.status(404).json({ message: "Company Id not found" });
    }

    const users = await User.find({ companyId: id })
      .populate("jobTitleId")
      .lean();

    const sanitizedUsers = users.map((user) => {
      delete user.password;
      delete user.salt;

      const jobTitle = user.jobTitleId
        ? {
            ...user.jobTitleId,
            name: user.jobTitleId.titleName,
          }
        : null;

      return {
        ...user,
        jobTitleId: jobTitle,
      };
    });

    res.status(200).json({
      message: "Successfully pulled users data",
      sanitizedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


//update the user detail in User section.
const updateTheUsersInUserSection = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, jobTitleId, personalEmail, phoneNumber } = req.body;

    const jobID = await JobTitle.findOne({ titleName: jobTitleId.name });
    if (!jobID) {
      return res.status(404).json({ message: "Job Title not found" });
    }

    const updateData = {
      username,
      jobTitleId: jobID,
      personalEmail,
      phoneNumber,
    };

    await User.findByIdAndUpdate(id, updateData, { new: true });
    res
      .status(200)
      .json({ message: "Update Successful", updatedValues: updateData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//delete the user detial in user section.
const deleteUserDetailUserSection = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.isOwner) {
      return res
        .status(404)
        .json({ message: "Owners details cannot be deleted" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ---------------------- User Section End ---------------








module.exports = {
  getProfileDetails,
  updateProfileDetails,
  updateProfilePassword,
  deleteRolesAndSalaries,
  updateRolesAndSalaries,
  displayRolesAndSalaries,
  addRolesAndSalaries,
  getAllJobTitles,
  addNewUsers,
  getAllUserForUser,
  updateTheUsersInUserSection,
  deleteUserDetailUserSection,
  getAllUserToSalarySection,
  updateUserSalaryInSalarySection
};
