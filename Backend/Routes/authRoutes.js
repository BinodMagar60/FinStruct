const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../User/User");
const jwt = require("jsonwebtoken")
const router = express.Router();
const secretKey = process.env.JWT_SECRET;

// Validation for signup and login
const validateSignup = [
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
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
        const { username, personalEmail, email, password, company, role, isOwner } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Check if company name already exists
        const existingCompany = await User.findOne({ company });
        if (existingCompany) {
            return res.status(400).json({ message: "Company name already in use" });
        }

        const user = new User({ username, personalEmail, email, password, company, role, isOwner });
        await user.save();
        res.status(201).json({ message: "Signup Successful" });

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
        const token = jwt.sign({
            email: user.email,
            id: user.id,
            
        }, secretKey, {
            expiresIn: "30d"
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, 
            
        })
        res.status(200).json({ message: "Login successful", user, token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//Logout
router.post("/logout", (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message: "logged out successfully"})
})


module.exports = router;
