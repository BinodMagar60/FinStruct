import { useState } from "react"
import { X } from "lucide-react"

export default function EditRoleModal({ role, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    _id: role._id,
    titleName: role.titleName,
    defaultSalary: role.defaultSalary,
    role: role.role,
    companyId: role.companyId,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "defaultSalary" ? Number.parseInt(value, 10) || 0 : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-[#00000017] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Role</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <input type="hidden" name="type" value={formData.role} />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="titleName" className="block text-sm font-medium text-gray-700 mb-1">
              Role Title
            </label>
            <input
              type="text"
              id="titleName"
              name="titleName"
              value={formData.titleName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="defaultSalary" className="block text-sm font-medium text-gray-700 mb-1">
              Default Salary
            </label>
            <input
              type="number"
              id="defaultSalary"
              name="defaultSalary"
              value={formData.defaultSalary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <input type="hidden" name="role" value={formData.role} />
          <input type="hidden" name="companyId" value={formData.companyId} />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
