import React, { useState } from "react";
import { User, Users } from "lucide-react";

const AddNewUser = ({ isAddUser, setIsAddUser }) => {
  const [activeTab, setActiveTab] = useState("user");
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      activeTab === "user"
        ? "/api/users/add-user"
        : "/api/workers/add-worker";

    const payload = {
      ...formData,
      adminAccess: activeTab === "user" ? isChecked : false,
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response:", data);

      // Clears the form
      setFormData({ fullName: "", email: "", phone: "", role: "" });
      setIsChecked(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-120 mx-auto border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white">
      <div className="bg-gray-50 border-b p-4 border-gray-200">
        <h2 className="text-xl font-bold">Add New Team Member</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex rounded-md overflow-hidden border">
              <button
                type="button"
                className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 text-sm font-medium ${
                  activeTab === "user"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("user")}
              >
                <User size={18} />
                User
              </button>
              <button
                type="button"
                className={`flex items-center justify-center gap-2 flex-1 py-2 px-4 text-sm font-medium ${
                  activeTab === "worker"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab("worker")}
              >
                <Users size={18} />
                Worker
              </button>
            </div>
          </div>

          {/* Common Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone no.
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="" disabled>
                  Select a role
                </option>
                {(activeTab === "user" ? userRoles : workerRoles).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Admin Access Switch */}
            {activeTab === "user" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Admin Access
                </label>
                <div className="relative inline-block w-11 h-5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="peer hidden"
                  />
                  <div
                    className={`w-11 h-5 rounded-full transition-colors duration-300 cursor-pointer ${
                      isChecked ? "bg-slate-800" : "bg-slate-100"
                    }`}
                    onClick={() => setIsChecked(!isChecked)}
                  ></div>
                  <div
                    className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full border shadow-sm transition-transform duration-300 cursor-pointer ${
                      isChecked
                        ? "translate-x-6 border-slate-800"
                        : "border-slate-300"
                    }`}
                    onClick={() => setIsChecked(!isChecked)}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 bg-gray-50 border-t p-4 border-gray-200">
          <button
            type="button"
            onClick={() => setIsAddUser(!isAddUser)}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800"
          >
            Add Team Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewUser;
