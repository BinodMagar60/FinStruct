import React, { useState, useEffect, useRef } from "react";
import { User, Users } from "lucide-react";

const EmployeeAddNewUser = ({ isAddUser, setIsAddUser }) => {


  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    adminAccess: "",
  });

  const userRoles = [
    "Architect",
    "Structural Engineer",
    "Civil Engineer",
    "Site Manager",
    "Construction Supervisor",
    "Safety Officer",
    "Quality Control Inspector",
  ];
  const workerRoles = [
    "Equipment Operator",
    "Mason",
    "Carpenter",
    "Electrician",
    "Plumber",
    "Weilder",
    "General Laborer",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form submission
    console.log("Submitting:", { type: activeTab, ...formData });
    // Reset form after submission
    setFormData({ fullName: "", email: "", phone: "", role: "" });
  };

  return (
    <div className="w-120 mx-auto border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
      <div className="bg-gray-50 border-b border-gray-300 p-4">
        <h2 className="text-xl font-bold">Add New Worker</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
        
          {/* Worker Form */}
          <div
            className={`space-y-4 `}
          >
            <div className="space-y-2">
              <label
                htmlFor="w-fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="w-fullName"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="w-email"
                className="block text-sm font-medium text-gray-700"
              >
                Phone no.
              </label>
              <input
                type="number"
                id="w-phone"
                name="phone"
                placeholder="Enter contact number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="w-email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="w-email"
                name="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="w-role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="w-role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {workerRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 bg-gray-50 border-t p-4 border-gray-300">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            onClick={() => setIsAddUser(!isAddUser)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 cursor-pointer"
          >
            Add Team Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeAddNewUser;
