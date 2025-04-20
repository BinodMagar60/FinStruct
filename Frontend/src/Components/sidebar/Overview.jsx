import { useState } from "react"
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
} from "./ui/chart"
import { TrendingUp, TrendingDown } from "lucide-react"

// Add this after the imports
const chartContainerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
}

// Add CSS to prevent focus/active styling on chart elements
const pieChartStyle = {
  pointerEvents: "all", // Allow tooltip interactions
  outline: "none",
  userSelect: "none",
}

// Add this helper function after the imports and before the Dashboard component
const calculateTotal = (data) => {
  return data.reduce((sum, item) => sum + item.value, 0)
}

export default function Overview() {
  // Sample data - in a real app, this would come from an API
  const [data, setData] = useState({
    tasks: {
      total: 39,
      completed: 15,
      inProgress: 8,
      onHold: 4,
      toDo: 12,
      priority: {
        high: 8,
        medium: 14,
        low: 17,
      },
    },
    projects: {
      status: "In Progress", // "Not Started", "In Progress", "Completed"
      completion: 65, // percentage
      deadline: "2023-12-31",
      daysLeft: 45,
    },
    finances: {
      totalIncome: 25000,
      totalExpenses: 8750,
      balance: 16250,
      profitMargin: 65,
      incomeGrowth: 15,
      expensesGrowth: -3,
      balanceGrowth: 25,
      profitMarginGrowth: 5,
      monthlyData: [
        { month: "Jan", income: 5000, expenses: 1200 },
        { month: "Feb", income: 5500, expenses: 1500 },
        { month: "Mar", income: 6000, expenses: 1000 },
        { month: "Apr", income: 7000, expenses: 2000 },
        { month: "May", income: 7500, expenses: 1800 },
        { month: "Jun", income: 8000, expenses: 1250 },
      ],
      expenseCategories: [
        { name: "Materials", value: 2800, color: "#4285F4" },
        { name: "Labor", value: 6200, color: "#FF6D01" },
        { name: "Subcontractors", value: 3500, color: "#EA4335" },
        { name: "Equipment Rental", value: 1200, color: "#9C27B0" },
        { name: "Permits & Fees", value: 950, color: "#34A853" },
        { name: "Site Utilities", value: 1100, color: "#FF9800" },
        { name: "Tools", value: 800, color: "#AB47BC" },
        { name: "Transportation", value: 750, color: "#5E97F6" },
        { name: "Insurance", value: 1200, color: "#00ACC1" },
        { name: "Other Expenses", value: 500, color: "#9E9E9E" },
      ],
      incomeCategories: [
        { name: "Client Payment", value: 18000, color: "#34A853" },
        { name: "Change Order", value: 3500, color: "#4285F4" },
        { name: "Financing", value: 2000, color: "#FF6D01" },
        { name: "Rebates", value: 800, color: "#9C27B0" },
        { name: "Other Income", value: 700, color: "#9E9E9E" },
      ],
      incomeExpensesTrend: [
        { month: "Jan", income: 12000, expenses: 7500 },
        { month: "Feb", income: 14000, expenses: 7800 },
        { month: "Mar", income: 18000, expenses: 8200 },
        { month: "Apr", income: 25000, expenses: 8500 },
      ],
    },
  })

  // Task status data for pie chart
  const taskStatusData = [
    { name: "To Do", value: data.tasks.toDo, color: "#4285F4" },
    { name: "In Progress", value: data.tasks.inProgress, color: "#FF6D01" },
    { name: "Completed", value: data.tasks.completed, color: "#34A853" },
    { name: "On Hold", value: data.tasks.onHold, color: "#EA4335" },
  ]

  // Task priority data for bar chart
  const taskPriorityData = [
    { priority: "High", tasks: data.tasks.priority.high, color: "#EA4335" },
    { priority: "Medium", tasks: data.tasks.priority.medium, color: "#FF6D01" },
    { priority: "Low", tasks: data.tasks.priority.low, color: "#34A853" },
  ]

  // Custom legend renderer for pie charts
  const renderCustomLegend = (props) => {
    const { payload } = props

    return (
      <ul className="flex flex-col gap-2 list-none pl-0">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            <span className="text-sm">
              {entry.payload.name} {entry.payload.value}
            </span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Project Overview</h1>
        <p className="text-gray-500">Dashboard and statistics</p>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="rounded-xl border border-gray-100 shadow-md p-6 transition-all hover:shadow-lg bg-blue-50">
          <p className="text-blue-600 text-sm font-medium mb-3">Total Tasks</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">{data.tasks.total}</h2>
          <p className="text-gray-500 text-xs">All project tasks</p>
        </div>

        <div className="rounded-xl border border-gray-100 shadow-md p-6 transition-all hover:shadow-lg bg-green-50">
          <p className="text-green-600 text-sm font-medium mb-3">Completed Tasks</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">{data.tasks.completed}</h2>
          <p className="text-gray-500 text-xs">Tasks finished successfully</p>
        </div>

        <div className="rounded-xl border border-gray-100 shadow-md p-6 transition-all hover:shadow-lg bg-orange-50">
          <p className="text-orange-600 text-sm font-medium mb-3">In Progress</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">{data.tasks.inProgress}</h2>
          <p className="text-gray-500 text-xs">Tasks currently active</p>
        </div>

        <div className="rounded-xl border border-gray-100 shadow-md p-6 transition-all hover:shadow-lg bg-red-50">
          <p className="text-red-600 text-sm font-medium mb-3">On Hold</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-1">{data.tasks.onHold}</h2>
          <p className="text-gray-500 text-xs">Tasks temporarily paused</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Task Distribution</h2>
          <div className="h-64 flex items-center">
            <div style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={pieChartStyle}>
                  <Tooltip
                    formatter={(value, name) => {
                      const total = taskStatusData.reduce((sum, item) => sum + item.value, 0)
                      const percentage = ((value / total) * 100).toFixed(1)
                      return [`${value} (${percentage}%)`, name]
                    }}
                  />
                  <Pie
                    data={taskStatusData}
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
                  <Legend layout="vertical" verticalAlign="middle" align="right" content={renderCustomLegend} />
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
              <span className="text-sm font-medium text-gray-700">Completion</span>
              <span className="text-sm font-medium text-gray-700">{data.projects.completion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${data.projects.completion}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Status</p>
              <p className="font-semibold text-blue-600">{data.projects.status}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Days Left</p>
              <p className="font-semibold text-blue-600">{data.projects.daysLeft}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Priority Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Task Priority Distribution</h2>
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

      {/* Financial Summary */}
      <div className="flex flex-col gap-6 mb-6">
        {/* Budget Overview */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-blue-600 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">${data.finances.totalIncome.toLocaleString()}</p>
              <div className="flex items-center text-sm mt-1">
                <span
                  className={`flex items-center ${data.finances.incomeGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {data.finances.incomeGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {data.finances.incomeGrowth >= 0 ? "+" : ""}
                  {data.finances.incomeGrowth}%
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-red-500 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">${data.finances.totalExpenses.toLocaleString()}</p>
              <div className="flex items-center text-sm mt-1">
                <span
                  className={`flex items-center ${data.finances.expensesGrowth <= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {data.finances.expensesGrowth <= 0 ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {data.finances.expensesGrowth >= 0 ? "+" : ""}
                  {data.finances.expensesGrowth}%
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-green-600 text-sm font-medium">Balance</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">${data.finances.balance.toLocaleString()}</p>
              <div className="flex items-center text-sm mt-1">
                <span
                  className={`flex items-center ${data.finances.balanceGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {data.finances.balanceGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {data.finances.balanceGrowth >= 0 ? "+" : ""}
                  {data.finances.balanceGrowth}%
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-600 text-sm font-medium">Profit Margin</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{data.finances.profitMargin}%</p>
              <div className="flex items-center text-sm mt-1">
                <span
                  className={`flex items-center ${data.finances.profitMarginGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {data.finances.profitMarginGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {data.finances.profitMarginGrowth >= 0 ? "+" : ""}
                  {data.finances.profitMarginGrowth}%
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Categories */}
            <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
              <h3 className="text-md font-semibold mb-4">Expense Categories</h3>
              <div className="h-80">
                <div style={chartContainerStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart style={pieChartStyle}>
                      <Tooltip
                        formatter={(value, name) => {
                          const total = data.finances.expenseCategories.reduce((sum, item) => sum + item.value, 0)
                          const percentage = ((value / total) * 100).toFixed(1)
                          return [`$${value.toLocaleString()} (${percentage}%)`, name]
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
                        {data.finances.expenseCategories.map((entry, index) => (
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
                        content={(props) => {
                          const { payload } = props
                          return (
                            <ul className="flex flex-col gap-1 list-none pl-0 text-xs">
                              {payload.map((entry, index) => (
                                <li key={`item-${index}`} className="flex items-center">
                                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                                  <span>
                                    {entry.payload.name} ${entry.payload.value}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Income Categories */}
            <div className="bg-white rounded-lg shadow border border-gray-100 p-6">
              <h3 className="text-md font-semibold mb-4">Income Categories</h3>
              <div className="h-80">
                <div style={chartContainerStyle}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart style={pieChartStyle}>
                      <Tooltip
                        formatter={(value, name) => {
                          const total = data.finances.incomeCategories.reduce((sum, item) => sum + item.value, 0)
                          const percentage = ((value / total) * 100).toFixed(1)
                          return [`$${value.toLocaleString()} (${percentage}%)`, name]
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
                        {data.finances.incomeCategories.map((entry, index) => (
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
                        content={(props) => {
                          const { payload } = props
                          return (
                            <ul className="flex flex-col gap-1 list-none pl-0 text-xs">
                              {payload.map((entry, index) => (
                                <li key={`item-${index}`} className="flex items-center">
                                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                                  <span>
                                    {entry.payload.name} ${entry.payload.value}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Income & Expenses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Income & Expenses</h2>
          <div className="h-64">
            <div style={chartContainerStyle}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.finances.monthlyData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `${value}`}
                    position={{ x: 0, y: 0 }}
                    wrapperStyle={{ pointerEvents: "none" }}
                    cursor={{ strokeDasharray: "3 3" }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#4285F4" name="Income" />
                  <Bar dataKey="expenses" fill="#EA4335" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Income & Expenses Trend */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Income & Expenses Trend</h2>
        <div className="h-64">
          <div style={chartContainerStyle}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.finances.incomeExpensesTrend}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value}`}
                  position={{ x: 0, y: 0 }}
                  wrapperStyle={{ pointerEvents: "none" }}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stackId="1"
                  stroke="#4285F4"
                  fill="#4285F4"
                  fillOpacity={0.6}
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stackId="1"
                  stroke="#EA4335"
                  fill="#EA4335"
                  fillOpacity={0.6}
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
