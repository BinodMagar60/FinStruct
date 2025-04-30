import { useState } from "react";
import { Search, Plus } from "lucide-react";

export default function TeamMembers(props) {
  const userdetails = JSON.parse(localStorage.getItem("userDetails"));
  const [activeTab, setActiveTab] = useState("users");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState("user");
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");

  // Use props.users and props.workers if provided, otherwise use default data
  const users = props.users;

  const workers = props.workers;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddUser = () => {
    if (props.onAddUser) {
      props.onAddUser();
    } else {
      setShowAddModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (user) => {
    if (props.onEditUser) {
      props.onEditUser(user);
    }
  };

  const handleDelete = (user) => {
    if (confirm(`Are you sure you want to delete ${user.username}?`)) {
      if (props.onDeleteUser) {
        props.onDeleteUser(user._id);
      }
    }
  };

  const handleViewUser = (user) => {
    if (userdetails.role === "employee") {
      return;
    }

    if (props.onViewUser) {
      props.onViewUser(user._id);
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getRandomColor = (id) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
    ];
    return colors[Number.parseInt(id, 16) % colors.length];
  };

  const getSortedAndFilteredData = (data) => {
    // First filter by search query
    const filteredData = data.filter(
      (item) =>
        item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Then sort by the selected field
    return filteredData.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle nested properties like jobTitleId.name
      if (sortField === "jobTitleId") {
        aValue = a.jobTitleId?.name || "";
        bValue = b.jobTitleId?.name || "";
      } else if (sortField === "role" && activeTab === "users") {
        aValue = a.jobTitleId?.name || a.role;
        bValue = b.jobTitleId?.name || b.role;
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              className="border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none"
              onChange={handleSearch}
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

          {userdetails.role === "admin" && (
            <button
              onClick={handleAddUser}
              className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <Plus size={18} /> Add New User
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg">
        <div className="border-b border-gray-300">
          <div className="flex">
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === "users"
                  ? "border-b-2 border-black shadow-inner"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`px-6 py-2 font-medium ${
                activeTab === "workers"
                  ? "border-b-2 border-black shadow-inner"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("workers")}
            >
              Workers
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left px-6 py-4">
                  <div
                    className="flex items-center gap-1 cursor-pointer font-medium "
                    onClick={() => handleSort("username")}
                  >
                    Full Name
                    {sortField === "username" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="text-left px-6 py-4">
                  <div
                    className="flex items-center gap-1 cursor-pointer font-medium"
                    onClick={() => handleSort("email")}
                  >
                    Email
                    {sortField === "email" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </div>
                </th>
                <th className="text-left px-6 py-4">
                  <div
                    className="flex items-center gap-1 cursor-pointer font-medium"
                    onClick={() => handleSort("jobTitleId")}
                  >
                    Job Title
                    {sortField === "jobTitleId" && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? " ↑" : " ↓"}
                      </span>
                    )}
                  </div>
                </th>
                {userdetails.role === "admin" && (
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === "users"
                ? getSortedAndFilteredData(users).map((user) => (
                    <tr
                      key={user._id}
                      className="border-t hover:bg-gray-50 cursor-pointer border-gray-300"
                    >
                      <td
                        className="px-6 py-4"
                        onClick={() => handleViewUser(user)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getRandomColor(
                              user._id
                            )}`}
                          >
                            {getInitials(user.username)}
                          </div>
                          <span>{user.username}</span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => handleViewUser(user)}
                      >
                        {user.email}
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => handleViewUser(user)}
                      >
                        {user.jobTitleId?.name || "Not assigned"}
                      </td>

                      {userdetails.isOwner || user.role === "employee" ? (
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(user);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))
                : getSortedAndFilteredData(workers).map((worker) => (
                    <tr
                      key={worker._id}
                      className="border-t border-gray-300 hover:bg-gray-50 cursor-pointer"
                    >
                      <td
                        className="px-6 py-4"
                        onClick={() => handleViewUser(worker)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getRandomColor(
                              worker._id
                            )}`}
                          >
                            {getInitials(worker.username)}
                          </div>
                          <span>{worker.username}</span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => handleViewUser(worker)}
                      >
                        {worker.email}
                      </td>
                      <td
                        className="px-6 py-4"
                        onClick={() => handleViewUser(worker)}
                      >
                        {worker.jobTitleId?.name || "Not assigned"}
                      </td>
                      {userdetails.role === "admin" && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(worker);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(worker);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
