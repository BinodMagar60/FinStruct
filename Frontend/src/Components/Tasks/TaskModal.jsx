import { useState, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import { useTaskContext } from "../../context/taskContext"

const TaskModal = () => {
  const {
    isModalOpen,
    currentTask,
    modalMode,
    columns,
    users,
    handleAddTask,
    handleUpdateTask,
    setIsModalOpen,
  } = useTaskContext()

  const [formData, setFormData] = useState({
    title: "",
    assignees: [],
    stage: "todo",
    dueDate: "",
    startingDate: "",
    priority: "normal",
  })

  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  useEffect(() => {
    if (currentTask) {
      setFormData({
        id: currentTask.id,
        title: currentTask.title || "",
        assignees: currentTask.assignees || [],
        stage: currentTask.columnId || "todo",
        dueDate: formatDate(currentTask.dueDate),
        startingDate: formatDate(currentTask.startingDate),
        priority: currentTask.priority || "normal",
        columnId: currentTask.columnId,
        subtasks: currentTask.subtasks || [],
      })
    } else {
      setFormData({
        title: "",
        assignees: [],
        stage: "todo",
        dueDate: "",
        startingDate: "",
        priority: "normal",
      })
    }
  }, [currentTask])

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

    // convert dates to ISO before sending
    const taskToSubmit = {
      ...formData,
      startingDate: new Date(formData.startingDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
    }

    if (modalMode === "add") {
      handleAddTask(taskToSubmit)
    } else {
      if (currentTask && currentTask.subtasks) {
        const mainSubtask = currentTask.subtasks.find((s) => s.isMainSubtask)
        if (mainSubtask) {
          const updatedSubtasks = currentTask.subtasks.map((s) =>
            s.isMainSubtask ? { ...s, title: formData.title } : s,
          )

          handleUpdateTask({
            ...taskToSubmit,
            subtasks: updatedSubtasks,
          })
          return
        }
      }
      handleUpdateTask(taskToSubmit)
    }
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 bg-[#7e7e7e50] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">{modalMode === "add" ? "ADD TASK" : "EDIT TASK"}</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
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
              disabled={modalMode === "edit"}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
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
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              >
                {columns.map((column) => (
                  column.title !== "COMPLETED" && (
                    <option key={column.id} value={column.id}>
                      {column.title}
                    </option>
                  )
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Starting Date</label>
              <input
                type="date"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="normal">NORMAL</option>
                <option value="high">HIGH</option>
                <option value="low">LOW</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
