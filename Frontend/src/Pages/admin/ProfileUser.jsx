import { Upload, User, Edit2, Save, X } from 'lucide-react';
import React, { useState } from 'react';

const ProfileUser = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  const [userData, setUserData] = useState({
    name: "Binod Kaucha",
    title: "Owner",
    email: "binod.kaucha@finstruct.com",
    phone: "9812345678",
    company: "FinStruct Inc.",
    location: "New York, NY",
    joinDate: "March 2023",
    bio: ""
  });

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
      [name]: value
    }));

    // Live validation
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
  
    if (name === "name") {
      if (!/^[A-Za-z][0-9A-Za-z\s]*$/.test(value.trim())) {
        errorMsg = "Invalid Name.";
      }
    }
  
    if (name === "phone") {
      if (!/^(97|98)\d{8}$/.test(value.trim())) {
        errorMsg = "Invalid Phone Number";
      }
    }
  
    if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/.test(value.trim())) {
        errorMsg = "Invalid Email";
      }
    }
  
    if (name === "location") {
      if (!value.trim()) {
        errorMsg = "Location cannot be empty.";
      }
    }
  
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
  };
  

  const validateInputs = () => {
    const requiredFields = ["name", "email", "phone", "location"];
    let validationErrors = {};

    requiredFields.forEach((field) => {
      validateField(field, userData[field]);
      if (!userData[field].trim()) {
        validationErrors[field] = "This field is required.";
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateInputs()) return;
    console.log("Saving user data:", userData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
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
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                {isEditing && (
                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer">
                    <Upload size={16} />
                    <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-gray-500">{userData.title} at {userData.company}</p>
              </div>
            </div>

            {!isEditing ? (
              <button className="flex items-center space-x-1 bg-black hover:bg-gray-800 text-white px-3 py-2 rounded-md cursor-pointer" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            ) : null}
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "name" },
                { label: "Email Address", name: "email", type: "email" },
                { label: "Phone Number", name: "phone", type: "tel" },
                { label: "Location", name: "location" }
              ].map(({ label, name, type = "text" }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} name={name} className={`w-full px-3 py-2 border ${errors[name] ? "border-red-500" : "border-gray-300"} rounded-md`} value={userData[name]} onChange={handleInputChange} readOnly={!isEditing} />
                  {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" name="company" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" value={userData.company} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input type="text" name="title" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" value={userData.title} readOnly />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea name="bio" className="w-full px-3 py-2 border border-gray-300 rounded-md" rows="4" placeholder="Write a short bio about yourself..." value={userData.bio} onChange={handleInputChange} readOnly={!isEditing}></textarea>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-200">
              {isEditing && (
                <div className="flex space-x-3">
                  <button onClick={handleCancel} className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-md flex items-center space-x-1">
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button onClick={handleSave} disabled={Object.values(errors).some(err => err)} className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
