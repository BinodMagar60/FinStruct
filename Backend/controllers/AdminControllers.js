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







module.exports = {getProfileDetails, updateProfileDetails, updateProfilePassword} 