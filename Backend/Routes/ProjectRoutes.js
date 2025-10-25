const express = require("express");
const router = express.Router();
const {
  addNewProject,
  getAllProjects,
  getAssignedUsers,
  addNewTask,
  getTasks,
  updateTasks,
  deleteTask,
  AddingSubtask,
  deleteSubtask,
  moveTask,
  updateGanttChart,
  updateDependencies,
  updateSubtasks,
  addComments,
  getTaskDetails,
  addImageAssets,
  deleteAssets,
  addNewTransaction,
  getAllTransactions,
  approveTheTransactions,
  rejectTheTransaction,
  getShortedTaskWithAlgo,
  getOverViewWithAlgo,
  getProjectDetailOverview,
  editProjectDetails,
  deleteProject,
} = require("../controllers/ProjectControllers");

// ---------------------- Project ---------------

//add new project
router.post("/project/:id", addNewProject);

//get all projects
router.get("/project/:id", getAllProjects);

// ---------------------- Project End ---------------

// ---------------------- Tasks ---------------

//get assignable users in tasks
router.get("/tasks/users/:id", getAssignedUsers);

//add new tasks
router.post("/tasks/task/:pid", addNewTask);

//get the tasks
router.get("/tasks/task/:pid", getTasks);

// Update Task
router.put("/tasks/task/:taskId", updateTasks);

//delete tasks
router.delete("/tasks/task/:id", deleteTask);

//adding subtask in task
router.post("/tasks/subtask/:taskId", AddingSubtask);

//deleting subtask in task
router.delete("/tasks/subtask/:taskId/:subtaskId", deleteSubtask);

//update task when moved from one to another column
router.put("/tasks/movetask", moveTask);

//update the date in gantt chart section
router.put("/tasks/ganttchart/dates/:id", updateGanttChart);

//update the dependencies  in gantt chart section
router.put("/tasks/ganttchart/dependencies/:id", updateDependencies);

// Update subtask
router.put("/tasks/subtask/:taskId/:subtaskId", updateSubtasks);

//add comments
router.post("/tasks/activity/:taskId", addComments);

//get task detils for taskDetails section
router.get("/tasks/taskdetails/:id", getTaskDetails);

//add image as assets
router.post("/tasks/addasset/:taskId", addImageAssets);

// delete assets
router.delete("/tasks/:taskId/delete-asset/:assetId", deleteAssets);

// ---------------------- Tasks End ---------------

// ---------------------- Transaction ---------------

router.post("/transactions/new", addNewTransaction);

// Get all transactions
router.get("/transactions/get/:pid", getAllTransactions);

// Approve a transaction
router.put("/transactions/approve/:id", approveTheTransactions);

// Reject a transaction (PATCH /api/transactions/:id/reject)
router.put("/transactions/reject/:id", rejectTheTransaction);

// ---------------------- Transactions End ---------------

// ---------------------- PrioritySchudeling Algorithm  ---------------

// Get sorted tasks with messages
router.get("/project/:projectId/sorted-tasks", getShortedTaskWithAlgo);

// ---------------------- PrioritySchudeling Algorithm End ---------------

// ---------------------- Overview ---------------

router.get("/overview/:projectId", getOverViewWithAlgo);

//get project detail overview
router.get("/overview/projectdetail/:id", getProjectDetailOverview);

//edit project details
router.put("/overview/projectdetail/:id", editProjectDetails);

//delete project
router.delete("/overview/projectdetail/:id", deleteProject);

// ---------------------- Overview End ---------------

module.exports = router;
