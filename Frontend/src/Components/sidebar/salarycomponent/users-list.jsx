import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

export default function UsersList({ users, searchTerm, onEdit, onDelete }) {
  const userSavedDetail = JSON.parse(localStorage.getItem("userDetails"));

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower) ||
      user.salary.toString().includes(searchLower)
    );
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items) => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedUsers = getSortedItems(filteredUsers);

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? " ↑" : " ↓";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("username")}
            >
              User {getSortIndicator("username")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("email")}
            >
              Email {getSortIndicator("email")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("role")}
            >
              Job Title {getSortIndicator("role")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort("salary")}
            >
              Salary {getSortIndicator("salary")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right font-medium uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedUsers.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap capitalize">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.jobTitleId.titleName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                ${user.salary.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {userSavedDetail?.isOwner ||
                (userSavedDetail?.role === "admin" &&
                  !user.isOwner &&
                  user.role !== "admin") ? (
                  <button
                    onClick={() => onEdit(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
