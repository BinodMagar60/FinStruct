import { useEffect, useState } from "react"
import { Users, Briefcase, UserCog, Plus } from "lucide-react"
import UsersList from "./salarycomponent/users-list"
import WorkersList from "./salarycomponent/workers-list"
import RolesList from "./salarycomponent/roles-list"
import EditEmployeeModal from "./salarycomponent/edit-employee-modal"
import EditRoleModal from "./salarycomponent/edit-role-modal"
import AddRoleModal from "./salarycomponent/add-role-modal"
import { getRolesAndSalaries } from "../../api/AdminApi"

export default function Salary() {

  const user = JSON.parse(localStorage.getItem("userDetails"));


  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false)
  const [showEditRoleModal, setShowEditRoleModal] = useState(false)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [currentRole, setCurrentRole] = useState(null)
  const [users, setUsers] = useState([
    {
      _id: "1",
      username: "James Taylor",
      email: "james@finstruct.com",
      role: "admin",
      salary: 97000,
      jobTitleId: "8",
    },
    {
      _id: "2",
      username: "Michael Brown",
      email: "michael@finstruct.com",
      role: "admin",
      salary: 98000,
      jobTitleId: "8",
    },
    {
      _id: "3",
      username: "Olivia Williams",
      email: "olivia@finstruct.com",
      role: "employee",
      salary: 69500,
      jobTitleId: "2",
    },
    {
      _id: "4",
      username: "Thomas Garcia",
      email: "thomas@finstruct.com",
      role: "employee",
      salary: 72000,
      jobTitleId: "4",
      isDefault: true,
    },
  ])

  const [workers, setWorkers] = useState([
    { _id: "1", username: "Alex Johnson", email: "alex@finstruct.com", role: "worker", salary: 78000, jobTitleId: "5" },
    { _id: "2", username: "Ava Thompson", email: "ava@finstruct.com", role: "worker", salary: 66000, jobTitleId: "1" },
    { _id: "3", username: "Daniel Lee", email: "daniel@finstruct.com", role: "worker", salary: 91000, jobTitleId: "7" },
    { _id: "4", username: "David Kim", email: "david@finstruct.com", role: "worker", salary: 86500, jobTitleId: "6" },
    {
      _id: "5",
      username: "Emily Wilson",
      email: "emily@finstruct.com",
      role: "worker",
      salary: 70000,
      jobTitleId: "3",
      isDefault: true,
    },
    {
      _id: "6",
      username: "Emma Rodriguez",
      email: "emma@finstruct.com",
      role: "worker",
      salary: 71500,
      jobTitleId: "3",
    },
    { _id: "7", username: "Jane Smith", email: "jane@finstruct.com", role: "worker", salary: 87500, jobTitleId: "6" },
    {
      _id: "8",
      username: "Jessica Park",
      email: "jessica@finstruct.com",
      role: "worker",
      salary: 67000,
      jobTitleId: "1",
    },
    {
      _id: "9",
      username: "Robert Chen",
      email: "robert@finstruct.com",
      role: "worker",
      salary: 92000,
      jobTitleId: "7",
    },
    {
      _id: "10",
      username: "Sarah Davis",
      email: "sarah@finstruct.com",
      role: "worker",
      salary: 82000,
      jobTitleId: "6",
    },
  ])

  const [jobTitles, setJobTitles] = useState([
    // { _id: "1", titleName: "QA Tester", defaultSalary: 65000, role: "worker", companyId: "1" },
    // { _id: "2", titleName: "Marketing Specialist", defaultSalary: 68000, role: "user", companyId: "1" },
    // { _id: "3", titleName: "Analyst", defaultSalary: 70000, role: "worker", companyId: "1" },
    // { _id: "4", titleName: "HR Specialist", defaultSalary: 72000, role: "user", companyId: "1" },
    // { _id: "5", titleName: "Designer", defaultSalary: 75000, role: "worker", companyId: "1" },
    // { _id: "6", titleName: "Developer", defaultSalary: 85000, role: "worker", companyId: "1" },
    // { _id: "7", titleName: "DevOps Engineer", defaultSalary: 90000, role: "worker", companyId: "1" },
    // { _id: "8", titleName: "Manager", defaultSalary: 95000, role: "user", companyId: "1" },
  ])


  useEffect(()=>{
    const getRolesData = async()=>{
        try{
            const response = await getRolesAndSalaries(`admin/user/roles-salaries/${user.companyId}`)
            console.log(response)
            setJobTitles(response.allRolesData)
        }
        catch(err){
            console.log(err)
        }
      }
      getRolesData()
  },[])



  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee)
    setShowEditEmployeeModal(true)
  }

  const handleEditRole = (jobTitle) => {
    setCurrentRole(jobTitle)
    setShowEditRoleModal(true)
  }

  const handleAddRole = () => {
    setShowAddRoleModal(true)
  }

  const handleSaveEmployee = (updatedEmployee) => {
    if (activeTab === "users") {
      setUsers(users.map((user) => (user._id === updatedEmployee._id ? updatedEmployee : user)))
    } else {
      setWorkers(workers.map((worker) => (worker._id === updatedEmployee._id ? updatedEmployee : worker)))
    }
    setShowEditEmployeeModal(false)
  }

  const handleSaveRole = (updatedRole) => {
    setJobTitles(jobTitles.map((jobTitle) => (jobTitle._id === updatedRole._id ? updatedRole : jobTitle)))
    setShowEditRoleModal(false)
  }

  const handleAddNewRole = (newRole) => {
    const newId = (Math.max(...jobTitles.map((jobTitle) => Number.parseInt(jobTitle._id))) + 1).toString()
    setJobTitles([...jobTitles, { ...newRole, _id: newId, companyId: "1" }])
    setShowAddRoleModal(false)
  }

  const handleDeleteEmployee = (id) => {
    if (activeTab === "users") {
      setUsers(users.filter((user) => user._id !== id))
    } else {
      setWorkers(workers.filter((worker) => worker._id !== id))
    }
  }

  const handleDeleteRole = (id) => {
    setJobTitles(jobTitles.filter((jobTitle) => jobTitle._id !== id))
  }

  return (
    <div className="">
      <div className="">
        <div className="p-6">
          <div className="container mx-auto p-4 bg-white pb-8 rounded">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
              <div className="flex items-center">
                {activeTab !== "roles" ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="absolute inset-y-0 right-0 px-3 flex items-center bg-black text-white rounded-r-md">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAddRole}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Add New Role
                  </button>
                )}
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex ">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex items-center py-2 px-6  border-b-2 ${
                    activeTab === "users"
                      ? "border-black text-black shadow-inner"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("workers")}
                  className={`flex items-center py-2 px-6 border-b-2 ${
                    activeTab === "workers"
                      ? "border-black shadow-inner text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Workers
                </button>
                <button
                  onClick={() => setActiveTab("roles")}
                  className={`flex items-center py-2 px-6 border-b-2 ${
                    activeTab === "roles"
                      ? "border-black text-black shadow-inner"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <UserCog className="mr-2 h-5 w-5" />
                  Roles & Default Salaries
                </button>
              </nav>
            </div>

            {activeTab === "users" && (
              <UsersList
                users={users}
                searchTerm={searchTerm}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            )}

            {activeTab === "workers" && (
              <WorkersList
                workers={workers}
                searchTerm={searchTerm}
                onEdit={handleEditEmployee}
                onDelete={handleDeleteEmployee}
              />
            )}

            {activeTab === "roles" && (
              <RolesList
                roles={jobTitles}
                searchTerm={searchTerm}
                onEdit={handleEditRole}
                onDelete={handleDeleteRole}
                onAddRole={handleAddRole}
              />
            )}
          </div>
        </div>
      </div>

      {showEditEmployeeModal && (
        <EditEmployeeModal
          employee={currentEmployee}
          roles={jobTitles}
          onSave={handleSaveEmployee}
          onCancel={() => setShowEditEmployeeModal(false)}
          employeeType={activeTab === "users" ? "user" : "worker"}
        />
      )}

      {showEditRoleModal && (
        <EditRoleModal role={currentRole} onSave={handleSaveRole} onCancel={() => setShowEditRoleModal(false)} />
      )}

      {showAddRoleModal && <AddRoleModal onSave={handleAddNewRole} onCancel={() => setShowAddRoleModal(false)} />}
    </div>
  )
}
