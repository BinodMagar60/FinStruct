const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    personalEmail: String,
    email: String,
    password: String, 
    company: String,
    role: String,
    isOwner: Boolean,
});

module.exports = mongoose.model("User", userSchema);
