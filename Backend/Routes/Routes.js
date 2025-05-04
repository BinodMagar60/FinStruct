const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");
const {
  generateCustomSalt,
  customHash,
  xorEncrypt,
  xorDecrypt
} = require("../utils/passwordUtils");
const { getProfileDetails, updateProfileDetails, updateProfilePassword, deleteRolesAndSalaries, updateRolesAndSalaries, displayRolesAndSalaries, addRolesAndSalaries, getAllJobTitles, addNewUsers, getAllUserForUser, updateTheUsersInUserSection, deleteUserDetailUserSection, getAllUserToSalarySection, updateUserSalaryInSalarySection, addNotes, getNotes, updateNotes, deleteNotes } = require("../controllers/Controllers");
const JobTitle = require("../models/JobTitle");
const Company = require("../models/Company");
const Note = require("../models/Note");
const Mail = require('../models/Mail')




// ---------------------- Navbar---------------

//save notes in navbar
router.post("/navbar", addNotes)

//get data of saved notes in navbar
router.get('/navbar/:id', getNotes);


//update data of saved notes in navbar
router.put('/navbar/:id', updateNotes)

//Delete note in navbar
router.delete('/navbar/:id', deleteNotes)

//get notification about mails in top
router.get('/navbarNotfication/:id', async(req, res)=> {
  try{
    const {id} = req.params

    const existingUser = await User.findById(id)
    if(!existingUser){
      return res.status(404).json({message: "User not found"})
    }

    const mail = await Mail.find({to: id, companyId: existingUser.companyId}).sort({date: -1 })
    
    const mailData = mail.map(mail=> (
      {
        id: mail._id,
        title: mail.subject,
        description: mail.description,
        time: mail.date,
        read: mail.isRead,
        
      }
    ))
    return res.status(200).json({message: "data received", data: mailData})
  }
  catch(err){
    return res.status(500).json({message: "Server Error"})
  }
})


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
router.get('/salaries/:id', getAllUserToSalarySection)


//update users salary in salary section
router.put('/salaries/:id', updateUserSalaryInSalarySection)



//add Roles and their salaries
router.post('/roles-salaries', addRolesAndSalaries);

// Show roles and salaries
router.get('/roles-salaries/:id', displayRolesAndSalaries)


//Update roles and salaries
router.put('/roles-salaries/:id', updateRolesAndSalaries)


//Delete role and salaries
  router.delete('/roles-salaries/:id', deleteRolesAndSalaries)


// ---------------------- Salary Section End ---------------










// ----------------------  User Section ---------------



//requesting job list from jobTitles for selecting roles
  router.get('/usersroles/:id', getAllJobTitles)


//Add users within the company
router.post('/users/:id', addNewUsers);



// get all users under a company 
router.get('/users/:id', getAllUserForUser);



//update the user detail in User section.
router.put('/users/:id', updateTheUsersInUserSection)



//delete the user detial in user section.
router.delete('/users/:id', deleteUserDetailUserSection)


// ----------------------  User Section End ---------------








// ----------------------  Mail Section ---------------



//save mail about mails in mail section
router.post('/mails/data', async (req, res) => {
  try {
    const { subject, description, toEmail } = req.body;
    const { uid, cid } = req.query;

    if (!subject || !description || !toEmail || !uid || !cid) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = uid;
    const companyId = cid;

    const recipient = await User.findOne({ email: toEmail });
    if (!recipient) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    const newMail = new Mail({
      companyId,
      subject,
      description,
      from: userId,
      to: recipient._id,
      date: new Date(),
      isRead: false,
    });

    const mail = await newMail.save();

    const populatedMail = await Mail.findById(mail._id)
      .populate({
        path: "from",
        select: "username email jobTitleId",
        populate: {
          path: "jobTitleId",
          select: "titleName",
        },
      })
      .populate({
        path: "to",
        select: "username email jobTitleId",
        populate: {
          path: "jobTitleId",
          select: "titleName",
        },
      })
      .lean();

    const transformedMail = {
      id: populatedMail._id,
      companyId: populatedMail.companyId,
      subject: populatedMail.subject,
      description: populatedMail.description,
      from: populatedMail.from._id,
      fromName: populatedMail.from.username,
      fromJobTitle: populatedMail.from.jobTitleId?.titleName || null,
      to: populatedMail.to.username,
      toEmail: populatedMail.to.email,
      date: populatedMail.date.toISOString(),
      isRead: false,
    };

    res.status(200).json({message: "Mail sent", data: transformedMail})

  } catch (err) {
    console.error("Failed to send mail:", err);
    res.status(500).send("Server Error");
  }
});


//get Data about mails in mail section
router.get('/mails/data', async (req, res) => {
  try {
    const { uid, cid } = req.query;

    if (!uid || !cid) {
      return res.status(400).json({ message: "Missing uid or cid" });
    }

    const mails = await Mail.find({
      companyId: cid,
      $or: [{ to: uid }, { from: uid }]
    })
      .sort({ date: -1 })
      .populate({
        path: "from",
        select: "username email jobTitleId",
        populate: {
          path: "jobTitleId",
          select: "titleName"
        }
      })
      .populate({
        path: "to",
        select: "username email jobTitleId",
        populate: {
          path: "jobTitleId",
          select: "titleName"
        }
      })
      .lean();

    const transformedMails = mails.map(mail => {
      const isSent = mail.from._id.toString() === uid;
      const isToUser = mail.to._id.toString() === uid;

      return {
        id: mail._id,
        companyId: mail.companyId,
        subject: mail.subject,
        description: mail.description,
        from: mail.from._id,
        fromName: mail.from.username,
        fromJobTitle: mail.from.jobTitleId?.titleName || null,
        to: mail.to.username,
        toEmail: mail.to.email,
        date: mail.date.toISOString(),
        isRead: !isToUser ? true : mail.isRead, 
        isSent,
      };
    });

    res.status(200).json({ message: "Mail fetched", data: transformedMails });

  } catch (err) {
    console.error("Failed to fetch mail:", err);
    res.status(500).send("Server Error");
  }
});


//get users data for showing recommend in compose mail
router.get('/mailUsers/data', async (req, res) => {
  try {
    const { uid, cid } = req.query;

    const existUser = await User.findById(uid);
    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = await User.find({
      role: { $ne: "worker" },
      _id: { $ne: uid },
      companyId: cid
    }).populate({ path: 'jobTitleId', select: 'titleName' });

    const sanitizeData = data.map((user) => ({
      id: user._id,
      name: user.username,
      email: user.email,
      jobTitle: user.jobTitleId?.titleName || '',
      companyId: user.companyId,
    }));

    res.status(200).json(sanitizeData);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//update if the mail is read or not
router.put('/mail/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const findMail = await Mail.findById(id);
    if (!findMail) {
      return res.status(404).json({ message: "Mail not found" });
    }

    await Mail.findByIdAndUpdate(id, { isRead: true }, { new: true });

    return res.status(200).json({ message: "Updated" });
  } catch (err) {
    console.error("Error updating mail:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});


//delete mail

router.delete('/mail/:id',async(req, res)=> {
  try{
    const {id} = req.params

    const exists = await Mail.findById(id)
    if(!exists){
      return res.status(404).json({message: "Not found"})
    }

    await Mail.findByIdAndDelete(id)
    return res.status(200).json({message: "Mail deleted"})

  }
  catch(err){
    return res.status(500).json({message: "Server Error"})
  }
})




// ----------------------  Mail Section End ---------------









module.exports = router;
