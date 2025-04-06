import { ChevronDown, FileText, Paperclip, CheckSquare } from "lucide-react";

const StaticListView = ({
  taskType,
  columns,
  onEditTask,
  onDeleteTask,
  users,
}) => {
  // Find the selected column
  const selectedColumn = columns.find((column) => column.id === taskType);

  // Get tasks only from the selected column
  const filteredTasks = selectedColumn
    ? selectedColumn.tasks.map((task) => ({
        ...task,
        columnId: selectedColumn.id,
        status: selectedColumn.title,
      }))
    : [];

  // Check if there are no tasks to display
  const noTasksToShow = filteredTasks.length === 0;

  return (
    <div className="overflow-x-auto pt-4">
      {noTasksToShow ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 text-lg">
            No tasks found in this category
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Add a new task to get started
          </p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
              >
                Task Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
              >
                Priority
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1"
              >
                Created At
                <ChevronDown size={14} />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
              >
                Assets
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => {
              // Find assigned users
              const assignedUsers = task.assignees
                ? users.filter((user) => task.assignees.includes(user.id))
                : [];

              return (
                <tr key={task.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
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
                    <div className="text-sm text-gray-900">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <span>0</span>
                        <FileText size={16} className="text-gray-400" />
                      </span>
                      <span className="flex items-center gap-1">
                        <span>0</span>
                        <Paperclip size={16} className="text-gray-400" />
                      </span>
                      <span className="flex items-center gap-1">
                        <span>0/1</span>
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
                      onClick={() => onOpenTask && onOpenTask(task)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => onEditTask(task, task.columnId)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id, task.columnId)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaticListView;
