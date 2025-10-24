"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  AreaChart,
  Area,
} from "recharts";
import { getFinancialPart, getProjectParts, getTopPartData, getUserParts } from "../../../api/DashbaordApi";
import Loading from '../../../Components/Loading'
import { getInitials } from "../../../utils/getInitials";

export default function Dashboard() {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));

  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [showMonthlyDetails, setShowMonthlyDetails] = useState(false);
  const [activeProjectView, setActiveProjectView] = useState(false);
  const [activeTeamView, setActiveTeamView] = useState(false);
  const [showIncomeDetails, setShowIncomeDetails] = useState(false);
  const [isLoading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null);
  const [projectCompletionData, setProjectCompletionData] = useState([]);
  const [totalFinancialData, setTotalFinancialData] = useState([]);
  const [incomeData, setIncomeData] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [trendData, setTrendData] = useState([])
  const [activeProjects, setActiveProject] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  useEffect(() => {
    const getFirstData = async () => {
      try {
        const response = await getTopPartData(locallySavedUser.companyId);
        const financialResponse = await getFinancialPart(locallySavedUser.companyId)
        const projectResponse = await getProjectParts(locallySavedUser.companyId)
        const usersResponse = await getUserParts(locallySavedUser.companyId)
        setTeamMembers(usersResponse)
        setActiveProject(projectResponse)
        setDashboardData(response);
        setProjectCompletionData([
          {
            name: "Completed",
            value: response.completedProjects,
            color: "#4C51BF",
          },
          {
            name: "Incomplete",
            value: response.incompleteProjects,
            color: "#F56565",
          },
        ]);
        setTotalFinancialData([
          {
            name: "Income",
            value: response.totalIncome,
            color: "#4C51BF",
          },
          {
            name: "Expenses",
            value: response.totalExpenses,
            color: "#F56565",
          },
        ]);
        setIncomeData(financialResponse.incomeData)
        setExpenseData(financialResponse.expenseData)
        setMonthlyData(financialResponse.monthlyData)
        setTrendData(financialResponse.trendData)
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
      finally{
        setLoading(false)
      }
    };

    getFirstData();
  }, []);


  

  


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const toggleExpenseDetails = () => {
    setShowExpenseDetails(!showExpenseDetails);
  };

  const toggleMonthlyDetails = () => {
    setShowMonthlyDetails(!showMonthlyDetails);
  };

  const toggleActiveProjectView = () => {
    setActiveProjectView(!activeProjectView);
  };

  const toggleActiveTeamView = () => {
    setActiveTeamView(!activeTeamView);
  };

  const toggleIncomeDetails = () => {
    setShowIncomeDetails(!showIncomeDetails);
  };

  return (
    <div className="">
      <div className="bg-white rounded shadow-md p-4 pb-8">
        {
          isLoading? <Loading/> : (
            <>
            {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Summary Cards - First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Projects</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {dashboardData.totalProjects}
                </h2>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">Project Completion</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${dashboardData.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-sm text-gray-500">
                {dashboardData.progress}%
              </span>
            </div>
          </div>

          {/* Total Budget */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Income</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {formatCurrency(dashboardData.totalIncome)}
                </h2>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">Spent</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${dashboardData.spent}%` }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-sm text-gray-500">
                {dashboardData.spent}%
              </span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Total Profit</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {formatCurrency(dashboardData.revenue)}
                </h2>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">{dashboardData.roi < 0? "Loss" : "Profit"}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full"
                style={{ width: `${Math.abs(dashboardData.roi)}%` }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-sm text-gray-500">
                {Math.abs(dashboardData.roi)}%
              </span>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Team Members</p>
                <h2 className="text-3xl font-bold text-gray-800">
                  {dashboardData.teamMembers}
                </h2>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm text-gray-500">Admins</p>
                <p className="text-xl font-semibold">
                  {dashboardData.managers}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Users</p>
                <p className="text-xl font-semibold">{dashboardData.workers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Workers</p>
                <p className="text-xl font-semibold">
                  {dashboardData.engineers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Completion and Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Project Completion Status */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Project Completion Status
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectCompletionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {projectCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-xl font-semibold text-blue-600">
                  {dashboardData.completedProjects}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.round(
                    (dashboardData.completedProjects /
                      dashboardData.totalProjects) *
                      100
                  )}
                  %
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Incomplete</p>
                <p className="text-xl font-semibold text-red-600">
                  {dashboardData.incompleteProjects}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.round(
                    (dashboardData.incompleteProjects /
                      dashboardData.totalProjects) *
                      100
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Total Income vs Expenses */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Total Income vs Expenses
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={totalFinancialData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {totalFinancialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total Income</p>
                <p className="text-xl font-semibold text-blue-600">
                  {formatCurrency(dashboardData.totalIncome)}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total Expenses</p>
                <p className="text-xl font-semibold text-red-600">
                  {formatCurrency(dashboardData.totalExpenses)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expense and Income Breakdown Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense Breakdown */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Expense Breakdown</h3>
              <button
                onClick={toggleExpenseDetails}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Details
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={false} // Removed labels as requested
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {showExpenseDetails && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Expense Details
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenseData.map((item) => (
                        <tr key={item.name}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.value)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {((item.value/dashboardData.totalExpenses)*100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Income Breakdown */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Income Breakdown</h3>
              <button
                onClick={toggleIncomeDetails}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Details
              </button>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {incomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {showIncomeDetails && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Income Details
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {incomeData.map((item) => (
                        <tr key={item.name}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(item.value)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {((item.value/dashboardData.totalIncome)*100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Income & Expenses */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Monthly Income & Expenses
              </h3>
              <button
                onClick={toggleMonthlyDetails}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Details
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="Income" fill="#4C51BF" />
                  <Bar dataKey="Expenses" fill="#F56565" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {showMonthlyDetails && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">
                  Monthly Breakdown
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Income
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expenses
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Profit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Margin
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlyData.map((item) => {
                        const profit = item.Income - item.Expenses;
                        const margin = Math.round((profit / item.Income) * 100);
                        return (
                          <tr key={item.name}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(item.Income)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(item.Expenses)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(profit)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {margin}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

       {/* Income & Expenses Trend */}
<div className="mb-8">
  <div className="bg-white rounded-xl shadow p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-gray-800">
        Income & Expenses Trend
      </h3>
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Area
            type="monotone"
            dataKey="Income"
            stroke="#4C51BF"
            fill="#4C51BF"
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            dataKey="Expenses"
            stroke="#F56565"
            fill="#F56565"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

        {/* Projects and Team Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Active Projects</h3>
              {activeProjects.length > 4 && (
                <button
                  onClick={toggleActiveProjectView}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {activeProjectView ? "Show Less" : "View All"}
                </button>
              )}
            </div>
            <div className="space-y-4">
              {(activeProjectView
                ? activeProjects
                : activeProjects.slice(0, 4)
              ).map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-800">
                      {project.name}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${project.statusColor}`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        project.statusColor}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-sm text-gray-500">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Team Members</h3>
              {teamMembers.length > 6 && (
                <button
                  onClick={toggleActiveTeamView}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {activeTeamView ? "Show Less" : "View All"}
                </button>
              )}
            </div>
            <div className="space-y-4">
              {(activeTeamView ? teamMembers : teamMembers.slice(0, 7)).map(
                (member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center">
                      {
                        member.avatar? (<img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full bg-gray-200 mr-3"
                      /> ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 mr-3 text-white flex justify-center items-center">
                          <span>{getInitials(member.name)}</span>
                        </div>
                      )
                      }
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {member.name}
                        </h4>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="capitalize text-gray-700">
                        {member.userrole}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
            </>
          )
        }
      </div>
    </div>
  );
}
