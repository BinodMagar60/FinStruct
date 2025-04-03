import React, { useState, useEffect, useRef } from 'react';
import EmployeeAddNewUser from './EmployeeAddNewUser';

const EmployeeUser = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [isAddUser, setIsAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const addNewUserRef = useRef(null);

  const users = [
    { id: 1, name: 'New User', initials: 'NU', email: 'user@email.com', role: 'Developer' },
    { id: 2, name: 'Emily Wilson', initials: 'EW', email: 'emily@email.com', role: 'Analyst' },
    { id: 3, name: 'Alex Johnson', initials: 'AJ', email: 'alex@email.com', role: 'Designer' }
  ];

  const workers = [
    { id: 4, name: 'Jane Smith', initials: 'JS', email: 'jane@email.com', supervisedBy: 'Admin Team' },
    { id: 5, name: 'Codewave Asante', initials: 'CA', email: 'codewave@email.com', supervisedBy: 'Security Team' }
  ];

  useEffect(() => {
    // Initialize filtered arrays with all users/workers
    setFilteredUsers(users);
    setFilteredWorkers(workers);
  }, []);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    
    // Filter workers based on search term
    const filteredWork = workers.filter(worker => 
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      worker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.supervisedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkers(filteredWork);
  }, [searchTerm]);

  const addMember = () => {
    setIsAddUser(true);
  };

  const handleClickOutside = (event) => {
    // Check if the modal exists and if the clicked element is outside it
    if (addNewUserRef.current && !addNewUserRef.current.contains(event.target)) {
      setIsAddUser(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  useEffect(() => {
    if (isAddUser) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAddUser]); // Dependency array ensures effect runs when isAddUser changes

  return (
    <div className='p-6'>
      <div className="container mx-auto p-4 bg-white pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Team Members</h1>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="flex w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
              />
              <button 
                type="submit" 
                className="bg-black text-white cursor-pointer hover:bg-gray-800 py-2 px-4 rounded-r-md focus:outline-none"
              >
                Search
              </button>
            </form>
            <button
              className="bg-black text-white py-2 px-4 rounded-md flex items-center cursor-pointer hover:bg-gray-800 focus:outline-none"
              onClick={addMember}
            >
              <span className="mr-1">+</span> Add New User
            </button>
          </div>
        </div>

        {/* User and Worker Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-2 px-6 ${activeTab === 'users' ? 'border-b-2 text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'} focus:outline-none`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`py-2 px-6 ${activeTab === 'workers' ? 'border-b-2 text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'} focus:outline-none`}
              onClick={() => setActiveTab('workers')}
            >
              Workers
            </button>
          </div>
        </div>

        {/* User List */}
        {activeTab === 'users' ? (
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 font-medium">
              <div className="col-span-1">Full Name</div>
              <div className="col-span-1">Email</div>
              <div className="col-span-1">Role</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 items-center hover:bg-gray-50 transition-all">
                  <div className="col-span-1 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      {user.initials}
                    </div>
                    {user.name}
                  </div>
                  <div className="col-span-1">{user.email}</div>
                  <div className="col-span-1">{user.role}</div>
                  <div className="col-span-1 text-right">
                    <button className="text-blue-600 mr-3 cursor-pointer focus:outline-none">Edit</button>
                    <button className="text-red-600 cursor-pointer focus:outline-none">Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No users found</div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 font-medium">
              <div className="col-span-1">Full Name</div>
              <div className="col-span-1">Email</div>
              <div className="col-span-1">Supervised By</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {filteredWorkers.length > 0 ? (
              filteredWorkers.map(worker => (
                <div key={worker.id} className="grid grid-cols-4 gap-4 p-4 border-b items-center border-gray-200 hover:bg-gray-50 transition-all">
                  <div className="col-span-1 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-3">
                      {worker.initials}
                    </div>
                    {worker.name}
                  </div>
                  <div className="col-span-1">{worker.email}</div>
                  <div className="col-span-1">{worker.supervisedBy}</div>
                  <div className="col-span-1 text-right">
                    <button className="text-blue-600 mr-3 cursor-pointer focus:outline-none">Edit</button>
                    <button className="text-red-600 cursor-pointer focus:outline-none">Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No workers found</div>
            )}
          </div>
        )}
      </div>

      {/* Add New User Modal */}
      {isAddUser && (
        <div
          ref={addNewUserRef}
          className='absolute z-[1000] top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded'
        >
          <EmployeeAddNewUser isAddUser={isAddUser} setIsAddUser={setIsAddUser} />
        </div>
      )}
    </div>
  );
};

export default EmployeeUser;