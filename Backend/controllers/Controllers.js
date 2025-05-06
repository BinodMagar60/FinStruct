const express = require("express");
const router = express.Router();
const User = require("../models/User");
const JobTitle = require("../models/JobTitle");
const Company = require("../models/Company");
const Note = require("../models/Note");
const Mail = require("../models/Mail");
const Document = require("../models/Document");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const {
  generateCustomSalt,
  customHash,
  xorEncrypt,
  xorDecrypt,
} = require("../utils/passwordUtils");





// ---------------------- NavBar ---------------

//save notes in navbar
const addNotes = async (req, res) => {
  try {
    const { userId, companyId, content, date } = req.body;

    const isUser = await User.findById(userId);
    if (!isUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isCompany = await Company.findById(companyId);
    if (!isCompany) {
      return res.status(404).json({ message: "Company not found" });
    }
    const newData = new Note({
      userId,
      companyId,
      content,
      createdAt: date,
    });
    await newData.save();
    res.status(200).json({ message: "Note Added", dataSaved: newData });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//get data of saved notes in navbar
const getNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const isUser = await User.findById(id);
    if (!isUser) {
      return res.status(404).json({ message: "User Id not found" });
    }

    const notes = await Note.find({ userId: id }).lean();

    const mappedNotes = notes.map((note) => ({
      ...note,
      date: note.createdAt,
    }));

    res
      .status(200)
      .json({ message: "notes received", receivedData: mappedNotes });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//update data of saved notes in navbar
const updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const existNotes = await Note.findById(id);
    if (!existNotes) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.findByIdAndUpdate(id, { content }, { new: true });
    res.status(200).json({ message: "Notes Updated" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//Delete note in navbar
const deleteNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const existNotes = await Note.findById(id);
    if (!existNotes) {
      return res.status(404).json({ message: "Note not found" });
    }

    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

//get notification about mails in top
const getNavbarNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const mail = await Mail.find({
      to: id,
      companyId: existingUser.companyId,
    }).sort({ date: -1 });

    const mailData = mail.map((mail) => ({
      id: mail._id,
      title: mail.subject,
      description: mail.description,
      time: mail.date,
      read: mail.isRead,
    }));
    return res.status(200).json({ message: "data received", data: mailData });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- Navbar End ---------------








// ---------------------- User Profile ---------------

//get the data for profile of the user logged in
const getProfileDetails = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email })
      .select("-password -salt")
      .populate("companyId")
      .populate("jobTitleId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

//update the data for profile of the user logged in
const updateProfileDetails = async (req, res) => {
  try {
    const { email } = req.params;

    const { username, phoneNumber, personalEmail, location, bio, photo } =
      req.body;

    const updateData = {
      username,
      phoneNumber,
      personalEmail,
      location,
      bio,
      photo,
    };

    const updatedUser = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
    }).select("-password -salt");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User Updated successfully", user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server Error" });
  }
};

//update the password for the profile of the user logged in
const updateProfilePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ show: "error", message: "User not found" });
    }

    const inputHash = customHash(currentPassword, user.salt);
    const originalHash = xorDecrypt(user.password);

    if (!originalHash || originalHash !== inputHash) {
      return res
        .status(401)
        .json({ show: "error", message: "Invalid Current Password" });
    }

    const sameAsOld = customHash(newPassword, user.salt);
    if (sameAsOld === inputHash) {
      return res.status(400).json({
        show: "error",
        message: "New Password Cannot be Current Password",
      });
    }

    const newSalt = generateCustomSalt(16, user.username);
    const newHashedPassword = customHash(newPassword, newSalt);
    const encryptedPassword = xorEncrypt(newHashedPassword);

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: encryptedPassword, salt: newSalt },
      { new: true }
    ).select("password salt");

    res.status(200).json({
      show: "success",
      message: "Password Updated Successfully",
      updatedFields: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      show: "error",
      message: "Server Error",
    });
  }
};

// ---------------------- User Profile End ---------------






// ----------------------  Salary Section ---------------

//get all the user data to Salary section
const getAllUserToSalarySection = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return res.status(404).json({ message: "Company Id not found" });
    }

    const users = await User.find({ companyId: id })
      .populate({ path: "jobTitleId" })
      .select("-password -salt");

    res
      .status(200)
      .json({ message: "successfully pulled users data", receivedData: users });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//update users salary in salary section
const updateUserSalaryInSalarySection = async (req, res) => {
  try {
    const { id } = req.params;

    const { salary } = req.body;

    const newData = {
      salary: salary,
    };

    const updatedData = await User.findByIdAndUpdate(id, newData, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ message: "User doesnot exist" });
    }

    res
      .status(200)
      .json({ message: "Salary Updated", recievedData: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//add Roles and their salaries
const addRolesAndSalaries = async (req, res) => {
  try {
    const { titleName, companyId, role, defaultSalary } = req.body;

    const existingJobTitle = await JobTitle.findOne({
      companyId,
      titleName: { $regex: `^${titleName}$`, $options: "i" },
    });

    if (existingJobTitle) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const jobTitleData = new JobTitle({
      companyId,
      role,
      titleName: titleName,
      defaultSalary,
    });

    await jobTitleData.save();

    res.status(201).json({ message: "Successfully Created" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Show roles and salaries
const displayRolesAndSalaries = async (req, res) => {
  try {
    const { id } = req.params;
    const roles = await JobTitle.find({ companyId: id });

    return res
      .status(200)
      .json({ message: "data retrived", allRolesData: roles });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Update roles and salaries
const updateRolesAndSalaries = async (req, res) => {
  try {
    const { id } = req.params;

    const { _id, titleName, defaultSalary, role, companyId } = req.body;

    const updateData = {
      _id,
      titleName,
      defaultSalary,
      role,
      companyId,
    };

    const updatedData = await JobTitle.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedData) {
      return res.status(400).json({ message: "Role not found" });
    }

    res
      .status(200)
      .json({ message: "Update Successfull", updatedValues: updatedData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//Delete role and salaries
const deleteRolesAndSalaries = async (req, res) => {
  try {
    const { id } = req.params;

    const existingJobTitle = await JobTitle.findById(id);

    if (!existingJobTitle) {
      return res.status(404).json({ message: "Role not found" });
    }

    const isUserUsingJobTitle = await User.findOne({ jobTitleId: id });

    if (isUserUsingJobTitle) {
      return res
        .status(400)
        .json({ message: "The role is currently being used" });
    }

    await JobTitle.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ---------------------- Salary Section End ---------------







// ----------------------  User Section ---------------

//requesting job list from jobTitles for selecting roles
const getAllJobTitles = async (req, res) => {
  try {
    const { id } = req.params;

    const allRoles = await JobTitle.find({ companyId: id });

    res.status(200).json({ message: "successfull pulled data", allRoles });
  } catch (error) {
    res
      .status(500)
      .json({ show: "error", message: "Server Error", error: error.message });
  }
};

//Add users within the company
const addNewUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, personalEmail, role, jobTitleId, phoneNumber } = req.body;

    const jobTitleDoc = await JobTitle.findOne({
      companyId: id,
      titleName: jobTitleId.name,
    });
    if (!jobTitleDoc)
      return res.status(400).json({ message: "Invalid job title" });

    const companyDoc = await Company.findById(id);
    if (!companyDoc) {
      return res
        .status(400)
        .json({ message: "Invalid or missing company name" });
    }

    const randomDigits = Math.floor(100 + Math.random() * 900);
    const newUsername = username.toLowerCase();
    const defaultEmail = `${newUsername.replace(
      /\s/g,
      ""
    )}${randomDigits}@${companyDoc.name.toLowerCase().replace(/\s/g, "")}.com`;

    const defaultPassword = "12345678";
    const salt = generateCustomSalt(16, username);
    const hashedPassword = customHash(defaultPassword, salt);
    const encryptedPassword = xorEncrypt(hashedPassword);

    let newUserData = {};

    if (role === "admin" || role === "employee") {
      newUserData = {
        username,
        personalEmail,
        email: defaultEmail,
        phoneNumber,
        password: encryptedPassword,
        salt,
        isOwner: false,
        role,
        companyId: id,
        jobTitleId: jobTitleDoc._id,
        salary: jobTitleDoc.defaultSalary,
        lastLogin: null,
        lastLogout: null,
      };
    } else {
      newUserData = {
        username,
        personalEmail,
        phoneNumber,
        email: "",
        password: "",
        salt: "",
        isOwner: false,
        role,
        companyId: id,
        jobTitleId: jobTitleDoc._id,
        salary: jobTitleDoc.defaultSalary,
        lastLogin: null,
        lastLogout: null,
      };
    }

    const newUser = new User(newUserData);
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get all users under a company
const getAllUserForUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return res.status(404).json({ message: "Company Id not found" });
    }

    const users = await User.find({ companyId: id })
      .populate("jobTitleId")
      .lean();

    const sanitizedUsers = users.map((user) => {
      delete user.password;
      delete user.salt;

      const jobTitle = user.jobTitleId
        ? {
            ...user.jobTitleId,
            name: user.jobTitleId.titleName,
          }
        : null;

      return {
        ...user,
        jobTitleId: jobTitle,
      };
    });

    res.status(200).json({
      message: "Successfully pulled users data",
      sanitizedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

//update the user detail in User section.
const updateTheUsersInUserSection = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, jobTitleId, personalEmail, phoneNumber } = req.body;

    const jobID = await JobTitle.findOne({ titleName: jobTitleId.name });
    if (!jobID) {
      return res.status(404).json({ message: "Job Title not found" });
    }

    const updateData = {
      username,
      jobTitleId: jobID,
      personalEmail,
      phoneNumber,
    };

    await User.findByIdAndUpdate(id, updateData, { new: true });
    res
      .status(200)
      .json({ message: "Update Successful", updatedValues: updateData });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//delete the user detial in user section.
const deleteUserDetailUserSection = async (req, res) => {
  try {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.isOwner) {
      return res
        .status(404)
        .json({ message: "Owners details cannot be deleted" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ---------------------- User Section End ---------------





// ---------------------- Mail Section ---------------

//save mail about mails in mail section
const addMails = async (req, res) => {
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

    res.status(200).json({ message: "Mail sent", data: transformedMail });
  } catch (err) {
    console.error("Failed to send mail:", err);
    res.status(500).send("Server Error");
  }
};

//get Data about mails in mail section
const getMailSection = async (req, res) => {
  try {
    const { uid, cid } = req.query;

    if (!uid || !cid) {
      return res.status(400).json({ message: "Missing uid or cid" });
    }

    const mails = await Mail.find({
      companyId: cid,
      $or: [{ to: uid }, { from: uid }],
    })
      .sort({ date: -1 })
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

    const transformedMails = mails.map((mail) => {
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
};

//get users data for showing recommend in compose mail
const getRecommendedUsers = async (req, res) => {
  try {
    const { uid, cid } = req.query;

    const existUser = await User.findById(uid);
    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const data = await User.find({
      role: { $ne: "worker" },
      _id: { $ne: uid },
      companyId: cid,
    }).populate({ path: "jobTitleId", select: "titleName" });

    const sanitizeData = data.map((user) => ({
      id: user._id,
      name: user.username,
      email: user.email,
      jobTitle: user.jobTitleId?.titleName || "",
      companyId: user.companyId,
    }));

    res.status(200).json(sanitizeData);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

//update if the mail is read or not
const updateReadMails = async (req, res) => {
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
};

//delete mail
const deleteMail = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await Mail.findById(id);
    if (!exists) {
      return res.status(404).json({ message: "Not found" });
    }

    await Mail.findByIdAndDelete(id);
    return res.status(200).json({ message: "Mail deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------- Mail Section End ---------------







// ---------------------- Document Section ---------------

//uploading the file
const uploadFileDocs = async (req, res) => {
  try {
    const { uid, cid } = req.query;

    if (!uid || !cid) {
      return res.status(400).json({ error: "Missing uid or cid" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { filename, originalname, size } = req.file;
    const filePath = `/uploads/${filename}`;
    const fileType = path.extname(originalname).slice(1).toLowerCase();
    const readableSize =
      size > 1024 * 1024
        ? `${(size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(size / 1024)} KB`;

    const newDoc = new Document({
      userId: uid,
      companyId: cid,
      name: originalname,
      filePath,
      fileType,
      size: readableSize,
    });

    await newDoc.save();

    res.status(201).json({ filePath, fileType, size: readableSize });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getting the files in the UI
const getDataDocs = async (req, res) => {
  try {
    const { uid, cid } = req.query;

    if (!uid || !cid) {
      return res.status(400).json({ error: "Missing uid or cid" });
    }

    const documents = await Document.find({ userId: uid, companyId: cid });

    const sanatizedData = documents.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      path: doc.filePath,
      size: doc.size,
      type: doc.fileType,
      date: doc.uploadedAt,
    }));

    res.status(200).json(sanatizedData);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE the document
const deleteFileDocs = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }

    const filePath = path.join(
      __dirname,
      "../uploads",
      path.basename(doc.filePath)
    );
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });

    await doc.deleteOne();

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Downlaod the document
const downloadFileDoc = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await Document.findById(id);

    if (!file || !file.filePath) {
      return res
        .status(404)
        .json({ message: "File not found or missing file path" });
    }

    const fullPath = path.join(__dirname, "..", file.filePath);

    // Optionally check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: "File does not exist on disk" });
    }

    res.download(fullPath, file.originalName); // sets original filename
  } catch (err) {
    console.error("Error fetching document for download:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---------------------- Document Section End ---------------






module.exports = {
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
};
