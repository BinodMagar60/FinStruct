const express = require("express");
const router = express.Router();
const { getActivity, loggedOutAcivity } = require("../controllers/UserActivityController");



// ---------------------- get Activity ---------------
//get activity
router.get("/getactivity/:uid", getActivity);


// ---------------------- get Activity End ---------------



// ---------------------- Logout ---------------
router.post('/logout/:uid', loggedOutAcivity)

// ---------------------- Logout End ---------------




module.exports = router;
