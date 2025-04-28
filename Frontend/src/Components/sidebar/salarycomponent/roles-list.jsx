import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"

export default function RolesList({ roles, searchTerm, onEdit, onDelete, onAddRole }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })

  const filteredRoles = roles.filter((role) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      role.titleName.toLowerCase().includes(searchLower) ||
      role.defaultSalary.toString().includes(searchLower) ||
      role.role.toLowerCase().includes(searchLower)
    )
  })

  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const getSortedItems = (items) => {
    if (!sortConfig.key) return items

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  const sortedRoles = getSortedItems(filteredRoles)

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? " ↑" : " ↓"
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("titleName")}
              >
                Role {getSortIndicator("titleName")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("defaultSalary")}
              >
                Default Salary {getSortIndicator("defaultSalary")}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-medium uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort("role")}
              >
                Type {getSortIndicator("role")}
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
            {sortedRoles.map((role) => (
              <tr key={role._id}>
                <td className="px-6 py-4 whitespace-nowrap">{role.titleName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${role.defaultSalary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{role.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button onClick={() => onEdit(role)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button onClick={() => onDelete(role._id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
