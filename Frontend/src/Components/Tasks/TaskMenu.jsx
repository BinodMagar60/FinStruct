import { useEffect, useRef } from "react"
import { Edit, Trash2, ExternalLink, Plus } from "lucide-react"

const TaskMenu = ({ onEdit, onDelete, onAddSubtask, onOpenTask, onClose, isCompleted }) => {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-6 z-10 bg-white shadow-lg rounded-md border border-gray-200 w-40"
      onClick={(e) => e.stopPropagation()}
    >
      <ul className="py-1">
        <li>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenTask()
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <ExternalLink size={14} />
            Open Task
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
              isCompleted ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isCompleted}
          >
            <Edit size={14} />
            Edit
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onAddSubtask()
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Plus size={14} />
            Add Subtask
          </button>
        </li>
        <li>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 flex items-center gap-2"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </li>
      </ul>
    </div>
  )
}

export default TaskMenu
