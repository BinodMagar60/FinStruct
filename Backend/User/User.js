const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    personalEmail: String,
    phoneNumber: Number,
    location: String,
    email: String,
    password: String, 
    salt: String,
    company: String,
    role: {
        type: String,
        enum: ["admin", "user", "worker"]
    },
    isOwner: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
