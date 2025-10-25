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

  const [errors, setErrors] = useState({})
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
    setErrors({})
  }, [currentTask])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setErrors((prev) => ({ ...prev, [name]: "" })) // clear field error on change
  }

  const toggleAssignee = (userId) => {
    setFormData((prev) => {
      const updatedAssignees = prev.assignees.includes(userId)
        ? prev.assignees.filter((id) => id !== userId)
        : [...prev.assignees, userId]
      return { ...prev, assignees: updatedAssignees }
    })
    setErrors((prev) => ({ ...prev, assignees: "" }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Task title is required."
    if (formData.assignees.length === 0)
      newErrors.assignees = "Please assign at least one user."
    if (!formData.startingDate)
      newErrors.startingDate = "Starting date is required."
    if (!formData.dueDate) newErrors.dueDate = "Due date is required."
    if (
      formData.dueDate &&
      formData.startingDate &&
      new Date(formData.dueDate) < new Date(formData.startingDate)
    ) {
      newErrors.dueDate = "Due date cannot be before starting date."
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const taskToSubmit = {
      ...formData,
      startingDate: new Date(formData.startingDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
    }

    try {
      if (modalMode === "add") {
        await handleAddTask(taskToSubmit)
        setIsModalOpen(false)
        setFormData({
          title: "",
          assignees: [],
          stage: "todo",
          dueDate: "",
          startingDate: "",
          priority: "normal",
        })
      } else {
        if (currentTask && currentTask.subtasks) {
          const mainSubtask = currentTask.subtasks.find((s) => s.isMainSubtask)
          if (mainSubtask) {
            const updatedSubtasks = currentTask.subtasks.map((s) =>
              s.isMainSubtask ? { ...s, title: formData.title } : s
            )
            await handleUpdateTask({
              ...taskToSubmit,
              subtasks: updatedSubtasks,
            })
            setIsModalOpen(false)
            return
          }
        }
        await handleUpdateTask(taskToSubmit)
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Error adding/updating task:", error)
    }
  }

  if (!isModalOpen) return null

  return (
    <div className="fixed inset-0 bg-[#7e7e7e50] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">
            {modalMode === "add" ? "ADD TASK" : "EDIT TASK"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-4">
          {/* TASK TITLE */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={modalMode === "edit"}
              className={`w-full p-2 border rounded-md focus:outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Task Title"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* ASSIGNEES */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign Task To:
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowAssigneeDropdown(!showAssigneeDropdown)
                }
                className={`w-full p-2 border rounded-md flex justify-between items-center ${
                  errors.assignees ? "border-red-500" : "border-gray-300"
                }`}
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
            {errors.assignees && (
              <p className="text-red-500 text-xs mt-1">{errors.assignees}</p>
            )}
          </div>

          {/* STAGE + START DATE */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              >
                {columns.map(
                  (column) =>
                    column.title !== "COMPLETED" && (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Date
              </label>
              <input
                type="date"
                name="startingDate"
                value={formData.startingDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  errors.startingDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startingDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.startingDate}
                </p>
              )}
            </div>
          </div>

          {/* DUE DATE + PRIORITY */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  errors.dueDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority Level
              </label>
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

          {/* BUTTONS */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
