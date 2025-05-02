const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Company = require("../models/Company");
const JobTitle = require("../models/JobTitle")
const jwt = require("jsonwebtoken");
const {
  generateCustomSalt,
  customHash,
  xorEncrypt,
  xorDecrypt,
} = require("../utils/passwordUtils");
const router = express.Router();
const secretKey = process.env.JWT_SECRET;

// Validation for signup and login
const validateSignup = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("company").notEmpty().withMessage("Company name is required"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Register User
router.post("/signup", validateSignup, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, email, password, company } = req.body;

    
    const existingCompany = await Company.findOne({ name: company });
    if (existingCompany) {
      return res.status(400).json({ show: "error", message: "Company already registered." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ show: "error", message: "Email already registered." });
    }
    
  
    const companyData = new Company({
      name: company,
      ownerName: username,
    });
    await companyData.save();


    const JobTitleData = new JobTitle({
      companyId: companyData._id,
      role: "user",
      titleName: "Owner",
      defaultSalary: 0
    })

    await JobTitleData.save()


    const salt = generateCustomSalt(16, username);
    const hashedPassword = customHash(password, salt);
    const encryptedPassword = xorEncrypt(hashedPassword);

    const user = new User({
      username,
      salt,
      email,
      password: encryptedPassword,
      isOwner: true,
      role: "admin",
      companyId: companyData._id,
      jobTitleId: JobTitleData._id,
      salary: JobTitleData.defaultSalary,
      lastLogin: null,
      lastLogout: null,
    });
    await user.save();

    res.status(201).json({ show: "success", message: "Signup Successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ show: "error", message: "Server Error", error: err.message });
  }
});


// Login User

router.post("/login", validateLogin, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user and populate company name
    const user = await User.findOne({ email }).populate("companyId", "name ownerName").populate("jobTitleId");

    if (!user) {
      return res.status(401).json({ show: "error", message: "Invalid Email or Password" });
    }

    // Verify password
    const inputHash = customHash(password, user.salt);
    const originalHash = xorDecrypt(user.password);

    if (!originalHash || originalHash !== inputHash) {
      return res.status(401).json({ show: "error", message: "Invalid Email or Password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, companyId: user.companyId._id },
      secretKey,
      { expiresIn: "30d" }
    );

    // Prepare safe user info
    const safeUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      personalEmail: user.personalEmail || null,
      phoneNumber: user.phoneNumber || null,
      location: user.location || null,
      companyId: user.companyId?._id || null,
      companyName: user.companyId?.name || null,
      jobTitleId: user.jobTitleId?._id,
      jobTitle: user.jobTitleId?.titleName,
      photo: user.photo,
      role: user.role,
      isOwner: user.isOwner,
    };

    res.status(200).json({
      show: "success",
      message: "Login successful",
      safeUser,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      show: "error",
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;


