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

    await task.save();

    return res.status(200).json({ success: true, task });
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
        subtasks: task.subtasks.map((sub) => ({
          id: sub._id,
          title: sub.title,
          completed: sub.completed,
          isMainSubtask: sub.isMainSubtask,
        })),
        assets: task.assets.map((asset) => ({
          id: asset._id,
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
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});





// Update Task
router.put('/tasks/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const {
      title,
      priority,
      startingDate,
      dueDate,
      stage,
      assignees,
      dependencies,
      subtasks,
      assets,
      activities,
      team
    } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        priority,
        startingDate,
        dueDate,
        status: stage === "todo"? "TO DO": stage === "inprogress"? "IN PROGRESS": stage === "completed"? "COMPLETED": "ON HOLD",
        stage,
        assignees,
        dependencies,
        subtasks,
        assets,
        activities,
        team
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});









//delete tasks
router.delete("/tasks/task/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(200).json({ message: `${task.title} deleted` });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});




//adding subtask in task
router.post("/tasks/subtask/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, completed = false, isMainSubtask = false, activity } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const newSubtask = {
      title,
      completed,
      isMainSubtask,
    };

    task.subtasks.push(newSubtask);

    
    if (activity) {
      task.activities.unshift(activity);
    }

   
    if (task.status === "COMPLETED" && !completed) {
      task.status = "TO DO";
      task.stage = 'todo'
      const statusChangeActivity = {
        type: "Commented",
        user: activity?.user || "System",
        timestamp: new Date(),
        message: `Task moved from COMPLETED to TO DO because a new incomplete subtask was added: ${title}`,
      };
      task.activities.unshift(statusChangeActivity);
    }

    await task.save();

    res.status(201).json({ message: "Subtask added", subtask: newSubtask });
  } catch (error) {
    console.error("Add Subtask Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


//deleting subtask in task
router.delete("/tasks/subtask/:taskId/:subtaskId", async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { user } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const subtaskIndex = task.subtasks.findIndex((s) => s._id.toString() === subtaskId);
    if (subtaskIndex === -1) return res.status(404).json({ message: "Subtask not found" });

    const removedSubtask = task.subtasks[subtaskIndex];
    task.subtasks.splice(subtaskIndex, 1); // Remove the subtask

    if (user) {
      task.activities.unshift({
        type: "Commented",
        user,
        timestamp: new Date(),
        message: `Deleted subtask: ${removedSubtask.title}`,
      });
    }

    // checking if the other subtasks are completed or not
    const remainingSubtasks = task.subtasks;

    const allCompleted = remainingSubtasks.length > 0 && remainingSubtasks.every((s) => s.completed);
    if (allCompleted && task.status !== "COMPLETED") {
      task.status = "COMPLETED";
      task.stage = 'completed'
      if (user) {
        task.activities.unshift({
          type: "Commented",
          user,
          timestamp: new Date(),
          message: `All subtasks completed. Task marked as COMPLETED.`,
        });
      }
    } else if (!allCompleted && task.status === "COMPLETED") {
      task.status = "IN PROGRESS";
      task.stage = 'inprogress'
      if (user) {
        task.activities.unshift({
          type: "Commented",
          user,
          timestamp: new Date(),
          message: `Task status reverted from COMPLETED to IN PROGRESS after subtask deletion.`,
        });
      }
    }

    await task.save();

    res.status(200).json({ message: "Subtask deleted", subtaskId });
  } catch (error) {
    console.error("Delete Subtask Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});








// Update subtask 
router.put('/tasks/subtask/:taskId/:subtaskId', async (req, res) => {
  const { taskId, subtaskId } = req.params;
  const { user, ...updates } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    
    Object.assign(subtask, updates);

    
    task.activities.unshift({
      type: 'Commented',
      user,
      timestamp: new Date(),
      message: `Updated subtask: ${subtask.title} - ${subtask.completed ? 'Completed' : 'Reopened'}`,
    });

  
    const allCompleted = task.subtasks.length > 0 && task.subtasks.every(st => st.completed);

    if (task.status === 'COMPLETED' && !subtask.completed) {
      task.status = 'TO DO';
      task.stage = 'todo';
      task.activities.unshift({
        type: 'Commented',
        user,
        timestamp: new Date(),
        message: 'Task moved from COMPLETED to TO DO because a subtask was marked as incomplete',
      });
    } else if (allCompleted && task.status !== 'COMPLETED') {
      task.status = 'COMPLETED';
      task.stage = 'completed'
      task.activities.unshift({
        type: 'Completed',
        user,
        timestamp: new Date(),
        message: 'All subtasks completed. Task marked as completed.',
      });
    }

    await task.save();
    res.json({ message: 'Subtask and activities updated', task });
  } catch (err) {
    console.error('Error updating subtask:', err);
    res.status(500).json({ message: 'Server error updating subtask' });
  }
});



//add comments
router.post('/tasks/activity/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { message, timestamp, type, user } = req.body;

    const activity = {
      message,
      timestamp: timestamp || new Date().toISOString(),
      type,
      user,
    };

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $push: {
          activities: {
            $each: [activity],
            $position: 0,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Activity added to top successfully', task: updatedTask });
  } catch (error) {
    console.error('Error pushing activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



//get task detils for taskDetails section
router.get('/tasks/taskdetails/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Format task data explicitly
    const formattedTask = {
      id: task._id.toString(),
      title: task.title,
      priority: task.priority,
      startingDate: task.startingDate,
      dueDate: task.dueDate,
      status: task.status,
      createdAt: task.createdAt.toISOString(),
      assignees: task.assignees,
      dependencies: task.dependencies,
      activities: task.activities.map(act => ({
        type: act.type,
        user: act.user,
        timestamp: act.timestamp,
        message: act.message
      })),
      assets: task.assets.map(as => ({
        id: as._id,
        name: as.name,
        url: as.url
      })),
      subtasks: task.subtasks.map(st => ({
        id: st.id,
        title: st.title,
        completed: st.completed,
        isMainSubtask: st.isMainSubtask
      })),
      team: task.team.map(tm => ({
        id: tm.id,
        name: tm.name,
        role: tm.role,
        initials: tm.initials
      }))
    };

    res.json(formattedTask);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



//add image as assets 
router.post('/tasks/addasset/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { asset, newActivity } = req.body;
  const imgdata = asset
  const activities = newActivity
  if (!imgdata || !imgdata.name || !imgdata.url || !activities || !activities.message || !activities.user) {
    return res.status(400).json({ message: 'Missing required data.' });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    task.assets.push({
      name: imgdata.name,
      url: imgdata.url
    });

    // Add the activity
    task.activities.push({
      type: activities.type,
      user: activities.user,
      message: activities.message,
      timestamp: activities.timestamp || new Date()
    });

    await task.save();
    res.status(200).json({ message: 'Asset and activity added successfully.', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});



// delete assets
router.delete('/tasks/:taskId/delete-asset/:assetId', async (req, res) => {
  const { taskId, assetId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const assetIndex = task.assets.findIndex(asset => asset._id.toString() === assetId);
    if (assetIndex === -1) {
      return res.status(404).json({ message: 'Asset not found in task.' });
    }

    task.assets.splice(assetIndex, 1);
    await task.save();

    res.status(200).json({ message: 'Asset deleted successfully.', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});




// ---------------------- Tasks End ---------------





module.exports = router