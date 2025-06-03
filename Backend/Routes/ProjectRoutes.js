const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Company = require("../models/Company");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const Transaction = require("../models/Transactions");
const UserActivity = require("../models/UserActivity");
const scheduleTasksWithPriority = require('../utils/taskScheduler')
const weightedLinearRegression = require('../utils/forecasting')


// ---------------------- Project ---------------

//add new project
router.post("/project/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const existingCompany = await Company.findById(id)
        if(!existingCompany){
            return res.status(404).json({message: "Company not found"})
        }

        const {uid, projectName, description, dueDate} = req.body

        const data = new Project({
            companyId: id,
            projectName: projectName,
            creatorId: uid,
            description: description,
            dueDate: dueDate
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

    // Find the task to be deleted
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Remove this task's ID from dependencies in other tasks in the same project
    await Task.updateMany(
      {
        projectId: task.projectId,
        dependencies: id
      },
      {
        $pull: { dependencies: id }
      }
    );

    // Delete the task
    await Task.findByIdAndDelete(id);

    return res.status(200).json({ message: `${task.title} deleted and removed from dependent tasks` });
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



//update task when moved from one to another column
router.put('/tasks/movetask', async(req, res)=>{
  try{
    const {targetColumnId, taskId} = req.body

    const result = await Task.findByIdAndUpdate(taskId,{
      stage: targetColumnId,
      status: targetColumnId === "todo"? "TO DO": targetColumnId === "inprogress"? "IN PROGRESS": targetColumnId === "completed"? "COMPLETED" : "ON HOLD"
    },{
      new: true
    })
    if(!result){
      return res.status(404).json({message: "Task not found"})
    }

    return res.status(200).json(result)
  }
  catch(error){
    return res.status(500).json({message: "Server Error"})
  }
})




//update the date in gantt chart section
router.put('/tasks/ganttchart/dates/:id', async (req, res) => {
  const { startingDate, dueDate } = req.body;
  const { id } = req.params;

  if (!startingDate || !dueDate) {
    return res.status(400).json({ message: 'Both startingDate and dueDate are required' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { startingDate, dueDate },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task dates updated', task: updatedTask });
  } catch (error) {
    console.error('Error updating task dates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




//update the dependencies  in gantt chart section
router.put('/tasks/ganttchart/dependencies/:id', async(req, res)=> {
const {dependencies} = req.body
const {id} = req.params

try{
  const updatedTask = await Task.findByIdAndUpdate(id, {dependencies: dependencies}, {new: true})
  if(!updatedTask){
    return res.status(404).json({message: "Task not found"})
  }

  return res.status(200).json({message:"Updated", task: updatedTask})
}
catch(error){
  return res.status(500).json({message: "Server Error"})
}

})



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



// ---------------------- Transaction ---------------


router.post('/transactions/new', async (req, res) => {
  try {
    const {
      companyId,
      projectId,
      type,
      category,
      amount,
      description,
      requestedById,
      requestedBy,
    } = req.body;

    
    if (!companyId || !projectId || !type || !category || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newTransaction = new Transaction({
      companyId,
      projectId,
      type,
      category,
      amount: Number(amount),
      createdDate: new Date(),
      description,
      requestedById,
      requestedBy,
      status: 'pending',          
    });

    const newActivity = new UserActivity({
      uid: requestedById,
      type: 'transaction',
      description: `Requested for ${category} (${type}) approval`
    })

    await newActivity.save()
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Get all transactions
router.get('/transactions/get/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    // Sort by 'createdDate' in descending order (latest on top)
    const transactions = await Transaction.find({ projectId: pid }).sort({ createdDate: -1 });

    const newTransaction = transactions.map(transactiondata => {
      const data = transactiondata.toObject();
      return {
        ...data,
        id: data._id
      };
    });

    res.json(newTransaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Approve a transaction 
router.put('/transactions/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, approvedById } = req.body;

    const existingTransacton = await Transaction.findByIdAndUpdate(
      id,
      {
        status,
        approvedBy,
        approvedById,
        approvedDate: new Date()
      },
      { new: true }
    );

    if (!existingTransacton) {
      return res.status(404).json({ message: "Something went wrong" }); 
    }

    const approvedActivities = new UserActivity({
      uid: existingTransacton.requestedById,
      type: "transaction",
      description: `${existingTransacton.category} (${existingTransacton.type}) transaction has been Approved by ${approvedBy}`
    });

    const approverActivities = new UserActivity({
      uid: approvedById,
      type: "transaction",
      description: `${existingTransacton.category} (${existingTransacton.type}) transaction has been Approved by you`
    });

    if (approvedById.toString() !== existingTransacton.requestedById.toString()) {
      await approvedActivities.save();
    }

    await approverActivities.save();

    res.status(200).json({
      message: "Successfully approved",
      newdata: existingTransacton
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Reject a transaction (PATCH /api/transactions/:id/reject)
router.put('/transactions/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvedBy, approvedById } = req.body;

    const existingTransacton = await Transaction.findByIdAndUpdate(
      id,
      {
        status,
        approvedBy,
        approvedById,
        approvedDate: new Date()
      },
      { new: true }
    );

    if (!existingTransacton) {
      return res.status(404).json({ message: "Something went wrong" });
    }

    const rejectedActivities = new UserActivity({
      uid: existingTransacton.requestedById,
      type: "transaction",
      description: `${existingTransacton.category} (${existingTransacton.type}) transaction has been Rejected by ${approvedBy}`
    });

    const rejecterActivities = new UserActivity({
      uid: approvedById,
      type: "transaction",
      description: `${existingTransacton.category} (${existingTransacton.type}) transaction has been Rejected by you`
    });

    if (approvedById.toString() !== existingTransacton.requestedById.toString()) {
      await rejectedActivities.save();
    }

    await rejecterActivities.save();

    res.status(200).json({
      message: "Successfully rejected",
      newdata: existingTransacton
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// ---------------------- Transactions End ---------------












// ---------------------- PrioritySchudeling Algorithm  ---------------



router.get('/project/:projectId/sorted-tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).lean();

    const activeTasks = tasks.filter(task => task.status !== 'COMPLETED');

    const orderedTasks = scheduleTasksWithPriority(activeTasks);

    const now = new Date();

    // Build "blocked by" map
    const blockedByMap = new Map();
    for (const task of activeTasks) {
      for (const depId of task.dependencies || []) {
        const depStr = depId.toString();
        if (!blockedByMap.has(depStr)) blockedByMap.set(depStr, []);
        blockedByMap.get(depStr).push(task._id.toString());
      }
    }

    const messages = orderedTasks.map((task) => {
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate - now;
      const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      const taskId = task._id.toString();
      const blockedTasks = blockedByMap.get(taskId) || [];

      const parts = [];

      if (task._cycleError) {
        parts.push('Tasks are linked in a loop. Please fix.');
      } else {
        if (daysUntilDue < 0) {
          parts.push(`Overdue by ${Math.abs(daysUntilDue)} day(s)`);
        } else if (daysUntilDue === 0) {
          parts.push('Due today');
        } else if (daysUntilDue <= 5) {
          parts.push(`Due in ${daysUntilDue} day(s)`);
        }

        if (blockedTasks.length > 0) {
          parts.push(`Blocking ${blockedTasks.length} task(s)`);
        }

        if (task.priority === 'high') {
          parts.push('High priority');
        }
      }

      return {
        ...task,
        message: parts.length ? parts.join(' | ') : 'No urgent conditions',
        id: task._id
      };
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ---------------------- PrioritySchudeling Algorithm End ---------------





// ---------------------- Overview ---------------
function groupMonthlyData(transactions) {
  const monthlyData = {};
  transactions.forEach(tx => {
    const date = new Date(tx.createdDate);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expenses: 0 };

    if (tx.type === 'income') monthlyData[month].income += tx.amount;
    if (tx.type === 'expense') monthlyData[month].expenses += tx.amount;
  });

  return Object.entries(monthlyData).map(([month, { income, expenses }]) => ({
    month, income, expenses
  }));
}

function groupByCategory(transactions) {
  const map = new Map();
  transactions.forEach(tx => {
    if (!map.has(tx.category)) {
      map.set(tx.category, { name: tx.category, value: 0 });
    }
    map.get(tx.category).value += tx.amount;
  });

  const colors = [
    "#4285F4", "#FF6D01", "#EA4335", "#9C27B0", "#34A853",
    "#FF9800", "#AB47BC", "#5E97F6", "#00ACC1", "#9E9E9E",
  ];

  return Array.from(map.entries()).map(([name, data], idx) => ({
    ...data,
    color: colors[idx % colors.length],
  }));
}

function calcGrowth(current, previous) {
  if (previous === 0 && current > 0) return 100;
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

router.get('/overview/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId });
    const project = await Project.findById(projectId);
    const transactions = await Transaction.find({ projectId, status: 'approved' });

    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      inProgress: tasks.filter(t => t.status === 'IN PROGRESS').length,
      onHold: tasks.filter(t => t.status === 'ON HOLD').length,
      toDo: tasks.filter(t => t.status === 'TO DO').length,
      priority: {
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'normal').length,
        low: tasks.filter(t => t.priority === 'low').length,
      },
    };

    let totalSubtasks = 0;
    let completedSubtasks = 0;
    tasks.forEach(task => {
      task.subtasks.forEach(sub => {
        totalSubtasks++;
        if (sub.completed) completedSubtasks++;
      });
    });

    const completion = totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

    const deadline = project.dueDate;
    const daysLeft = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

    const projects = {
      status: completion >= 100 ? "Completed" : "In Progress",
      completion,
      deadline,
      daysLeft,
    };

    // Finance Summary
    const incomes = transactions.filter(tx => tx.type === 'income');
    const expenses = transactions.filter(tx => tx.type === 'expense');

    const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
    const totalExpenses = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    const balance = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

    // Monthly Trends
    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
    const monthlyData = groupMonthlyData(sortedTransactions);

    // Growth Calculations
    const lastMonth = monthlyData[monthlyData.length - 1] || { income: 0, expenses: 0 };
    const prevMonth = monthlyData[monthlyData.length - 2] || { income: 0, expenses: 0 };

    const incomeGrowth = calcGrowth(lastMonth.income, prevMonth.income);
    const expensesGrowth = calcGrowth(lastMonth.expenses, prevMonth.expenses);
    const balanceGrowth = calcGrowth(
      lastMonth.income - lastMonth.expenses,
      prevMonth.income - prevMonth.expenses
    );

    const profitMarginGrowth = calcGrowth(
      lastMonth.income > 0 ? ((lastMonth.income - lastMonth.expenses) / lastMonth.income) * 100 : 0,
      prevMonth.income > 0 ? ((prevMonth.income - prevMonth.expenses) / prevMonth.income) * 100 : 0
    );

    // Prediction
    let predicted = null;
    if (monthlyData.length >= 2) {
      const predictedIncome = weightedLinearRegression(monthlyData, 'income');
      const predictedExpenses = weightedLinearRegression(monthlyData, 'expenses');

      const lastMonthDate = new Date();
      lastMonthDate.setMonth(lastMonthDate.getMonth() + 1);
      const nextMonth = lastMonthDate.toLocaleString('default', { month: 'short', year: 'numeric' });

      predicted = {
        month: nextMonth,
        income: predictedIncome,
        expenses: predictedExpenses,
        predicted: true,
      };

      monthlyData.push(predicted);
    }

    const finances = {
      totalIncome,
      totalExpenses,
      balance,
      profitMargin,
      incomeGrowth,
      expensesGrowth,
      balanceGrowth,
      profitMarginGrowth,
      monthlyData,
      incomeExpensesTrend: monthlyData,
      expenseCategories: groupByCategory(expenses),
      incomeCategories: groupByCategory(incomes),
    };

    res.json({ tasks: taskStats, projects, finances });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
});




//get project detail overview
router.get('/overview/projectdetail/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const projectDetails = await Project.findById(id)
  
    return res.status(200).json(projectDetails);
  } catch (error) {
    console.error("Deletion error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});



//edit project details
router.put('/overview/projectdetail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, dueDate } = req.body;

    if (!description || !dueDate) {
      return res.status(400).json({ message: "Description and due date are required." });
    }

    const projectDetails = await Project.findByIdAndUpdate(
      id,
      { description, dueDate },
      { new: true }
    );

    if (!projectDetails) {
      return res.status(404).json({ message: "Project not found." });
    }

    return res.status(200).json(projectDetails);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});




//delete project
router.delete('/overview/projectdetail/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const tasksToDelete = await Task.find({ projectId: id });

   
    await Promise.all(tasksToDelete.map(task => Task.findByIdAndDelete(task._id)));

    await Project.findByIdAndDelete(id);

    return res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("Deletion error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});





// ---------------------- Overview End ---------------














module.exports = router