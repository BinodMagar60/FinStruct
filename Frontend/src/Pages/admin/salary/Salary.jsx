import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Users, Briefcase, UserCog, Plus } from "lucide-react";
import UsersList from "./users-list";
import WorkersList from "./workers-list";
import RolesList from "./roles-list";
import EditEmployeeModal from "./edit-employee-modal";
import EditRoleModal from "./edit-role-modal";
import AddRoleModal from "./add-role-modal";
import {
  getRolesAndSalaries,
  DeleteRolesAndSalaries,
  getAllUserForSalary,
  updateUserSalary,
  addRolesAndSalaries,
  updateRolesAndSalaries,
} from "../../../api/AdminApi";
import Loading from "../../../Components/Loading";

export default function Salary() {
  const user = JSON.parse(localStorage.getItem("userDetails"));

  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [allTheUsers, setAllTheUsers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [ischanging, setChanging] = useState(true);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);

  useEffect(() => {
    const getRolesData = async () => {
      try {
        const response = await getRolesAndSalaries(`admin/user/roles-salaries/${user.companyId}`);
        setJobTitles(response.allRolesData);
      } catch (err) {
        console.log(err);
      }
    };
    getRolesData();
  }, [ischanging]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllUserForSalary(`admin/user/salaries/${user.companyId}`);
        setAllTheUsers(response.receivedData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [ischanging]);

  useEffect(() => {
    if (!allTheUsers || allTheUsers.length === 0) return;

    const adminanduserDetails = allTheUsers.filter((user) => user.role !== "worker");
    const workersDetails = allTheUsers.filter((user) => user.role === "worker");

    setUsers(adminanduserDetails);
    setWorkers(workersDetails);
  }, [allTheUsers]);

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setShowEditEmployeeModal(true);
  };

  const handleEditRole = (jobTitle) => {
    setCurrentRole(jobTitle);
    setShowEditRoleModal(true);
  };

  const handleAddRole = () => {
    setShowAddRoleModal(true);
  };

  const validateEmployee = (employee) => {
    if (!employee.salary || isNaN(employee.salary) || employee.salary <= 0) {
      toast.error("Salary must be a valid positive number.", { theme: "light" });
      return false;
    }
    if (!employee.role || employee.role.trim() === "") {
      toast.error("Please select a valid role for the employee.", { theme: "light" });
      return false;
    }
    return true;
  };

  const validateRole = (role) => {
    const validNameRegex = /^[A-Za-z][A-Za-z0-9\s\-_,.()]*$/;
    if (!role.jobTitle || role.jobTitle.trim() === "") {
      toast.error("Role title cannot be empty.", { theme: "light" });
      return false;
    }
    if (!validNameRegex.test(role.jobTitle.trim())) {
      toast.error("Role title must start with a letter and contain only valid characters.", { theme: "light" });
      return false;
    }
    if (!role.defaultSalary || isNaN(role.defaultSalary) || role.defaultSalary <= 0) {
      toast.error("Default salary must be a valid positive number.", { theme: "light" });
      return false;
    }
    return true;
  };

  const handleSaveEmployee = async (updatedEmployee) => {
    if (!validateEmployee(updatedEmployee)) return;

    try {
      await updateUserSalary(`admin/user/salaries/${updatedEmployee._id}`, updatedEmployee);
      setShowEditEmployeeModal(false);
      setChanging((prev) => !prev);
      toast.success("Employee salary updated successfully!", { theme: "light" });
    } catch (err) {
      console.log(err);
      toast.error("Error updating employee salary.", { theme: "light" });
    }
  };

  const handleSaveRole = async (updatedRole) => {
    if (!validateRole(updatedRole)) return;

    try {
      await updateRolesAndSalaries(`admin/user/roles-salaries/${updatedRole._id}`, updatedRole);
      setChanging((prev) => !prev);
      toast.success("Role updated successfully!", { theme: "light" });
    } catch (err) {
      console.log(err);
      toast.error("Error updating role.", { theme: "light" });
    }
  };

  const handleAddNewRole = async (newRole) => {
    if (!validateRole(newRole)) return;

    try {
      await addRolesAndSalaries("admin/user/roles-salaries", newRole);
      setChanging((prev) => !prev);
      setShowAddRoleModal(false);
      toast.success("New role added successfully!", { theme: "light" });
    } catch (err) {
      console.log("Error adding new role: ", err);
      toast.error("Error adding new role.", { theme: "light" });
    }
  };

  const handleDeleteEmployee = (id) => {
    if (activeTab === "users") {
      setUsers(users.filter((user) => user._id !== id));
    } else {
      setWorkers(workers.filter((worker) => worker._id !== id));
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      await DeleteRolesAndSalaries(`admin/user/roles-salaries/${id}`);
      setJobTitles(jobTitles.filter((jobTitle) => jobTitle._id !== id));
      toast.success("Role deleted successfully!", { theme: "light" });
    } catch (err) {
      console.log("Error deleting role: ", err);
      toast.error("Error deleting role.", { theme: "light" });
    }
  };

  return (
    <div>
      <div className="">
        <div className="container mx-auto p-4 bg-white pb-8 rounded">
          {isLoading ? (
            <Loading />
          ) : (
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
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
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
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`flex items-center py-2 px-6 border-b-2 ${
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
          )}
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
        <EditRoleModal
          role={currentRole}
          onSave={handleSaveRole}
          onCancel={() => setShowEditRoleModal(false)}
        />
      )}

      {showAddRoleModal && (
        <AddRoleModal
          onSave={handleAddNewRole}
          onCancel={() => setShowAddRoleModal(false)}
        />
      )}
    </div>
  );
}
