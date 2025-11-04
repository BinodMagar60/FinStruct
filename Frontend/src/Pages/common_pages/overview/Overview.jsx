import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "../../../Components/chart";
import Loading from "../../../Components/Loading";
import {
  deleteProjectDetailInOverview,
  getOverViewData,
  getProjectDetailInOverview,
  updateProjectDetailInOverview,
} from "../../../api/ProjectApi";
import { formatDateToReadable } from "../../../utils/formateDates";
import { useNavigate } from "react-router-dom";

// Add this after the imports
const chartContainerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
};

//stylin for piechart (css)
const pieChartStyle = {
  pointerEvents: "all",
  outline: "none",
  userSelect: "none",
};

export default function Overview() {
  const locallySavedProject = localStorage.getItem("projectId");
  const user = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();
  //sample data for noww
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [change, setChange] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    const getDatasOverview = async () => {
      try {
        const response = await getOverViewData(locallySavedProject);
        setData(response);

        const response2 = await getProjectDetailInOverview(locallySavedProject);
        // console.log(response2)
        setProjectDetails({
          title: response2.projectName,
          description: response2.description,
          dueDate: response2.dueDate,
        });
      } catch (error) {
        console.error("Failed to fetch overview data", error);
      } finally {
        setLoading(false);
      }
    };
    getDatasOverview();
  }, [change]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Save project details
  const saveProjectDetails = async () => {
    try {
      const response = await updateProjectDetailInOverview(
        locallySavedProject,
        projectDetails
      );
      // console.log(response)
      setChange((prev) => !prev);
    } catch (error) {
      console.log(error);
    }

    setIsEditing(false);
  };

  // Cancel editing and revert changes
  const cancelEdit = () => {
    const getDatasOverview = async () => {
      try {
        const response2 = await getProjectDetailInOverview(locallySavedProject);
        setProjectDetails({
          title: response2.projectName,
          description: response2.description,
          dueDate: response2.dueDate,
        });
      } catch (error) {
        console.error("Failed to fetch project details", error);
      }
    };
    getDatasOverview();
    setIsEditing(false);
  };

  // State for delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleDeleteConfirm = () => {
    setShowDeleteConfirm(!showDeleteConfirm);
  };

  const handleDeleteProject = () => {
    toggleDeleteConfirm();
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      const response = await deleteProjectDetailInOverview(locallySavedProject);
      localStorage.removeItem("projectId");
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/");

      toggleDeleteConfirm();
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Invalid date format:", error);
      return "";
    }
  };

  if (isLoading || !data) {
    return (
      <div className="">
        <div className="container mx-auto p-4 bg-white pb-8 rounded">
          <Loading />
        </div>
      </div>
    );
  }

  // pie chart status datas
  const taskStatusData = [
    { name: "To Do", value: data.tasks.toDo, color: "#4285F4" },
    { name: "In Progress", value: data.tasks.inProgress, color: "#FF6D01" },
    { name: "Completed", value: data.tasks.completed, color: "#34A853" },
    { name: "On Hold", value: data.tasks.onHold, color: "#EA4335" },
  ];

  // for priority chart
  const taskPriorityData = [
    { priority: "High", tasks: data.tasks.priority.high, color: "#EA4335" },
    { priority: "Medium", tasks: data.tasks.priority.medium, color: "#FF6D01" },
    { priority: "Low", tasks: data.tasks.priority.low, color: "#34A853" },
  ];

  const renderCustomLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex flex-col gap-2 list-none pl-0">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.payload.name}: Rs. {entry.payload.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const renderCustomLegendTask = (props) => {
    const { payload } = props;

    return (
      <ul className="flex flex-col gap-2 list-none pl-0">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.payload.name}: {entry.payload.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="">
      <div className="container mx-auto p-4 bg-white pb-8 rounded">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold ">Project Overview</h1>
            </div>

            {/* Top part */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="rounded-xl border border-gray-100 p-6 transition-all bg-blue-50">
                <p className="text-blue-600 text-sm font-medium mb-3">
                  Total Tasks
                </p>
                <h2 className="text-4xl font-bold text-gray-800 mb-1">
                  {data.tasks.total}
                </h2>
                <p className="text-gray-500 text-xs">All project tasks</p>
              </div>

              <div className="rounded-xl border border-gray-100 p-6 transition-all bg-green-50">
                <p className="text-green-600 text-sm font-medium mb-3">
                  Completed Tasks
                </p>
                <h2 className="text-4xl font-bold text-gray-800 mb-1">
                  {data.tasks.completed}
                </h2>
                <p className="text-gray-500 text-xs">
                  Tasks finished successfully
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-6 transition-all bg-orange-50">
                <p className="text-orange-600 text-sm font-medium mb-3">
                  In Progress
                </p>
                <h2 className="text-4xl font-bold text-gray-800 mb-1">
                  {data.tasks.inProgress}
                </h2>
                <p className="text-gray-500 text-xs">Tasks currently active</p>
              </div>

              <div className="rounded-xl border border-gray-100 p-6 transition-all bg-red-50">
                <p className="text-red-600 text-sm font-medium mb-3">On Hold</p>
                <h2 className="text-4xl font-bold text-gray-800 mb-1">
                  {data.tasks.onHold}
                </h2>
                <p className="text-gray-500 text-xs">
                  Tasks temporarily paused
                </p>
              </div>
            </div>

            {/* Task Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Task Status</h2>
                <div className="h-64 flex items-center">
                  <div style={chartContainerStyle}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart style={pieChartStyle}>
                        <Tooltip
                          formatter={(value, name) => {
                            const total = taskStatusData.reduce(
                              (sum, item) => sum + item.value,
                              0
                            );
                            const percentage = ((value / total) * 100).toFixed(
                              1
                            );
                            return [`${value} (${percentage}%)`, name];
                          }}
                        />
                        <Pie
                          data={taskStatusData}
                          cx="40%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          onClick={null}
                          activeIndex={[]}
                          activeShape={null}
                          tabIndex={-1}
                          focusable={false}
                          style={{ outline: "none" }}
                        >
                          {taskStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              style={{ outline: "none" }}
                              tabIndex={-1}
                              focusable={false}
                            />
                          ))}
                        </Pie>
                        <Legend
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          content={renderCustomLegendTask}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Project Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Project Status</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Completion
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {data.projects.completion}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-black h-2.5 rounded-full"
                      style={{ width: `${data.projects.completion}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-500 text-sm">Status</p>
                    <p className="font-semibold text-black">
                      {data.projects.status}
                    </p>
                  </div>
                  {data.projects.status !== "Completed" && (
                    <>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <p className="text-gray-500 text-sm">
                          {data.projects.daysLeft < 0
                            ? "Overdue By"
                            : "Days Left"}
                        </p>
                        <p
                          className={`font-semibold text-black ${
                            data.projects.daysLeft <= 5 ? "text-red-500" : ""
                          }`}
                        >
                          {Math.abs(data.projects.daysLeft)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Task Priority Distribution */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                Task Priority Distribution
              </h2>
              <div className="h-64">
                <div style={chartContainerStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={taskPriorityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="priority" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `${value} tasks`}
                        position={{ x: 0, y: 0 }}
                        wrapperStyle={{ pointerEvents: "none" }}
                        cursor={{ strokeDasharray: "3 3" }}
                      />
                      <Bar dataKey="tasks" name="Tasks">
                        {taskPriorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Financial Part*/}
            {user.role === "admin" && (
              <div className="flex flex-col gap-6 mb-6">
                {/* Budget Part*/}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Financial Summary
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-600 text-sm font-medium">
                        Total Income
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        Rs. {data.finances.totalIncome.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-red-500 text-sm font-medium">
                        Total Expenses
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        Rs. {data.finances.totalExpenses.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-green-600 text-sm font-medium">
                        Balance
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        Rs. {data.finances.balance.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-purple-600 text-sm font-medium">
                        Profit Margin
                      </p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">
                        {data.finances.profitMargin}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expense Pie chart*/}
                    <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
                      <h3 className="text-md font-semibold mb-4">
                        Expense Categories
                      </h3>
                      <div className="h-80">
                        <div style={chartContainerStyle}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart style={pieChartStyle}>
                              <Tooltip
                                formatter={(value, name) => {
                                  const total =
                                    data.finances.expenseCategories.reduce(
                                      (sum, item) => sum + item.value,
                                      0
                                    );
                                  const percentage = (
                                    (value / total) *
                                    100
                                  ).toFixed(1);
                                  return [
                                    `Rs. ${value.toLocaleString()} (${percentage}%)`,
                                    name,
                                  ];
                                }}
                              />
                              <Pie
                                data={data.finances.expenseCategories}
                                cx="40%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                isAnimationActive={false}
                                onClick={null}
                                activeIndex={[]}
                                activeShape={null}
                                tabIndex={-1}
                                focusable={false}
                                style={{ outline: "none" }}
                              >
                                {data.finances.expenseCategories.map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                      style={{ outline: "none" }}
                                      tabIndex={-1}
                                      focusable={false}
                                    />
                                  )
                                )}
                              </Pie>
                              <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                content={renderCustomLegend}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Income pie chart*/}
                    <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
                      <h3 className="text-md font-semibold mb-4">
                        Income Categories
                      </h3>
                      <div className="h-80">
                        <div style={chartContainerStyle}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart style={pieChartStyle}>
                              <Tooltip
                                formatter={(value, name) => {
                                  const total =
                                    data.finances.incomeCategories.reduce(
                                      (sum, item) => sum + item.value,
                                      0
                                    );
                                  const percentage = (
                                    (value / total) *
                                    100
                                  ).toFixed(1);
                                  return [
                                    `$${value.toLocaleString()} (${percentage}%)`,
                                    name,
                                  ];
                                }}
                              />
                              <Pie
                                data={data.finances.incomeCategories}
                                cx="40%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                isAnimationActive={false}
                                onClick={null}
                                activeIndex={[]}
                                activeShape={null}
                                tabIndex={-1}
                                focusable={false}
                                style={{ outline: "none" }}
                              >
                                {data.finances.incomeCategories.map(
                                  (entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                      style={{ outline: "none" }}
                                      tabIndex={-1}
                                      focusable={false}
                                    />
                                  )
                                )}
                              </Pie>
                              <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                content={renderCustomLegend}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Monthly Income & Expenses
                  </h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.finances.monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => `${value}`}
                          wrapperStyle={{ pointerEvents: "none" }}
                          cursor={{ strokeDasharray: "3 3" }}
                        />
                        <Legend
                          payload={[
                            {
                              value: "Income",
                              type: "square",
                              color: "#4285F4",
                            },
                            {
                              value: "Expenses",
                              type: "square",
                              color: "#EA4335",
                            },
                          ]}
                        />
                        <Bar
                          dataKey="income"
                          name="Income"
                          isAnimationActive={true}
                        >
                          {data.finances.monthlyData.map((entry, index) => (
                            <Cell
                              key={`cell-income-${index}`}
                              fill={entry.predicted ? "#a3c9f8" : "#4285F4"}
                            />
                          ))}
                        </Bar>
                        <Bar
                          dataKey="expenses"
                          name="Expenses"
                          isAnimationActive={true}
                        >
                          {data.finances.monthlyData.map((entry, index) => (
                            <Cell
                              key={`cell-expense-${index}`}
                              fill={entry.predicted ? "#f7a9a0" : "#EA4335"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Income/Expenses Trend Area Chart */}
            {user.role === "admin" && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  Income & Expenses Trend
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.finances.incomeExpensesTrend}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `${value}`}
                        wrapperStyle={{ pointerEvents: "none" }}
                        cursor={{ strokeDasharray: "3 3" }}
                      />
                      <Legend
                        payload={[
                          { value: "Income", type: "line", color: "#4285F4" },
                          { value: "Expenses", type: "line", color: "#EA4335" },
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#4285F4"
                        fill="#4285F4"
                        fillOpacity={0.3}
                        name="Income"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EA4335"
                        fill="#EA4335"
                        fillOpacity={0.3}
                        name="Expenses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Project Details Section */}
            {user.role === "admin" && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Project Details</h2>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={saveProjectDetails}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={toggleEdit}
                          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={handleDeleteProject}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="projectTitle"
                    >
                      Project Title
                    </label>
                    {isEditing ? (
                      <input
                        id="projectTitle"
                        name="title"
                        type="text"
                        value={projectDetails.title}
                        onChange={handleInputChange}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                        placeholder="Enter project title"
                      />
                    ) : (
                      <p
                        className={`px-3 py-2 bg-gray-50 rounded capitalize ${
                          projectDetails.title ? "" : "text-gray-400"
                        }`}
                      >
                        {projectDetails.title || "No title specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="projectDescription"
                    >
                      Project Description
                    </label>
                    {isEditing ? (
                      <textarea
                        id="projectDescription"
                        name="description"
                        value={projectDetails.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none min-h-32"
                        placeholder="Enter project description"
                        rows={4}
                      />
                    ) : (
                      <textarea
                        id="projectDescription"
                        name="description"
                        value={
                          projectDetails.description ||
                          "No description provided"
                        }
                        onChange={handleInputChange}
                        className={`w-full px-3 py-4 bg-gray-50 rounded ${
                          projectDetails.description ? "" : "text-gray-400"
                        }`}
                        disabled
                        rows={4}
                      />
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="projectDueDate"
                    >
                      Due Date
                    </label>
                    {isEditing ? (
                      <input
                        id="projectDueDate"
                        name="dueDate"
                        type="date"
                        value={formatDateForInput(projectDetails.dueDate)}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                      />
                    ) : (
                      <p
                        className={`px-3 py-2 bg-gray-50 rounded ${
                          projectDetails.dueDate ? "" : "text-gray-400"
                        }`}
                      >
                        {projectDetails.dueDate
                          ? formatDateToReadable(projectDetails.dueDate)
                          : "No due date set"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-[#00000012] bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Delete Project</h3>
                  <p className="mb-6">
                    Are you sure you want to delete this project? This action
                    cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={toggleDeleteConfirm}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                      No
                    </button>
                    <button
                      onClick={confirmDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
