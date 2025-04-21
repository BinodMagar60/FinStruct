const express = require("express");
const router = express.Router();
const Worker = require("../User/worker");

router.post("/add-worker", async (req, res) => {
    try {
        const newWorker = new Worker(req.body);
        await newWorker.save();
        res.status(201).json({ message: "Worker added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error adding worker" });
    }
});

module.exports = router;
