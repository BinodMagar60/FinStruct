const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../User/User");
const jwt = require("jsonwebtoken")
const router = express.Router();
const key = "fjslkf sfjksfjsfofdsjflsjfi"

// Validation  for signup and login
const validateSignup = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    body("companyname").notEmpty().withMessage("Company name is required"),
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
        const { username, email, password, companyname } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const data={ username, email, password, companyname }
        console.log("signup data:  "+data)
        const user = new User({ username, email, password, companyname });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
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
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token  = jwt.sign({
            email:user.email,
            id:user.id,
        },key);
        res.cookie("token",token,{
            httpOnly: true, 
            secure: false,  
            sameSite: "none",
          })
        res.status(200).json({ message: "Login successful", user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
