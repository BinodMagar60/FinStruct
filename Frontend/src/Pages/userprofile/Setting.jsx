import React, { useState } from "react";
import { Eye, EyeOff, Save, Lock, AlertCircle, ChevronsRightLeft } from "lucide-react";
import { changePassword } from "../../api/AdminApi";
import { toast} from 'react-toastify'

const Setting = () => {
  const userData = JSON.parse(localStorage.getItem("userDetails"));
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // const [successMessage, setSuccessMessage] = useState("");

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear success message when user starts typing again
    // if (successMessage) {
    //   setSuccessMessage("");
    // }
  };

  const validateForm = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Check if current password is empty
    if (!passwords.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    // Check if new password is empty
    if (!passwords.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    }
    // Check if new password meets requirements
    else if (passwords.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
      isValid = false;
    } else if (!passwordRegex.test(passwords.newPassword)) {
      newErrors.newPassword = "Password doesn't meet the requirements.";
      isValid = false; // Don't forget to set isValid to false
    }

    // Check if confirm password matches new password
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (validateForm()) {
      const data = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }

      try{
        const response = await changePassword(`admin/user/password/${userData.id}`, data)
        // console.log(response)
        toast.success(response.message,{
          autoClose: 1000,
          theme: "light"
        })
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      catch (error){
        // console.log(error)
        toast.error(error.message,{
          autoClose: 1500,
          theme: "light",
        })
      }

      
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Lock size={24} />
            <h2 className="text-2xl font-bold">Security Settings</h2>
          </div>

  

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-gray-500">
                Ensure your account remains secure by creating a strong
                password.
              </p>

              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      className={`w-full px-3 py-2 pr-10 border ${
                        errors.currentPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      value={passwords.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                    >
                      {showPasswords.currentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      name="newPassword"
                      className={`w-full px-3 py-2 pr-10 border ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      value={passwords.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => togglePasswordVisibility("newPassword")}
                    >
                      {showPasswords.newPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword ? (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.newPassword}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Password must be at least 8 characters long
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={`w-full px-3 py-2 pr-10 border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md`}
                      value={passwords.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                    >
                      {showPasswords.confirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  <h4 className="font-medium">Password Requirements:</h4>
                  <ul className="text-sm text-gray-600 list-disc pl-5">
                    <li>At least 8 characters long</li>
                    <li>Include at least one uppercase letter</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md flex items-center space-x-1 cursor-pointer"
                >
                  <Save size={16} />
                  <span>Update Password</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;
