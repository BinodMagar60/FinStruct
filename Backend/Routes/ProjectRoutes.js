const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Company = require("../models/Company");
const Project = require("../models/Project");



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





module.exports = router