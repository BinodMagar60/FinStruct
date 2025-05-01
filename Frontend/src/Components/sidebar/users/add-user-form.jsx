import { useEffect, useState } from "react"
import { User, Users, X } from "lucide-react"
import { getAllRoles } from "../../../api/AdminApi";

export default function AddUserForm({ onClose, onSubmit, userData = null }) {
  const user = JSON.parse(localStorage.getItem("userDetails"));

  const isEditing = !!userData
  const [userType, setUserType] = useState(userData?.role === "worker" ? "worker" : "user")
  const [allRoles, setAllRoles] = useState([])
  const [userJobTitles, setUserJobTitles]= useState([])
  const [workerJobTitles, setWorkerJobTitles] = useState([])
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    personalEmail: userData?.personalEmail || "",
    email: userData?.email || "",
    phoneNumber: userData?.phoneNumber || "",
    location: userData?.location || "",
    bio: userData?.bio || "",
    role: userData?.role || "",
    isOwner: userData?.role === "admin",
    jobTitleId: userData?.jobTitleId?.name || "",
    companyId: userData?.companyId || "1",
    _id: userData?._id || null,
  })

  useEffect(()=>{
    const gettingRoles= async() => {
      try{
        const response = await getAllRoles(`admin/user/usersroles/${user.companyId}`)
        // console.log(response)
        setAllRoles(response)
      }
      catch(err){
        console.log(err)
      }
    }
    gettingRoles()
  },[])

  useEffect(() => {
    if (!allRoles || allRoles.length === 0) return;
  
    const userTitles = allRoles.filter(role => role.role === "user");
    const workerTitles = allRoles.filter(role => role.role === "worker");
  
    setUserJobTitles(userTitles);
    setWorkerJobTitles(workerTitles);
  }, [allRoles]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    
    // Clear error for the field when the user changes it
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = "Full name cannot be empty"
    }
    
    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number cannot be empty"
    } else if (!/^(98|97)\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }
    
    // Validate email
    if (!formData.personalEmail.trim()) {
      newErrors.personalEmail = "Email cannot be empty"
    } else if (!formData.personalEmail.endsWith(".com")) {
      newErrors.personalEmail = "Please enter a valid email"
    }
    
    // Validate job title (only if not an admin)
    if (!formData.isOwner && formData.jobTitleId === "") {
      newErrors.jobTitleId = "Please select a job title"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Set the role based on user type and admin access
    let role = ""
    if (userType === "worker") {
      role = "worker"
    } else {
      // User type
      role = formData.isOwner ? "admin" : "employee"
    }

    // Set the email as personalEmail and format jobTitleId
    const updatedUserData = {
      ...formData,
      role: role,
      personalEmail: formData.personalEmail,
      jobTitleId: { name: formData.jobTitleId },
    }

    onSubmit(updatedUserData)
  }

  const handleUserTypeChange = (type) => {
    setUserType(type)
    // Reset isOwner when switching to worker
    if (type === "worker") {
      setFormData({
        ...formData,
        isOwner: false,
      })
    }
    
    // Clear errors when changing user type
    setErrors({})
  }

  return (
    <div className="fixed inset-0 bg-[#0000001f] bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="border-b border-gray-300 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">{isEditing ? "Edit Team Member" : "Add New Team Member"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4">
            {/* User/Worker Toggle */}
            <div className="flex rounded-md overflow-hidden border border-gray-300 mb-4">
              <button
                type="button"
                disabled={isEditing}
                className={`flex-1 py-2 flex justify-center items-center gap-2 ${userType === "user" ? "bg-black text-white" : "bg-white"}`}
                onClick={() => handleUserTypeChange("user")}
              >
                <User size={18} /> User
              </button>
              <button
                type="button"
                disabled={isEditing}
                className={`flex-1 py-2 flex justify-center items-center gap-2 ${userType === "worker" ? "bg-black text-white" : "bg-white"}`}
                onClick={() => handleUserTypeChange("worker")}
              >
                <Users size={18} /> Worker
              </button>
            </div>

            {/* Form is here*/}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md border-gray-300 focus:outline-none ${errors.username ? "border-red-500" : ""}`}
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone no.</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md border-gray-300 focus:outline-none ${errors.phoneNumber ? "border-red-500" : ""}`}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md border-gray-300 focus:outline-none ${errors.personalEmail ? "border-red-500" : ""}`}
                />
                {errors.personalEmail && <p className="text-red-500 text-xs mt-1">{errors.personalEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <select
                  name="jobTitleId"
                  value={formData.jobTitleId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md border-gray-300 focus:outline-none ${errors.jobTitleId ? "border-red-500" : ""}`}
                  disabled={formData.isOwner}
                >
                  <option value="">Select a job title</option>
                  {(userType === "user" ? userJobTitles : workerJobTitles).map((title) => (
                    title.titleName !== "Owner" && <option key={title._id} value={title.titleName}>
                      {title.titleName}
                    </option> 
                  ))}
                </select>
                {errors.jobTitleId && !formData.isOwner && <p className="text-red-500 text-xs mt-1">{errors.jobTitleId}</p>}
              </div>

              {userType === "user" && !isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Access</label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isOwner"
                        checked={formData.isOwner}
                        onChange={handleChange}
                        className="sr-only peer"
                        disabled={user.isOwner? false: true}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {formData.isOwner ? "Admin" : "Regular User"}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-300 p-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md border-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">
              {isEditing ? "Update Team Member" : "Add Team Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}