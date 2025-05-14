import { useState, useRef } from "react";

import {
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Plus,
} from "lucide-react";
import StaticTaskMenu from "./StaticTaskMenu";
import { useTaskContext } from "../../context/taskContext";
import { formatDateToReadable } from "../../utils/formateDates";

const StaticTaskCard = ({ task, columnId }) => {
  const {
    handleEditTask,
    handleDeleteTask,
    addSubtask,
    users,
    setIsModalOpen,
    openTaskDetail,
    updateSubtask,
  } = useTaskContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const subtaskInputRef = useRef(null);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    if (columnId !== "completed") {
      handleEditTask(task, columnId);
      setIsModalOpen(true);
    }
  };

  const handleDelete = () => {
    handleDeleteTask(task.id, columnId);
    setIsModalOpen(false);
  };

  const handleOpenTask = () => {
    openTaskDetail(task.id);
    setIsMenuOpen(false);
  };

  const toggleSubtaskForm = (e) => {
    e.stopPropagation();
    setShowSubtaskForm(!showSubtaskForm);
    if (!showSubtaskForm) {
      setTimeout(() => {
        if (subtaskInputRef.current) {
          subtaskInputRef.current.focus();
        }
      }, 100);
    }
  };

  const submitSubtask = (e) => {
    e.preventDefault();
    if (subtaskTitle.trim()) {
      addSubtask(task.id, columnId, {
        title: subtaskTitle,
        completed: false,
      });
      setSubtaskTitle("");
      setShowSubtaskForm(false);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowSubtaskForm(false);
    setSubtaskTitle("");
  };

  // Handle subtask checkbox change
  const handleSubtaskChange = (e, subtaskId) => {
    e.stopPropagation();

    const subtask = task.subtasks.find((s) => s.id === subtaskId);

    if (
      subtask &&
      subtask.isMainSubtask &&
      columnId === "completed" &&
      !e.target.checked
    ) {
      const completedSubtasks = task.subtasks.filter((s) => s.completed);
      if (
        completedSubtasks.length === 1 &&
        completedSubtasks[0].id === subtaskId
      ) {
      }
    }
    updateSubtask(task.id, columnId, subtaskId, {
      completed: e.target.checked,
    });
  };

  const assignedUsers = task.assignees
    ? users.filter((user) => task.assignees.includes(user.id))
    : [];

  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks
    ? task.subtasks.filter((subtask) => subtask.completed).length
    : 0;

  // Determine if the task is in the completed column
  const isCompleted = columnId === "completed";

  return (
    <div
      // ref={drag}
      className={`bg-white border flex flex-col justify-between border-gray-200 rounded-lg mb-2  ${
        isCompleted ? "bg-green-50" : ""
      }`}
    >
      <div className="px-3 pt-3">
        {task.priority === "high" && (
          <div className="text-red-500 text-xs mb-1">High Priority</div>
        )}
        {task.priority === "normal" && (
          <div className="text-yellow-500 text-xs mb-1">Normal Priority</div>
        )}
        {task.priority === "low" && (
          <div className="text-green-500 text-xs mb-1">Low Priority</div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded-full ${
                isCompleted ? "bg-green-500" : "bg-blue-500"
              }`}
            ></div>
            <h4 className="font-medium">{task.title}</h4>
          </div>
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full cursor-pointer"
            >
              <MoreHorizontal size={16} />
            </button>

            {isMenuOpen && (
              <StaticTaskMenu
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddSubtask={() => toggleSubtaskForm(window.event)}
                onOpenTask={handleOpenTask}
                onClose={() => setIsMenuOpen(false)}
                isCompleted={isCompleted}
              />
            )}
          </div>
        </div>

        {task.dueDate && (
          <div className="text-gray-500 text-xs mt-2">
            Due Date: {formatDateToReadable(task.dueDate)}
          </div>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 mt-1 py-1 border-t border-gray-100"
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  id={subtask.id}
                  onChange={(e) => handleSubtaskChange(e, subtask.id)}
                  className="rounded text-blue-500 cursor-pointer"
                />
                <label
                  htmlFor={subtask.id}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    className={`text-sm cursor-pointer ${
                      subtask.completed
                        ? "line-through text-gray-400"
                        : "text-gray-700"
                    }`}
                  >
                    {subtask.title}
                  </span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <span>{task.activities?.length || 0}</span>
            <MessageSquare size={12} />
            <span className="ml-3">{task.assets?.length || 0}</span>
            <Paperclip size={12} />
            <span className="ml-3">
              {completedSubtasks}/{totalSubtasks}
            </span>
            <CheckSquare size={12} />
          </div>

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
        </div>
        <div className="border-t border-gray-200 px-3 py-2 ">
          {showSubtaskForm ? (
            <form
              onSubmit={submitSubtask}
              className="flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={subtaskInputRef}
                type="text"
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded outline-none"
                placeholder="Enter subtask title"
              />
              <div className="flex gap-2 justify-end outline-none">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-2 py-1 text-gray-700 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-white bg-black hover:bg-gray-800 rounded"
                >
                  Add Subtask
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSubtaskForm(e);
              }}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <Plus size={12} />
              ADD SUBTASK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticTaskCard;
