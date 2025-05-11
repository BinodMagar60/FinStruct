const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Company = require("../models/Company");
const Project = require("../models/Project");
const User = require("../models/User")



// ---------------------- Project ---------------

//add new project
router.post("/project/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const existingCompany = await Company.findById(id)
        if(!existingCompany){
            return res.status(404).json({message: "Company not found"})
        }

        const {uid, projectName, description} = req.body

        const data = new Project({
            companyId: id,
            projectName: projectName,
            creatorId: uid,
            description: description,
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        });


        await data.save()
        return res.status(200).json({message: "Project added", data: data})
    }
    catch(err){
        return res.status(500).json({message: "Server Error"})
    }
})


//get all projects
router.get("/project/:id", async(req, res)=> {
    try{
        const {id} = req.params;
        const existingCompany = await Company.findById(id)
        if(!existingCompany){
            return res.status(404).json({message: "Company not found"})
        }

        const allProjects = await Project.find({companyId: id})
        return res.status(200).json({message: "All Projects", data: allProjects})

    }
    catch(err){
        return res.status(500).json({message: "Server Error"})
    }
})

// ---------------------- Project End ---------------











// ---------------------- Tasks ---------------

function getInitials(name) {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
}


//get assignable users in tasks
router.get('/tasks/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const existingCompany = await Company.findById(id);
        if (!existingCompany) {
            return res.status(404).json({ message: "Company not found" });
        }

        const users = await User.find({ companyId: id, role: { $ne: "worker" } });

        const newUser = users.map((user) => ({
            id: user._id,
            name: user.username,
            color: "bg-blue-500",
            initials: getInitials(user.username)
        }));

        return res.status(200).json(newUser);
    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
});





// ---------------------- Tasks End ---------------





module.exports = router