import { useState, useRef } from "react";
import { useDrag } from "react-dnd";
import {
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Plus,
  X,
} from "lucide-react";
import TaskMenu from "./StaticTaskMenu";

const StaticTaskCard = ({
  task,
  columnId,
  onEditTask,
  onDeleteTask,
  onAddSubtask,
  users,
  setIsModalOpen
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const menuRef = useRef(null);
  const subtaskInputRef = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, columnId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = () => {
    onEditTask(task, columnId);
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    onDeleteTask(task.id, columnId);
    setIsMenuOpen(false);
  };

  const handleAddSubtask = () => {
    onAddSubtask(task.id, columnId);
    setIsMenuOpen(false);
  };

  const toggleSubtaskForm = (e) => {
    e.stopPropagation();
    setShowSubtaskForm(!showSubtaskForm);
    // Focus on the input field when showing the form
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
      // Call the parent function to add the subtask
      onAddSubtask(task.id, columnId, {
        title: subtaskTitle,
        completed: false,
        id: Date.now().toString(), // Generate a temporary ID
      });

      // Reset form
      setSubtaskTitle("");
      setShowSubtaskForm(false);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setShowSubtaskForm(false);
    setSubtaskTitle("");
  };

  // Find assigned users
  const assignedUsers = task.assignees
    ? users.filter((user) => task.assignees.includes(user.id))
    : [];

  // Calculate subtask completion stats
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks
    ? task.subtasks.filter((subtask) => subtask.completed).length
    : 0;

  return (
    <div
      ref={drag}
      className={`bg-white border border-gray-200 rounded-lg mb-2 flex flex-col ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="p-3 flex-grow">
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
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
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
              <TaskMenu
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddSubtask={() => toggleSubtaskForm(window.event)}
                onClose={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        </div>

        {task.dueDate && (
          <div className="text-gray-500 text-xs mt-2">
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}

        {/* Render subtasks if there are any */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2">
            {task.subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center gap-2 mt-1 py-1 border-t border-gray-100 " 
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  id={subtask.id}
                  onChange={() => {
                    subtask.completed = !subtask.completed; // Directly update the subtask state
                     onEditTask({ ...task }, columnId); // Update the task with modified subtasks
                    setIsModalOpen(false)
                  }}
                  className="rounded text-blue-500 cursor-pointer"
                />
                <label htmlFor={subtask.id}>
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

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <span>0</span>
            <MessageSquare size={12} />
            <span className="ml-3">0</span>
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
      </div>

      {/* Add Subtask section - Always at the bottom */}
      <div className="border-t border-gray-200 px-3 py-2 mt-auto">
        {showSubtaskForm ? (
          <form onSubmit={submitSubtask} className="flex flex-col gap-2">
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
                className="px-2 py-1 text-gray-600 bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2 py-1 text-white bg-blue-500 rounded"
              >
                Add Subtask
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={toggleSubtaskForm}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Plus size={12} />
            ADD SUBTASK
          </button>
        )}
      </div>
    </div>
  );
};

export default StaticTaskCard;