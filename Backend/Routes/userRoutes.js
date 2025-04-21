const express = require("express");
const router = express.Router();
const User = require("../User/User");

router.post("/add-user", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error adding user" });
    }
});

module.exports = router;
