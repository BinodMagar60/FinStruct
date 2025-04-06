import { useEffect, useRef } from "react"
import { Edit, Plus, Copy, Trash2, ExternalLink} from "lucide-react"
import { Link } from "react-router-dom"

const StaticTaskMenu = ({ onEdit, onDelete, onClose }) => {
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
    >
      <ul className="py-1">
        <li>
          <Link to="/admin/details">
          <button
            // onClick={(e) => {
            //   e.stopPropagation()
            //   onClose()
            //   // Open task implementation would go here
            // }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <ExternalLink size={14} />
            Open Task
          </button>
          </Link>
        </li>
        <li>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Edit size={14} />
            Edit
          </button>
        </li>

        {/* <li>
          <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2">
            <Copy size={14} />
            Duplicate
          </button>
        </li> */}
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

export default StaticTaskMenu
