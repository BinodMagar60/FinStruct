import { useState } from "react";
import { Search, Plus, X } from "lucide-react";

export default function TeamMembers(props) {
  const userdetails = JSON.parse(localStorage.getItem("userDetails"));
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("username");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const users = props.users || [];
  const workers = props.workers || [];

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleAddUser = () =>
    props.onAddUser ? props.onAddUser() : console.log("Add user clicked");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (user) => props.onEditUser && props.onEditUser(user);

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (props.onDeleteUser && userToDelete) {
      props.onDeleteUser(userToDelete._id);
    }
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleViewUser = (user) => {
    if (userdetails.role === "employee") return;
    if (props.onViewUser) props.onViewUser(user._id);
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const getRandomColor = (id) => {
    const colors = ["bg-blue-600", "bg-green-600", "bg-purple-600", "bg-pink-600"];
    return colors[Number.parseInt(id, 16) % colors.length];
  };

  const getSortedAndFilteredData = (data) => {
    const filtered = data.filter((item) => {
      const username = String(item.username || "").toLowerCase();
      const email = String(item.email || "").toLowerCase();
      const phoneNumber = String(item.phoneNumber || "").toLowerCase();
      const query = searchQuery.toLowerCase();

      return (
        username.includes(query) ||
        email.includes(query) ||
        phoneNumber.includes(query)
      );
    });

    return filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "jobTitleId") {
        aVal = a.jobTitleId?.name || "";
        bVal = b.jobTitleId?.name || "";
      }
      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  const canShowUserActions = (user) => {
    if (userdetails.role !== "admin") return false;
    if (userdetails.isOwner) return true;
    return user.role !== "admin";
  };

  const canShowWorkerActions = () => userdetails.role === "admin";

  return (
    <div className="relative overflow-hidden">
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-[#0000003d] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
              <button
                onClick={cancelDelete}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <strong>{userToDelete.username}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 w-full gap-4">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="border border-gray-300 rounded-md py-2 px-4 pr-10 w-full focus:outline-none"
            />
            <button className="absolute inset-y-0 right-0 px-3 flex items-center bg-black text-white rounded-r-md">
              <Search className="h-5 w-5" />
            </button>
          </div>
          {userdetails.role === "admin" && (
            <button
              onClick={handleAddUser}
              className="bg-black text-white px-4 py-2 rounded-md flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg w-full">
        <div className="border-b border-gray-300">
          <div className="flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-2 font-medium ${
                activeTab === "users"
                  ? "border-b-2 border-black shadow-inner"
                  : "text-gray-500"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("workers")}
              className={`px-6 py-2 font-medium ${
                activeTab === "workers"
                  ? "border-b-2 border-black shadow-inner"
                  : "text-gray-500"
              }`}
            >
              Workers
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th
                  className="text-left px-6 py-4 cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Full Name
                </th>
                <th
                  className="text-left px-6 py-4 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  {activeTab === "workers" ? "Contact" : "Email"}
                </th>
                <th
                  className="text-left px-6 py-4 cursor-pointer"
                  onClick={() => handleSort("jobTitleId")}
                >
                  Job Title
                </th>
                {userdetails.role !== "employee" && (
                  <th className="text-right px-6 py-4 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(activeTab === "users"
                ? getSortedAndFilteredData(users)
                : getSortedAndFilteredData(workers)
              ).map((item) => (
                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 cursor-pointer border-gray-300"
                >
                  <td
                    className="px-6 py-4"
                    onClick={() => handleViewUser(item)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getRandomColor(
                          item._id
                        )}`}
                      >
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.username}
                            className="rounded-full"
                          />
                        ) : (
                          getInitials(item.username)
                        )}
                      </div>
                      <span className="capitalize">{item.username}</span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={() => handleViewUser(item)}
                  >
                    {activeTab === "users" ? item.email : item.phoneNumber}
                  </td>
                  <td
                    className="px-6 py-4 capitalize"
                    onClick={() => handleViewUser(item)}
                  >
                    {item.jobTitleId?.name || "Not assigned"}
                  </td>
                  {(activeTab === "users" && canShowUserActions(item)) ||
                  (activeTab === "workers" && canShowWorkerActions()) ? (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                        >
                          Edit
                        </button>
                        {!item.isOwner && (
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item);
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="md:hidden grid gap-4 p-4">
            {(activeTab === "users"
              ? getSortedAndFilteredData(users)
              : getSortedAndFilteredData(workers)
            ).map((item) => (
              <div
                key={item._id}
                className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => handleViewUser(item)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getRandomColor(
                      item._id
                    )}`}
                  >
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.username}
                        className="rounded-full"
                      />
                    ) : (
                      getInitials(item.username)
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{item.username}</h3>
                    <p className="text-sm text-gray-600">
                      {activeTab === "users" ? item.email : item.phoneNumber}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 capitalize mb-2">
                  <strong>Job Title:</strong>{" "}
                  {item.jobTitleId?.name || "Not assigned"}
                </p>
                {(activeTab === "users" && canShowUserActions(item)) ||
                (activeTab === "workers" && canShowWorkerActions()) ? (
                  <div className="flex justify-end gap-3">
                    <button
                      className="text-blue-500 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                    >
                      Edit
                    </button>
                    {!item.isOwner && (
                      <button
                        className="text-red-500 text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item);
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
