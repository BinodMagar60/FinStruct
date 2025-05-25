import { useState, useEffect } from "react";
import { useTaskContext } from "../../context/taskContext";
import { sortedTasksByWeight } from "../../api/ProjectApi";

const NextView = () => {
  const locallySavedProject = localStorage.getItem("projectId");

  const {
    columns,
    handleEditTask,
    handleDeleteTask,
    users,
    openTaskDetail,
  } = useTaskContext();

  const [sortedTasks, setSortedTasks] = useState([]);

  useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await sortedTasksByWeight(locallySavedProject);
        // console.log(response)
        setSortedTasks(response);
      } catch (err) {
        console.log(err);
      }
    };
    getDatas();
  }, []);

  const noTasksToShow = sortedTasks.length === 0;

  const getStatusColorClass = (status) => {
    switch (status) {
      case "TO DO":
        return "text-blue-600";
      case "IN PROGRESS":
        return "text-orange-500";
      case "COMPLETED":
        return "text-green-500";
      case "ON HOLD":
        return "text-red-500";
      default:
        return "text-gray-600";
    }
  };

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
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Task Title
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task) => (
              <tr key={task.id || `${task.title}-${task.createdAt}`}>
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
                  <div className="text-sm text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${getStatusColorClass(task.status)}`}>
                    {task.status}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{task.message}</div>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NextView;
