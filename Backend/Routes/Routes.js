const express = require("express");
const router = express.Router();
const {
  getProfileDetails,
  updateProfileDetails,
  updateProfilePassword,
  deleteRolesAndSalaries,
  updateRolesAndSalaries,
  displayRolesAndSalaries,
  addRolesAndSalaries,
  getAllJobTitles,
  addNewUsers,
  getAllUserForUser,
  updateTheUsersInUserSection,
  deleteUserDetailUserSection,
  getAllUserToSalarySection,
  updateUserSalaryInSalarySection,
  addNotes,
  getNotes,
  updateNotes,
  deleteNotes,
  getNavbarNotification,
  addMails,
  getMailSection,
  getRecommendedUsers,
  updateReadMails,
  deleteMail,
  uploadFileDocs,
  getDataDocs,
  deleteFileDocs,
  downloadFileDoc,
} = require("../controllers/Controllers");
const multer = require("multer");
const path = require("path");
const fs = require("fs");






// ---------------------- Navbar---------------

//save notes in navbar
router.post("/navbar", addNotes);

//get data of saved notes in navbar
router.get("/navbar/:id", getNotes);

//update data of saved notes in navbar
router.put("/navbar/:id", updateNotes);

//Delete note in navbar
router.delete("/navbar/:id", deleteNotes);

//get notification about mails in top
router.get("/navbarNotfication/:id", getNavbarNotification);

// ---------------------- Navbar End ---------------






// ---------------------- User Profile---------------

//get data for profile of the user logged in
router.get("/profile/:email", getProfileDetails);

//update the data for profile of the user logged in
router.put("/profile/:email", updateProfileDetails);

//Update the password for profile of the user logged in
router.put("/password/:id", updateProfilePassword);

// ---------------------- User Profile End ---------------






// ----------------------  Salary Section ---------------

//get all the user data to Salary section
router.get("/salaries/:id", getAllUserToSalarySection);

//update users salary in salary section
router.put("/salaries/:id", updateUserSalaryInSalarySection);

//add Roles and their salaries
router.post("/roles-salaries", addRolesAndSalaries);

// Show roles and salaries
router.get("/roles-salaries/:id", displayRolesAndSalaries);

//Update roles and salaries
router.put("/roles-salaries/:id", updateRolesAndSalaries);

//Delete role and salaries
router.delete("/roles-salaries/:id", deleteRolesAndSalaries);

// ---------------------- Salary Section End ---------------







// ----------------------  User Section ---------------

//requesting job list from jobTitles for selecting roles
router.get("/usersroles/:id", getAllJobTitles);

//Add users within the company
router.post("/users/:id/:uid", addNewUsers);

// get all users under a company
router.get("/users/:id", getAllUserForUser);

//update the user detail in User section.
router.put("/users/:id", updateTheUsersInUserSection);

//delete the user detial in user section.
router.delete("/users/:id/:uid", deleteUserDetailUserSection);

// ----------------------  User Section End ---------------







// ----------------------  Mail Section ---------------

//save mail about mails in mail section
router.post("/mails/data", addMails);

//get Data about mails in mail section
router.get("/mails/data", getMailSection);

//get users data for showing recommend in compose mail
router.get("/mailUsers/data", getRecommendedUsers);

//update if the mail is read or not
router.put("/mail/:id", updateReadMails);

//delete mail

router.delete("/mail/:id", deleteMail);

// ----------------------  Mail Section End ---------------






// ----------------------  Document Section ---------------

//checking if the folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });
//Uploading the file
router.post("/document/data", upload.single("file"), uploadFileDocs);

//getting the files in the UI
router.get("/document/data", getDataDocs);

// DELETE the document
router.delete("/document/data/:id", deleteFileDocs);

//Downlaod the document
router.get("/document/data/download/:id", downloadFileDoc);

// ----------------------  Document Section End ---------------



module.exports = router;
