import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, ArrowUp, ArrowDown, X, Save, Users, User, PlusCircle, HardHat } from 'lucide-react';

const Salary = () => {
  // State for roles and default salaries
  const [roles, setRoles] = useState([
    { id: 1, title: 'Developer', defaultSalary: 85000, type: 'Worker' },
    { id: 2, title: 'Designer', defaultSalary: 75000, type: 'Worker' },
    { id: 3, title: 'Analyst', defaultSalary: 70000, type: 'Worker' },
    { id: 4, title: 'Manager', defaultSalary: 95000, type: 'User' },
    { id: 5, title: 'HR Specialist', defaultSalary: 72000, type: 'User' },
    { id: 6, title: 'DevOps Engineer', defaultSalary: 90000, type: 'Worker' },
    { id: 7, title: 'Marketing Specialist', defaultSalary: 68000, type: 'User' },
    { id: 8, title: 'QA Tester', defaultSalary: 65000, type: 'Worker' }
  ]);

  // State for employees with individual salaries (expanded to at least 10 users/workers)
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Jane Smith', role: 'Developer', salary: 87500, email: 'jane@finstruct.com' },
    { id: 2, name: 'Alex Johnson', role: 'Designer', salary: 78000, email: 'alex@finstruct.com' },
    { id: 3, name: 'Emily Wilson', role: 'Analyst', salary: 70000, email: 'emily@finstruct.com' },
    { id: 4, name: 'Michael Brown', role: 'Manager', salary: 98000, email: 'michael@finstruct.com' },
    { id: 5, name: 'Sarah Davis', role: 'Developer', salary: 82000, email: 'sarah@finstruct.com' },
    { id: 6, name: 'Robert Chen', role: 'DevOps Engineer', salary: 92000, email: 'robert@finstruct.com' },
    { id: 7, name: 'Jessica Park', role: 'QA Tester', salary: 67000, email: 'jessica@finstruct.com' },
    { id: 8, name: 'Thomas Garcia', role: 'HR Specialist', salary: 72000, email: 'thomas@finstruct.com' },
    { id: 9, name: 'Olivia Williams', role: 'Marketing Specialist', salary: 69500, email: 'olivia@finstruct.com' },
    { id: 10, name: 'David Kim', role: 'Developer', salary: 86500, email: 'david@finstruct.com' },
    { id: 11, name: 'Sophia Martinez', role: 'Designer', salary: 76000, email: 'sophia@finstruct.com' },
    { id: 12, name: 'James Taylor', role: 'Manager', salary: 97000, email: 'james@finstruct.com' },
    { id: 13, name: 'Emma Rodriguez', role: 'Analyst', salary: 71500, email: 'emma@finstruct.com' },
    { id: 14, name: 'Daniel Lee', role: 'DevOps Engineer', salary: 91000, email: 'daniel@finstruct.com' },
    { id: 15, name: 'Ava Thompson', role: 'QA Tester', salary: 66000, email: 'ava@finstruct.com' }
  ]);

  // State for active tab, search, sort, and modals
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [activeRoleType, setActiveRoleType] = useState('User');

  // State for new/edited role and employee
  const [editedRole, setEditedRole] = useState({ title: '', defaultSalary: 0, type: 'User' });
  const [editedEmployee, setEditedEmployee] = useState({ 
    name: '', 
    role: '', 
    salary: 0, 
    email: '' 
  });

  // Filter and sort employees/users/workers when search or sort settings change
  useEffect(() => {
    let allEmployees = [...employees];
    
    // Apply search filter
    if (searchTerm) {
      allEmployees = allEmployees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    allEmployees.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Special case for salary - parse as number
      if (sortBy === 'salary') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      // Sort string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Sort numeric values
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // Filter users (employees with role type "User")
    const userRoleTitles = roles.filter(role => role.type === 'User').map(role => role.title);
    const users = allEmployees.filter(emp => userRoleTitles.includes(emp.role));
    setFilteredUsers(users);

    // Filter workers (employees with role type "Worker")
    const workerRoleTitles = roles.filter(role => role.type === 'Worker').map(role => role.title);
    const workers = allEmployees.filter(emp => workerRoleTitles.includes(emp.role));
    setFilteredWorkers(workers);
  }, [employees, searchTerm, sortBy, sortOrder, roles]);

  // Filter and sort roles
  useEffect(() => {
    let filtered = [...roles];
    
    // Apply sorting to roles
    filtered.sort((a, b) => {
      let aValue = a[sortBy === 'title' ? 'title' : 'defaultSalary'];
      let bValue = b[sortBy === 'title' ? 'title' : 'defaultSalary'];
      
      // Special case for defaultSalary - parse as number
      if (sortBy === 'defaultSalary') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      // Sort string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Sort numeric values
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    setFilteredRoles(filtered);
  }, [roles, sortBy, sortOrder]);

  // Handle sort column click
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Get sort icon component
  const SortIcon = ({ column }) => {
    if (sortBy === column) {
      return (
        <span className="ml-1">
          {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        </span>
      );
    }
    return null;
  };

  // Open role modal for add or edit
  const handleRoleModal = (role = null) => {
    if (role) {
      // Edit existing role
      setCurrentRole(role);
      setEditedRole({ ...role });
      setActiveRoleType(role.type);
    } else {
      // Add new role
      setCurrentRole(null);
      setEditedRole({ title: '', defaultSalary: 0, type: 'User' });
      setActiveRoleType('User');
    }
    setShowRoleModal(true);
  };

  // Open employee modal for edit only
  const handleEmployeeModal = (employee) => {
    if (employee) {
      setCurrentEmployee(employee);
      setEditedEmployee({ ...employee });
      setShowEmployeeModal(true);
    }
  };

  // Handle role changes
  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setEditedRole({
      ...editedRole,
      [name]: name === 'defaultSalary' ? parseFloat(value) || 0 : value
    });
  };

  // Handle employee changes
  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'role') {
      // Update salary to role default when role changes (if salary hasn't been customized)
      const selectedRole = roles.find(r => r.title === value);
      const defaultSalary = selectedRole ? selectedRole.defaultSalary : 0;
      
      setEditedEmployee({
        ...editedEmployee,
        role: value,
        salary: currentEmployee ? editedEmployee.salary : defaultSalary
      });
    } else {
      setEditedEmployee({
        ...editedEmployee,
        [name]: name === 'salary' ? parseFloat(value) || 0 : value
      });
    }
  };

  // Set role type based on tab selection
  const handleRoleTypeChange = (type) => {
    setActiveRoleType(type);
    setEditedRole({
      ...editedRole,
      type: type
    });
  };

  // Save role changes
  const saveRole = () => {
    if (!editedRole.title) return;
    
    const roleWithType = {
      ...editedRole,
      type: activeRoleType
    };
    
    if (currentRole) {
      // Update existing role
      setRoles(roles.map(r => r.id === currentRole.id ? { ...roleWithType, id: currentRole.id } : r));
      
      // Update employees with this role to use the new default salary
      // Only if their salary matches the old default (hasn't been customized)
      const oldDefaultSalary = currentRole.defaultSalary;
      setEmployees(employees.map(emp => {
        if (emp.role === currentRole.title && emp.salary === oldDefaultSalary) {
          return { ...emp, salary: roleWithType.defaultSalary };
        }
        return emp;
      }));
    } else {
      // Add new role
      const newRoleId = Math.max(...roles.map(r => r.id), 0) + 1;
      setRoles([...roles, { ...roleWithType, id: newRoleId }]);
    }
    
    setShowRoleModal(false);
  };

  // Save employee changes
  const saveEmployee = () => {
    if (!editedEmployee.name || !editedEmployee.role) return;
    
    // Update existing employee
    setEmployees(employees.map(emp => 
      emp.id === currentEmployee.id ? { ...editedEmployee, id: currentEmployee.id } : emp
    ));
    
    setShowEmployeeModal(false);
  };

  // Delete role
  const deleteRole = (roleId) => {
    if (window.confirm('Are you sure? This will remove the role but not the employees.')) {
      setRoles(roles.filter(r => r.id !== roleId));
    }
  };

  // Delete employee
  const deleteEmployee = (empId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== empId));
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get role type color class
  const getRoleTypeColorClass = (type) => {
    switch (type) {
      case 'Worker':
        return 'bg-blue-100 text-blue-700';
      case 'User':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Determine if search box should be shown
  const showSearchBox = activeTab === 'users' || activeTab === 'workers';

  return (
    <div className="p-6">
      <div className="container mx-auto bg-white rounded shadow-md p-4 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Salary Management</h1>
          
          {showSearchBox && (
            <div className="flex items-center space-x-4 mr-10">
              <form className="flex w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
                />
                <button 
                  type="button" 
                  className="bg-black text-white cursor-pointer hover:bg-gray-800 py-2 px-4 rounded-r-md focus:outline-none"
                >
                  <Search size={18} />
                </button>
              </form>
            </div>
          )}

          {activeTab === "roles" && (
            <button 
              onClick={() => handleRoleModal()}
              className="flex items-center bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md"
            >
              <PlusCircle size={18} className="mr-2" /> Add New Role
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-6 flex items-center ${activeTab === 'users' ? 'border-b-2 border-black text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'} focus:outline-none`}
              onClick={() => setActiveTab('users')}
            >
              <User size={18} className="mr-2" /> Users
            </button>
            <button
              className={`py-2 px-6 flex items-center ${activeTab === 'workers' ? 'border-b-2 border-black text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'} focus:outline-none`}
              onClick={() => setActiveTab('workers')}
            >
              <HardHat size={18} className="mr-2" /> Workers
            </button>
            <button
              className={`py-2 px-6 flex items-center ${activeTab === 'roles' ? 'border-b-2 border-black text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'} focus:outline-none`}
              onClick={() => setActiveTab('roles')}
            >
              <Users size={18} className="mr-2" /> Roles & Default Salaries
            </button>
          </div>
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 font-medium">
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('name')}
              >
                User <SortIcon column="name" />
              </div>
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('email')}
              >
                Email <SortIcon column="email" />
              </div>
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('role')}
              >
                Role <SortIcon column="role" />
              </div>
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('salary')}
              >
                Salary <SortIcon column="salary" />
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => {
                // Check if user has default salary for their role
                const userRole = roles.find(r => r.title === user.role);
                const hasDefaultSalary = userRole && user.salary === userRole.defaultSalary;
                
                return (
                  <div key={user.id} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-1">{user.name}</div>
                    <div className="col-span-1">{user.email}</div>
                    <div className="col-span-1">{user.role}</div>
                    <div className="col-span-1">
                      {formatCurrency(user.salary)}
                      {hasDefaultSalary && (
                        <span className="ml-2 text-xs text-gray-500">(Default)</span>
                      )}
                    </div>
                    <div className="col-span-1 text-right flex justify-end gap-5">
                      <button
                        className="text-blue-700 mr-3 cursor-pointer focus:outline-none"
                        onClick={() => handleEmployeeModal(user)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-700 cursor-pointer focus:outline-none"
                        onClick={() => deleteEmployee(user.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">No users found</div>
            )}
          </div>
        )}

        {/* Workers Table */}
        {activeTab === 'workers' && (
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 font-medium">
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('name')}
              >
                Worker <SortIcon column="name" />
              </div>
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('role')}
              >
                Role <SortIcon column="role" />
              </div>
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('salary')}
              >
                Salary <SortIcon column="salary" />
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map(worker => {
                // Check if worker has default salary for their role
                const workerRole = roles.find(r => r.title === worker.role);
                const hasDefaultSalary = workerRole && worker.salary === workerRole.defaultSalary;
                
                return (
                  <div key={worker.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-1">{worker.name}</div>
                    <div className="col-span-1">{worker.role}</div>
                    <div className="col-span-1">
                      {formatCurrency(worker.salary)}
                      {hasDefaultSalary && (
                        <span className="ml-2 text-xs text-gray-500">(Default)</span>
                      )}
                    </div>
                    <div className="col-span-1 text-right flex justify-end gap-5">
                      <button
                        className="text-blue-700 mr-3 cursor-pointer focus:outline-none"
                        onClick={() => handleEmployeeModal(worker)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-700 cursor-pointer focus:outline-none"
                        onClick={() => deleteEmployee(worker.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">No workers found</div>
            )}
          </div>
        )}

        {/* Roles Table */}
        {activeTab === 'roles' && (
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 font-medium">
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('title')}
              >
                Role <SortIcon column="title" />
              </div>
              <div 
                className="col-span-2 cursor-pointer flex items-center justify-center" 
                onClick={() => handleSort('defaultSalary')}
              >
                Default Salary <SortIcon column="defaultSalary" />
              </div>
              <div className="col-span-1 text-center">Type</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            {filteredRoles.map(role => (
              <div key={role.id} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                <div className="col-span-1">{role.title}</div>
                <div className="col-span-2 text-center">{formatCurrency(role.defaultSalary)}</div>
                <div className="col-span-1 text-center">
                  
                    {role.type}
                  
                </div>
                <div className="col-span-1 text-right flex justify-end gap-5">
                  <button
                    className="text-blue-700 mr-3 cursor-pointer focus:outline-none"
                    onClick={() => handleRoleModal(role)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="text-red-700 cursor-pointer focus:outline-none"
                    onClick={() => deleteRole(role.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-[#7e7e7e18] bg-opacity-50 flex items-center shadow-md justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {currentRole ? 'Edit Role' : 'Add New Role'}
              </h2>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            {/* Role Type Tabs */}
            <div className="flex border-b border-gray-200 mb-4">
              <button
                className={`py-2 px-4 ${activeRoleType === 'User' ? 'border-b-2  font-medium ' : 'text-gray-500'}`}
                onClick={() => handleRoleTypeChange('User')}
              >
                User
              </button>
              <button
                className={`py-2 px-4 ${activeRoleType === 'Worker' ? 'border-b-2  font-medium ' : 'text-gray-500'}`}
                onClick={() => handleRoleTypeChange('Worker')}
              >
                Worker
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role Title</label>
              <input
                type="text"
                name="title"
                value={editedRole.title}
                onChange={handleRoleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-300 shadow-sm"
                placeholder="e.g. Developer"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Default Salary</label>
              <input
                type="number"
                name="defaultSalary"
                value={editedRole.defaultSalary}
                onChange={handleRoleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-300 shadow-sm"
                placeholder="e.g. 75000"
                min="0"
                step="1000"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-white rounded border border-gray-300 hover:bg-gray-300"
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center"
                onClick={saveRole}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-[#7e7e7e50] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Employee</h2>
              <button onClick={() => setShowEmployeeModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={editedEmployee.name}
                onChange={handleEmployeeChange}
                className="w-full px-4 py-2 rounded-lg focus:outline-none border border-gray-300 shadow-sm"
                placeholder="e.g. John Doe"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={editedEmployee.email}
                onChange={handleEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-300 shadow-sm"
                placeholder="e.g. john@finstruct.com"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={editedEmployee.role}
                onChange={handleEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-300 shadow-sm"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.title}>
                    {role.title} ({formatCurrency(role.defaultSalary)}) - {role.type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Salary</label>
              <input
                type="number"
                name="salary"
                value={editedEmployee.salary}
                onChange={handleEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none border-gray-300 shadow-sm"
                min="0"
                step="1000"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-300"
                onClick={() => setShowEmployeeModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center"
                onClick={saveEmployee}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    
    </div>
  );
};

export default Salary;