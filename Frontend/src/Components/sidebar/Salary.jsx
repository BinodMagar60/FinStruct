import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, ArrowUp, ArrowDown, X, Save, Users, User } from 'lucide-react';

const Salary = () => {
  // State for roles and default salaries
  const [roles, setRoles] = useState([
    { id: 1, title: 'Developer', defaultSalary: 85000 },
    { id: 2, title: 'Designer', defaultSalary: 75000 },
    { id: 3, title: 'Analyst', defaultSalary: 70000 },
    { id: 4, title: 'Manager', defaultSalary: 95000 }
  ]);

  // State for employees with individual salaries
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Jane Smith', role: 'Developer', salary: 87500, email: 'jane@finstruct.com' },
    { id: 2, name: 'Alex Johnson', role: 'Designer', salary: 78000, email: 'alex@finstruct.com' },
    { id: 3, name: 'Emily Wilson', role: 'Analyst', salary: 70000, email: 'emily@finstruct.com' },
    { id: 4, name: 'Michael Brown', role: 'Manager', salary: 98000, email: 'michael@finstruct.com' },
    { id: 5, name: 'Sarah Davis', role: 'Developer', salary: 82000, email: 'sarah@finstruct.com' }
  ]);

  // State for active tab, search, sort, and modals
  const [activeTab, setActiveTab] = useState('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  // State for new/edited role and employee
  const [editedRole, setEditedRole] = useState({ title: '', defaultSalary: 0 });
  const [editedEmployee, setEditedEmployee] = useState({ 
    name: '', 
    role: '', 
    salary: 0, 
    email: '' 
  });

  // Filter and sort employees when search or sort settings change
  useEffect(() => {
    let filtered = [...employees];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
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
    
    setFilteredEmployees(filtered);
  }, [employees, searchTerm, sortBy, sortOrder]);

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

  // Open role modal for edit only
  const handleRoleModal = (role) => {
    if (role) {
      setCurrentRole(role);
      setEditedRole({ ...role });
      setShowRoleModal(true);
    }
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

  // Save role changes
  const saveRole = () => {
    if (!editedRole.title) return;
    
    // Update existing role
    setRoles(roles.map(r => r.id === currentRole.id ? { ...editedRole, id: currentRole.id } : r));
    
    // Update employees with this role to use the new default salary
    // Only if their salary matches the old default (hasn't been customized)
    const oldDefaultSalary = currentRole.defaultSalary;
    setEmployees(employees.map(emp => {
      if (emp.role === currentRole.title && emp.salary === oldDefaultSalary) {
        return { ...emp, salary: editedRole.defaultSalary };
      }
      return emp;
    }));
    
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

  return (
    <div className="p-6">
      <div className="container mx-auto bg-white rounded shadow-md p-4 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Salary Management</h1>
          
          {activeTab === "employees" && (
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

          </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-6 flex items-center ${activeTab === 'employees' ? 'border-b-2 text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'} focus:outline-none`}
              onClick={() => setActiveTab('employees')}
            >
              <User size={18} className="mr-2" /> Employees
            </button>
            <button
              className={`py-2 px-6 flex items-center ${activeTab === 'roles' ? 'border-b-2 text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'} focus:outline-none`}
              onClick={() => setActiveTab('roles')}
            >
              <Users size={18} className="mr-2" /> Roles & Default Salaries
            </button>
          </div>
        </div>

        {/* Employees Table */}
        {activeTab === 'employees' && (
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 font-medium">
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('name')}
              >
                Employee <SortIcon column="name" />
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
            
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(employee => {
                // Check if employee has default salary for their role
                const employeeRole = roles.find(r => r.title === employee.role);
                const hasDefaultSalary = employeeRole && employee.salary === employeeRole.defaultSalary;
                
                return (
                  <div key={employee.id} className="grid grid-cols-5 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                    <div className="col-span-1">{employee.name}</div>
                    <div className="col-span-1">{employee.email}</div>
                    <div className="col-span-1">{employee.role}</div>
                    <div className="col-span-1">
                      {formatCurrency(employee.salary)}
                      {hasDefaultSalary && (
                        <span className="ml-2 text-xs text-gray-500">(Default)</span>
                      )}
                    </div>
                    <div className="col-span-1 text-right flex justify-end gap-5">
                      <button
                        className="text-blue-600 mr-3 cursor-pointer focus:outline-none"
                        onClick={() => handleEmployeeModal(employee)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="text-red-600 cursor-pointer focus:outline-none"
                        onClick={() => deleteEmployee(employee.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">No employees found</div>
            )}
          </div>
        )}

        {/* Roles Table */}
        {activeTab === 'roles' && (
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 font-medium">
              <div 
                className="col-span-1 cursor-pointer flex items-center" 
                onClick={() => handleSort('title')}
              >
                Role <SortIcon column="title" />
              </div>
              <div 
                className="col-span-2 cursor-pointer flex items-center" 
                onClick={() => handleSort('defaultSalary')}
              >
                Default Salary <SortIcon column="defaultSalary" />
              </div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            {roles.map(role => (
              <div key={role.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50">
                <div className="col-span-1">{role.title}</div>
                <div className="col-span-2">{formatCurrency(role.defaultSalary)}</div>
                <div className="col-span-1 text-right">
                  <button
                    className="text-blue-600 mr-3 cursor-pointer focus:outline-none"
                    onClick={() => handleRoleModal(role)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="text-red-600 cursor-pointer focus:outline-none"
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
        <div className="fixed inset-0 bg-[#7e7e7e50] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Role</h2>
              <button onClick={() => setShowRoleModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role Title</label>
              <input
                type="text"
                name="title"
                value={editedRole.title}
                onChange={handleRoleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. 75000"
                min="0"
                step="1000"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowRoleModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                onClick={saveRole}
              >
                <Save size={16} className="mr-2" /> Save
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="e.g. john@finstruct.com"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={editedEmployee.role}
                onChange={handleEmployeeChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.title}>
                    {role.title} ({formatCurrency(role.defaultSalary)})
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                min="0"
                step="1000"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowEmployeeModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                onClick={saveEmployee}
              >
                <Save size={16} className="mr-2" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Salary;