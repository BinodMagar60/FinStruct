import { useState, useEffect } from "react"
import { X, Calendar, Paperclip, ChevronDown } from "lucide-react"

const TaskModal = ({ isOpen, onClose, onSubmit, task, mode, columns, users}) => {
  const [formData, setFormData] = useState({
    title: "",
    assignees: [],
    stage: "todo",
    dueDate: "",
    priority: "normal",
  })

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)

  useEffect(() => {
    if (task) {
      setFormData({
        id: task.id,
        title: task.title || "",
        assignees: task.assignees || [],
        stage: task.columnId || "todo",
        dueDate: task.dueDate || "",
        priority: task.priority || "normal",
        columnId: task.columnId,
      })
    } else {
      setFormData({
        title: "",
        assignees: [],
        stage: "todo",
        dueDate: "",
        priority: "normal",
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const toggleAssignee = (userId) => {
    setFormData((prev) => {
      if (prev.assignees.includes(userId)) {
        return {
          ...prev,
          assignees: prev.assignees.filter((id) => id !== userId),
        }
      } else {
        return {
          ...prev,
          assignees: [...prev.assignees, userId],
        }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#7e7e7e50] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">{mode === "add" ? "ADD TASK" : "EDIT TASK"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task Title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Task To:</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
                className="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center"
              >
                {formData.assignees.length === 0 ? (
                  <span className="text-gray-500">Select assignees</span>
                ) : (
                  <span>{formData.assignees.length} assignee(s) selected</span>
                )}
                <ChevronDown size={16} />
              </button>

              {showAssigneeDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                  <ul className="py-1 max-h-60 overflow-auto">
                    {users.map((user) => (
                      <li key={user.id} className="px-3 py-2 hover:bg-gray-100">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.assignees.includes(user.id)}
                            onChange={() => toggleAssignee(user.id)}
                            className="rounded"
                          />
                          <span>{user.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="normal">NORMAL</option>
                <option value="high">HIGH</option>
                <option value="low">LOW</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Assets</label>
              <button
                type="button"
                className="w-full p-2 border border-gray-300 rounded-md flex items-center justify-center gap-2"
              >
                <Paperclip size={16} />
                Add Assets
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal

