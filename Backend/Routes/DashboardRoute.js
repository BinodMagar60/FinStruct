const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const Transaction = require("../models/Transactions");
const User = require("../models/User");
const Company = require("../models/Company");

//to get first part of the dashbaord
router.get("/first/:companyId", async (req, res) => {
  const { companyId } = req.params;

  try {
    const [projects, users, transactions, tasks] = await Promise.all([
      Project.find({ companyId }),
      User.find({ companyId }),
      Transaction.find({ companyId }),
      Task.find({
        projectId: { $in: await Project.find({ companyId }).distinct("_id") },
      }),
    ]);

    const totalProjects = projects.length;

    let completedProjects = 0;
    for (const project of projects) {
      const projectTasks = tasks.filter(
        (t) => t.projectId.toString() === project._id.toString()
      );
      const allSubtasks = projectTasks.flatMap((t) => t.subtasks || []);
      const allMain = allSubtasks.filter((st) => st.isMainSubtask);
      const completedMain = allMain.filter((st) => st.completed);
      if (allMain.length > 0 && allMain.length === completedMain.length) {
        completedProjects++;
      }
    }

    const incompleteProjects = totalProjects - completedProjects;

    const totalBudget = transactions.reduce((acc, t) => acc + t.amount, 0);

    const incomeTransactions = transactions.filter((t) => t.type === "income");
    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense"
    );

    const totalIncome = incomeTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );
    const totalExpenseTransactions = expenseTransactions.reduce(
      (acc, t) => acc + t.amount,
      0
    );

    const now = new Date();
    const salaryExpenses = users.reduce((acc, user) => {
      if (!user.salary || !user.createdAt) return acc;
      const joined = new Date(user.createdAt);
      const now = new Date();

      let monthsWorked =
        (now.getFullYear() - joined.getFullYear()) * 12 +
        (now.getMonth() - joined.getMonth() + 1);

      monthsWorked = Math.max(0, monthsWorked);
      // console.log(monthsWorked)
      return acc + monthsWorked * user.salary;
    }, 0);

    const totalExpenses = totalExpenseTransactions + salaryExpenses;

    const teamMembers = users.length;
    const managers = users.filter((u) => u.role === "admin").length;
    const workers = users.filter((u) => u.role === "worker").length;
    const engineers = users.filter((u) => u.role === "employee").length;

    const progress =
      tasks.length > 0
        ? Math.round(
            (tasks.reduce((sum, task) => {
              const subtasks = task.subtasks || [];
              const mainSubtasks = subtasks.filter((st) => st.isMainSubtask);
              if (mainSubtasks.length === 0) return sum;
              const completed = mainSubtasks.filter(
                (st) => st.completed
              ).length;
              return sum + completed / mainSubtasks.length;
            }, 0) /
              tasks.length) *
              100
          )
        : 0;

    const spent =
      totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
    const roi =
      totalExpenses > 0
        ? Math.round(
            ((totalIncome - totalExpenses) /
              (totalIncome > totalExpenses ? totalIncome : totalExpenses)) *
              100
          )
        : 0;

    const dashboardData = {
      totalProjects,
      totalBudget,
      revenue: totalIncome - totalExpenses,
      teamMembers,
      progress,
      spent,
      roi,
      managers,
      workers,
      engineers,
      completedProjects,
      incompleteProjects,
      totalIncome,
      totalExpenses,
    };

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});








//Finance part
const monthName = (i) =>
  new Date(2000, i, 1).toLocaleString("default", { month: "short" });


const getRandomColor = () => {
  const colors = [
    "#4C51BF",
    "#48BB78",
    "#F6AD55",
    "#F56565",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#6B46C1",
    "#4299E1",
    "#ED8936",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};


router.get("/financialsummary/:companyId", async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.params.companyId);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); 

    
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ message: "Company not found" });

    const companyCreatedAt = new Date(company.createdAt);
    const companyStartMonth =
      companyCreatedAt.getFullYear() === currentYear
        ? companyCreatedAt.getMonth()
        : 0;

    
    const [transactions, users] = await Promise.all([
      Transaction.find({ companyId }),
      User.find({ companyId }),
    ]);

    
    const fullMonthlyData = Array.from({ length: 12 }, (_, i) => ({
      name: monthName(i),
      Income: 0,
      Expenses: 0,
    }));

    const incomeByCategory = {};
    const expenseByCategory = {};

    
    transactions.forEach((tx) => {
      const txDate = new Date(tx.createdDate);
      const txMonth = txDate.getMonth();

      if (tx.type === "income") {
        fullMonthlyData[txMonth].Income += tx.amount;
        incomeByCategory[tx.category] =
          (incomeByCategory[tx.category] || 0) + tx.amount;
      } else if (tx.type === "expense") {
        fullMonthlyData[txMonth].Expenses += tx.amount;
        expenseByCategory[tx.category] =
          (expenseByCategory[tx.category] || 0) + tx.amount;
      }
    });

    // Add salaries to each month
    users.forEach((user) => {
      if (!user.salary) return;

      const createdAt = new Date(user.createdAt);
      const startMonth =
        createdAt.getFullYear() === currentYear
          ? createdAt.getMonth()
          : 0;

      for (let i = startMonth; i <= currentMonth; i++) {
        fullMonthlyData[i].Expenses += user.salary;
      }

      const salaryMonths = Math.max(0, currentMonth - startMonth + 1);
      expenseByCategory["Salary"] =
        (expenseByCategory["Salary"] || 0) + user.salary * salaryMonths;
    });

    // Slice the data only from company creation month to current
    const monthlyData = fullMonthlyData.slice(companyStartMonth, currentMonth + 1);

    // Format income/expense 
    const incomeData = Object.entries(incomeByCategory).map(
      ([name, value]) => ({
        name,
        value,
        color: getRandomColor(),
      })
    );

    const expenseData = Object.entries(expenseByCategory).map(
      ([name, value]) => ({
        name,
        value,
        color: getRandomColor(),
      })
    );

    
    res.json({
      incomeData,
      expenseData,
      monthlyData,
      trendData: monthlyData, 
    });

  } catch (err) {
    res.status(500).json({err});
  }
});












//Projects detail
router.get('/projectstatus/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ message: 'companyId is required in params' });
    }

    const projects = await Project.find({ companyId });
    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } });

    const result = projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId.toString() === project._id.toString());

      let totalSubtasks = 0;
      let completedSubtasks = 0;

      projectTasks.forEach(task => {
        task.subtasks.forEach(subtask => {
          totalSubtasks += 1;
          if (subtask.completed) completedSubtasks += 1;
        });
      });

      const progress = totalSubtasks > 0
        ? Math.round((completedSubtasks / totalSubtasks) * 100)
        : 0;

      const now = new Date();
      let status = 'Not Started';
      let statusColor = 'bg-gray-500';

      if (totalSubtasks === 0) {
        status = 'Not Started';
        statusColor = 'bg-gray-500';
      } else if (progress === 100) {
        status = 'Completed';
        statusColor = 'bg-green-500';
      } else if (new Date(project.dueDate) < now) {
        status = 'Delayed';
        statusColor = 'bg-red-500';
      } else {
        status = 'In Progress';
        statusColor = 'bg-yellow-500';
      }

      return {
        name: project.projectName,
        progress,
        status,
        statusColor,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('Error generating project status:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});







//get team members 
router.get('/teammembers/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({ message: 'companyId param is required' });
    }

    const users = await User.find({
      companyId,
      role: { $ne: 'worker' },
    }).populate('jobTitleId');

    const teamMembers = users.map(user => ({
      id: user._id,
      name: user.username,
      role: user.jobTitleId?.titleName || 'Unknown Role',
      avatar: user.photo,
      userrole: user.role,
    }));

    res.json(teamMembers);
  } catch (err) {
    console.error('Error fetching team members:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});





module.exports = router;
