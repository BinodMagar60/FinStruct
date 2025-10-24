import { useState } from "react"
import { X } from "lucide-react"
import { toast } from 'react-toastify'

export default function AddRoleModal({ onSave, onCancel }) {

  const user = JSON.parse(localStorage.getItem("userDetails"));

  const [activeTab, setActiveTab] = useState("user")
  const [formData, setFormData] = useState({
    titleName: "",
    defaultSalary: 0,
    role: "user",
    companyId: user.companyId,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "defaultSalary" ? Number.parseInt(value, 10) || 0 : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation check
    if (!formData.titleName.trim()) {
      toast.error("Role title cannot be empty!");
      return;
    }

    if (formData.defaultSalary <= 0) {
      toast.error("Default salary must be greater than 0!");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#00000017] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Role</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 border-b border-gray-300">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("user")
                setFormData({ ...formData, role: "user" })
              }}
              className={`py-2 px-4 font-medium text-sm ${
                formData.role === "user"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              User
            </button>
            <button
              onClick={() => {
                setActiveTab("worker")
                setFormData({ ...formData, role: "worker" })
              }}
              className={`py-2 px-4 font-medium text-sm ${
                formData.role === "worker"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Worker
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="titleName" className="block text-sm font-medium text-gray-700 mb-1">
              Role Title
            </label>
            <input
              type="text"
              id="titleName"
              name="titleName"
              placeholder="e.g. Developer"
              value={formData.titleName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              
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
              placeholder="0"
              value={formData.defaultSalary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none "
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
