import { useState } from "react"
import { ChevronDown, ChevronUp, FileText, Paperclip, CheckSquare } from "lucide-react"
import { useTaskContext } from "../../context/taskContext"

const StaticListView = ({taskType}) => {
  const { columns, handleEditTask, handleDeleteTask, users, openTaskDetail } = useTaskContext()
  

  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")

 
  let selectedTasks = [];
  let selectedColumnId = null;

 const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));


if (taskType === "userAssigned") {
  const allTask = columns.flatMap((column) =>
    column.tasks.map((task) => ({ ...task, columnId: column.id }))
  );

  selectedTasks = allTask.filter((task) =>
    task.assignees.includes(locallySavedUser.id)
  );
} else if (taskType === "todo") {
  const selectedColumns = columns.filter((column) =>
    ["todo", "onhold"].includes(column.id)
  );

  selectedTasks = selectedColumns.flatMap((column) =>
    column.tasks.map((task) => ({ ...task, columnId: column.id }))
  );
} else {
  const selectedColumn = columns.find((column) => column.id === taskType);

  selectedTasks = selectedColumn
    ? selectedColumn.tasks.map((task) => ({
        ...task,
        columnId: selectedColumn.id,
      }))
    : [];
}

  
  // Apply sorting
  const sortedTasks = [...selectedTasks].sort((a, b) => {
    // Sort by title (case insensitive)
    if (sortField === "title") {
      return sortDirection === "asc"
        ? a.title.toLowerCase().localeCompare(b.title.toLowerCase())
        : b.title.toLowerCase().localeCompare(a.title.toLowerCase())
    }
    
    // Sort by priority
    if (sortField === "priority") {
      const priorityValues = { high: 3, normal: 2, low: 1 }
      const aValue = priorityValues[a.priority] || 0
      const bValue = priorityValues[b.priority] || 0
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }
    
    // Sort by creation date
    if (sortField === "createdAt") {
      return sortDirection === "asc" 
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    }
    
    return 0
  })

  // Helper function to toggle sort
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Check if there are no tasks to display
  const noTasksToShow = sortedTasks.length === 0

  // Helper to render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <ChevronDown size={14} className="text-gray-300" />
    return sortDirection === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  return (
    <div className="overflow-x-auto pt-4">
      {noTasksToShow ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm mt-2">Add a new task to get started</p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("title")}
              >
                <div className="flex items-center gap-1">
                  Task Title
                  {renderSortIcon("title")}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("priority")}
              >
                <div className="flex items-center gap-1">
                  Priority
                  {renderSortIcon("priority")}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("createdAt")}
              >
                <div className="flex items-center gap-1">
                  Created At
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Assets
              </th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Team
              </th>
              <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task) => {
              // Find assigned users
              const assignedUsers = task.assignees ? users.filter((user) => task.assignees.includes(user.id)) : []

              return (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {task.priority === "high" ? (
                        <span className="text-red-500">High Priority</span>
                      ) : task.priority === "normal" ? (
                        <span className="text-yellow-500">Normal Priority</span>
                      ) : (
                        <span className="text-green-500">Low Priority</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(task.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span>{task.activities?.length || 0}</span>
                        <FileText size={16} className="text-gray-400" />
                      </span>
                      <span className="flex items-center gap-1">
                        <span>{task.assets?.length || 0}</span>
                        <Paperclip size={16} className="text-gray-400" />
                      </span>
                      <span className="flex items-center gap-1">
                        <span>
                          {task.subtasks
                            ? `${task.subtasks.filter((s) => s.completed).length}/${task.subtasks.length}`
                            : "0/0"}
                        </span>
                        <CheckSquare size={16} className="text-gray-400" />
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex -space-x-2">
                      {assignedUsers.slice(0, 2).map((user) => (
                        <div
                          key={user.id}
                          className={`w-6 h-6 rounded-full ${user.color} text-white text-xs flex items-center justify-center border-2 border-white`}
                          title={user.name}
                        >
                          {user.initials}
                        </div>
                      ))}
                      {assignedUsers.length > 2 && (
                        <div className="w-6 h-6 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center border-2 border-white">
                          +{assignedUsers.length - 2}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openTaskDetail(task.id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => handleEditTask(task, task.columnId)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id, task.columnId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default StaticListView