import { useState } from "react"
import { X } from "lucide-react"

export default function EditEmployeeModal({ employee, roles, onSave, onCancel, employeeType }) {
  const [formData, setFormData] = useState({
    _id: employee._id,
    username: employee.username,
    email: employee.role === 'worker'? employee.personalEmail : employee.email,
    role: employee.role,
    salary: employee.salary,
    jobTitleId: employee.jobTitleId,
  })

  const filteredRoles = roles.filter((role) => role.type === employeeType)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "salary" ? Number.parseInt(value, 10) || 0 : value,
    })
  }

  const handleRoleChange = (e) => {
    const selectedRole = roles.find((role) => role._id === e.target.value)
    setFormData({
      ...formData,
      jobTitleId: e.target.value,
      role: selectedRole ? selectedRole.role : formData.role,
      salary: selectedRole ? selectedRole.defaultSalary : formData.salary,
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
          <h2 className="text-xl font-semibold">Edit Employee</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {
                formData.role === "worker"? "Personal Email":"Email"
              }
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="jobTitleId" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              id="jobTitleId"
              name="jobTitleId"
              value={formData.jobTitleId.titleName}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            >
            </input>
          </div>
          <div className="mb-6">
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
              Salary
            </label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
            />
          </div>
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
