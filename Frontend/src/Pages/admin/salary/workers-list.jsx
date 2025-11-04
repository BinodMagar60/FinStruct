import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { getInitials } from "../../../utils/getInitials"

export default function WorkersList({ workers, searchTerm, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })

  const filteredWorkers = workers.filter((worker) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      worker.username.toLowerCase().includes(searchLower) ||
      worker.role.toLowerCase().includes(searchLower) ||
      worker.salary.toString().includes(searchLower)
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

  const sortedWorkers = getSortedItems(filteredWorkers)

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? " ↑" : " ↓"
  }

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
              Worker {getSortIndicator("username")}
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
            <th scope="col" className="px-6 py-3 text-right font-medium uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedWorkers.map((worker) => (
            <tr key={worker._id}>
              <td className="px-6 py-4 whitespace-nowrap capitalize flex gap-2 items-center">
                {worker.photo ? (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white overflow-hidden">
                                  <img
                                    src={worker.photo}
                                    alt={worker.username}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-blue-600">
                                  {getInitials(worker.username)}
                                </div>
                              )}
                {worker.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{worker.jobTitleId.titleName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                Rs. {worker.salary.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onEdit(worker)} className="text-blue-600 hover:text-blue-900 mr-4">
                  <Edit2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
