const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Company = require("../models/Company");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");



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





//add new tasks
router.post('/tasks/task/:pid', async (req, res) => {
  try {

    const {pid} = req.params

    const {
      title,
      priority,
      startingDate,
      dueDate,
      status,
      stage,    
      assignees = [],
      dependencies = [],
      subtasks = [],
      assets = [],
      activities = [],
      team = []
    } = req.body;

    // Basic validation
    if (!title || !startingDate || !dueDate) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Build subtasks array
    const preparedSubtasks = subtasks.map(subtask => ({
      title: subtask.title, 
      completed: !!subtask.completed,
      isMainSubtask: !!subtask.isMainSubtask
    }));

    // Build assets array
    const preparedAssets = assets.map(asset => ({
      name: asset.name,
      url: asset.url
    }));

    // Build activities array
    const preparedActivities = activities.map(activity => ({
      type: activity.type,
      user: activity.user,
      timestamp: activity.timestamp ? new Date(activity.timestamp) : new Date(),
      message: activity.message
    }));

    // Build team array
    const preparedTeam = team.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      initials: member.initials
    }));

    // Build the task object
    const task = new Task({
        projectId: pid,
        title,
        priority,
        startingDate,
        dueDate,
        status,
        stage,
        assignees,
        dependencies,
        subtasks: preparedSubtasks,
        assets: preparedAssets,
        activities: preparedActivities,
        team: preparedTeam
    });

    // Save to DB
    await task.save();

    return res.status(201).json({ success: true, task });
  } catch (err) {
    console.error('Error creating task:', err.message);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



    
//get the tasks
router.get('/tasks/task/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const tasks = await Task.find({ projectId: pid }).lean();

    const columns = [
      { id: 'todo', title: 'TO DO', color: 'blue', tasks: [] },
      { id: 'inprogress', title: 'IN PROGRESS', color: 'orange', tasks: [] },
      { id: 'completed', title: 'COMPLETED', color: 'green', tasks: [] },
      { id: 'onhold', title: 'ON HOLD', color: 'red', tasks: [] },
    ];

    const priorityWeight = { high: 1, normal: 2, low: 3 };

    tasks.forEach(task => {
      const formattedTask = {
        id: task._id.toString(),
        title: task.title,
        priority: task.priority,
        startingDate: task.startingDate,
        dueDate: task.dueDate,
        assignees: task.assignees,
        createdAt: task.createdAt,
        dependencies: task.dependencies,
        subtasks: task.subtasks.map((sub, idx) => ({
          id: `subtask-${task._id}-${idx + 1}`,
          title: sub.title,
          completed: sub.completed,
        })),
        assets: task.assets.map((asset, idx) => ({
          id: idx + 1,
          name: asset.name,
          url: asset.url,
        })),
        activities: task.activities.map(activity => ({
          type: activity.type,
          user: activity.user,
          timestamp: activity.timestamp,
          message: activity.message,
        })),
        team: task.team.map(member => ({
          id: member.id,
          name: member.name,
          role: member.role,
          initials: member.initials,
        })),
        status: task.status,
      };

      const status = task.status;
      const colIndex =
        status === 'TO DO'
          ? 0
          : status === 'IN PROGRESS'
          ? 1
          : status === 'COMPLETED'
          ? 2
          : status === 'ON HOLD'
          ? 3
          : -1;

      if (colIndex >= 0) {
        columns[colIndex].tasks.push(formattedTask);
      }
    });

    columns.forEach(col => {
      col.tasks.sort((a, b) => {
        return priorityWeight[a.priority] - priorityWeight[b.priority];
      });
    });

    return res.status(200).json(columns);
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});











// ---------------------- Tasks End ---------------





module.exports = router