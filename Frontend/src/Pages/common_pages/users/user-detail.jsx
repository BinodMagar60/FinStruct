import { Briefcase, Edit, Trash2, X, MapPin, Phone, Mail, User } from "lucide-react"

export default function UserDetail({ userId, users = [], onBack }) {

  const userlocal = JSON.parse(localStorage.getItem("userDetails"));


  // Find the user by ID
  const user = users.find((u) => u._id === userId) || {
    _id: "",
    username: "",
    personalEmail: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
    isOwner: false,
    role: "",
    companyId: { name: "" },
    jobTitleId: { name: "" },
    photo: "",
    lastLogin: "",
    createdAt: "",
    salary: 0,
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(salary)
  }

  return (

    <div className="fixed inset-0 bg-[#0000001f] bg-opacity-30 flex items-center justify-center z-50">
       <div className="p-6 max-w-300 w-full relative">
      <div className="bg-white rounded-lg shadow-sm border border-gray-300">
        <div className="p-6 flex justify-between items-start border-b border-gray-300">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl">
              {
                user.photo? (
                  <>
                  <img src={user.photo} className="rounded-full"/>
                  </>
                ) : (
                  <>{getInitials(user.username)}</>
                )
              }
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <User size={18} />
                <span>
                  {user.jobTitleId?.name || "Job Title"} {userlocal.companyName ? `at ${userlocal.companyName}` : ""}
                </span>
              </div>
            </div>
          </div>
          <div>
            <button onClick={onBack} className="p-2 border rounded-md border-gray-300 hover:bg-gray-50">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Bio</h2>
              <p className="text-gray-700">{user.bio || "No bio provided."}</p>
            </div>
          </div>

          <div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold mb-3">Employment Details</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                <User size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Type</p>
                    <p className="text-gray-700 capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Role</p>
                    <p className="text-gray-700">{user.jobTitleId?.name || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-[18px] h-[18px] flex items-center justify-center text-gray-500 mt-0.5">
                    <span className="text-xs">$</span>
                  </div>
                  <div>
                    <p className="font-medium">Salary</p>
                    <p className="text-gray-700">{formatSalary(user.salary)}</p>
                  </div>
                </div>

                {
                  user.role !== "worker" && (
                    <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-gray-700">{user.location || "Not specified"}</p>
                  </div>
                </div>
                  )
                }
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
            <div className="space-y-3">
              {
                user.role !== "worker" && (
                  <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Work Email</p>
                  <p className="text-gray-700">{user.email}</p>
                </div>
              </div>
                )
              }

              <div className="flex items-start gap-3">
                <Mail size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Personal Email</p>
                  <p className="text-gray-700">{user.personalEmail || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-700">{user.phoneNumber || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-3">Account Activity</h2>
            <div className="space-y-3">
              {
                user.role !== 'worker' && (
                  <div>
                <p className="font-medium">Last Login</p>
                <p className="text-gray-700">{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</p>
              </div>
                )
              }

              <div>
                <p className="font-medium">Member Since</p>
                <p className="text-gray-700">{user.createdAt ? formatDate(user.createdAt) : "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

   
  )
}
