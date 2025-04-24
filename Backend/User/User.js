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
    photo: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        enum: ["admin", "employee"]
    },
    isOwner: {
        type: Boolean,
        default: `false`
    },
    bio: {
        type: String,
        default: ""
    }
},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
