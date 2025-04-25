import { Upload, User, Edit2, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { profileDetails, profileDetailsUpdate } from "../../api/AdminApi";

const ProfileUser = () => {
  const user = JSON.parse(localStorage.getItem("userDetails"));

  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [userData, setUserData] = useState({});
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileDetails(`admin/user/profile/${user.email}`);
        setUserData(response);
        setOriginalData(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (value.trim() !== "") {
      validateField(name, value.trim());
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "username" && !/^[A-Za-z][0-9A-Za-z\s]*$/.test(value)) {
      errorMsg = "Invalid Name.";
    }
    

    if (name === "phoneNumber" && !/^(97|98)\d{8}$/.test(value)) {
      errorMsg = "Invalid Phone Number";
    }

    if (
      name === "personalEmail" &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(value)
    ) {
      errorMsg = "Invalid Email";
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const validateInputs = () => {
    const fieldsToValidate = ["username", "personalEmail", "phoneNumber"];
    let validationErrors = {};
  
    fieldsToValidate.forEach((field) => {
      const newValue = (userData[field] || "");
      const originalValue = (originalData[field] || "");
  

      if (newValue !== originalValue) {
        let errorMsg = "";
  

        if (field === "username") {
          if (newValue === "") {
            errorMsg = "Username is required.";
          } else if (!/^[A-Za-z][0-9A-Za-z\s]*$/.test(newValue)) {
            errorMsg = "Invalid Name.";
          }
        }
  

        if (field === "phoneNumber" && newValue !== "" && !/^(97|98)\d{8}$/.test(newValue)) {
          errorMsg = "Invalid Phone Number";
        }
  
        if (
          field === "personalEmail" &&
          newValue !== "" &&
          !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(newValue)
        ) {
          errorMsg = "Invalid Email";
        }
  
        if (errorMsg) {
          validationErrors[field] = errorMsg;
        }
      }
    });
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validateInputs()) return;

    setIsEditing(false);
    try {
      await profileDetailsUpdate(`admin/user/profile/${user.email}`, userData);
      setOriginalData(userData);
      localStorage.setItem("userDetails", JSON.stringify(userData));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setUserData(originalData);
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer"
                  >
                    <Upload size={16} />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold capitalize">
                  {userData.username}
                </h2>
                <p className="text-gray-500">
                  {userData.isOwner
                    ? "Owner"
                    : userData.role === "Admin"
                    ? "Admin"
                    : "Employee"}{" "}
                  at <span className="capitalize">{userData.company}</span>
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                className="flex items-center space-x-1 bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-md cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="username"
                  className={`w-full px-3 py-2 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-md capitalize`}
                  value={userData.username || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address (Personal)
                </label>
                <input
                  type="email"
                  name="personalEmail"
                  className={`w-full px-3 py-2 border ${
                    errors.personalEmail ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                  value={userData.personalEmail || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
                {errors.personalEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.personalEmail}
                  </p>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  className={`w-full px-3 py-2 border ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                  value={userData.phoneNumber || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md capitalize"
                  value={userData.location || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address (Work)
                </label>
                <input
                  type="text"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  value={userData.email || ""}
                  readOnly
                />
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 capitalize"
                  value={userData.company || ""}
                  readOnly
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  value={userData.isOwner ? "Owner" : userData.role === "admin" ? "Admin" : "Employee"}
                  readOnly
                />
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Write a short bio about yourself..."
                value={userData.bio || ""}
                onChange={handleInputChange}
                readOnly={!isEditing}
              ></textarea>
            </div>


            {isEditing && (
              <div className="flex items-center justify-end pt-4 border-t border-gray-200 space-x-3">
                <button
                  onClick={handleCancel}
                  className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md flex items-center space-x-1"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={Object.values(errors).some((err) => err)}
                  className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
