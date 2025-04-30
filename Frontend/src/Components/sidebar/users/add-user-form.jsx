
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
  }

  const handleSubmit = (e) => {
    e.preventDefault()

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

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone no.</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Personal Email</label>
                <input
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <select
                  name="jobTitleId"
                  value={formData.jobTitleId}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md border-gray-300 focus:outline-none"
                >
                  <option value="">Select a job title</option>
                  {(userType === "user" ? userJobTitles : workerJobTitles).map((title) => (
                    <option key={title._id} value={title.titleName}>
                      {title.titleName}
                    </option>
                  ))}
                </select>
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
