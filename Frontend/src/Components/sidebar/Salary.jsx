import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Users, Briefcase, UserCog, Plus } from "lucide-react"
import UsersList from "./salarycomponent/users-list"
import WorkersList from "./salarycomponent/workers-list"
import RolesList from "./salarycomponent/roles-list"
import EditEmployeeModal from "./salarycomponent/edit-employee-modal"
import EditRoleModal from "./salarycomponent/edit-role-modal"
import AddRoleModal from "./salarycomponent/add-role-modal"
import { getRolesAndSalaries, DeleteRolesAndSalaries, getAllUserForSalary, updateUserSalary } from "../../api/AdminApi"
import Loading from "./Loading"



export default function Salary() {

  const user = JSON.parse(localStorage.getItem("userDetails"));


  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false)
  const [showEditRoleModal, setShowEditRoleModal] = useState(false)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState(null)
  const [currentRole, setCurrentRole] = useState(null)
  const [allTheUsers, setAllTheUsers] = useState([]);
  const [isLoading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  const [workers, setWorkers] = useState([])

  const [jobTitles, setJobTitles] = useState([])

//get roles from backend
  useEffect(()=>{
    const getRolesData = async()=>{
        try{
            const response = await getRolesAndSalaries(`admin/user/roles-salaries/${user.companyId}`)
            // console.log(response)
            setJobTitles(response.allRolesData)
        }
        catch(err){
            console.log(err)
        }
      }
      getRolesData()
  },[])

//get all the user detail from backend
useEffect(()=>{
  const getData = async() => {
    try{
      const response = await getAllUserForSalary(`admin/user/salaries/${user.companyId}`)
      // console.log(response)
      setAllTheUsers(response.receivedData)
    }catch(err){
      console.log(err)
    }
    finally{
        setLoading(false)
    }
  }
  getData()
},[allTheUsers])


//dividing allTheUsers into worker and users
useEffect(()=>{
  if(!allTheUsers || allTheUsers.length === 0) return;

  const adminanduserDetails = allTheUsers.filter(user=> user.role !== 'worker');
  const workersDetails = allTheUsers.filter(user=> user.role === 'worker');

  setUsers(adminanduserDetails)
  setWorkers(workersDetails)
},[allTheUsers])


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

  const handleSaveEmployee = async(updatedEmployee) => {
 

    try{
      const response = await updateUserSalary(`admin/user/salaries/${updatedEmployee._id}`,updatedEmployee)
    setShowEditEmployeeModal(false)
      // console.log(response)
    }
    catch(err){
      console.log(err)
    }


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

  const handleDeleteRole = async(id) => {
    

    try{
      await DeleteRolesAndSalaries(`admin/user/roles-salaries/${id}`)
      
      setJobTitles(jobTitles.filter((jobTitle) => jobTitle._id !== id))
      
    }catch(err){
      // console.log(err)s
      toast.error(err.message, {
        theme: 'light',
        autoClose: 1500
      })
    }


  }

  return (
    <div className="">
      <div className="">
        <div className="p-6">
          <div className="container mx-auto p-4 bg-white pb-8 rounded">
            {
              isLoading? <Loading/> : (
                <>
                <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Salary Management</h1>
              <div className="flex items-center">
                {activeTab !== "roles" ? (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none"
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
                </>
              )
            }
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
