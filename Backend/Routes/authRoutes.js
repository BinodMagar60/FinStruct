const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../User/User");
const jwt = require("jsonwebtoken");
const { generateCustomSalt, customHash, xorEncrypt, xorDecrypt } = require("../utils/passwordUtils");
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
        const { username, email, password, company } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ show: "error", message: "Email Already Exist" });
        }

        // Check if company name already exists
        const existingCompany = await User.findOne({ company });
        if (existingCompany) {
            return res.status(400).json({ message: "Company already registered" });
        }

        const salt = generateCustomSalt(16, username)

        const hashedPassword = customHash(password, salt)

        const encryptedPassword = xorEncrypt(hashedPassword)

        const userData = {
            username: username,
            personalEmail: "",
            phoneNumber: null,
            location: "",
            email: email,
            password: encryptedPassword,
            salt: salt,
            company: company,
            role: "admin",
            isOwner: true
        }

        const user = new User(userData);
        await user.save();
        res.status(201).json({ show: "success",message: "Signup Successful" });

    } catch (error) {
        res.status(500).json({ error: error.message, show: "error", message: "Server Error" });
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
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }

        const inputHash = customHash(password, user.salt);
        const originalHash = xorDecrypt(user.password);

        if (!originalHash || originalHash !== inputHash) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }

        const token = jwt.sign({ email: user.email, id: user.id }, secretKey, {
            expiresIn: "30d"
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        const safeUser = {
            username: user.username,
            personalEmail: user.personalEmail,
            phoneNumber: user.phoneNumber,
            location: user.location,
            email: user.email,
            company: user.company,
            role: user.role,
            isOwner: user.isOwner
        };

        res.status(200).json({ message: "Login successful", safeUser, token });

    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Server Error"
        });
    }
});


//Logout
router.post("/logout", (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({message: "logged out successfully"})
})


module.exports = router;
