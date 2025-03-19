import React, { useState } from 'react';

const User = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  const users = [
    { id: 1, name: 'New User', initials: 'NU', email: 'user@email.com', role: 'Developer' },
    { id: 2, name: 'Emily Wilson', initials: 'EW', email: 'emily@email.com', role: 'Analyst' },
    { id: 3, name: 'Alex Johnson', initials: 'AJ', email: 'alex@email.com', role: 'Designer' }
  ];
  
  const workers = [
    { id: 4, name: 'Jane Smith', initials: 'JS', email: 'jane@email.com', supervisedBy: 'Admin Team' },
    { id: 5, name: 'Codewave Asante', initials: 'CA', email: 'codewave@email.com', supervisedBy: 'Security Team' }
  ];

  return (
    <div className='p-6'>
      <div className="container mx-auto p-4 bg-white pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button className="bg-black text-white py-2 px-4 rounded-md flex items-center cursor-pointer hover:bg-gray-800">
          <span className="mr-1">+</span> Add New User
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200 ">
          <button
            className={`py-2 px-6 ${activeTab === 'users' ? 'border-b-2 text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`py-2 px-6 ${activeTab === 'workers' ? ' border-b-2 text-black font-medium shadow-inner bg-gray-50' : 'text-gray-500'}`}
            onClick={() => setActiveTab('workers')}
          >
            Workers
          </button>
        </div>
      </div>
      
      {activeTab === 'users' ? (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 font-medium">
            <div className="col-span-1">Full Name</div>
            <div className="col-span-1">Email</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {users.map(user => (
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
                <button className="text-blue-600 mr-3 cursor-pointer">Edit</button>
                <button className="text-red-600 cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 border-b border-gray-200 font-medium">
            <div className="col-span-1">Full Name</div>
            <div className="col-span-1">Email</div>
            <div className="col-span-1">Supervised By</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          {workers.map(worker => (
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
                <button className="text-blue-600 mr-3 cursor-pointer">Edit</button>
                <button className="text-red-600 cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default User;