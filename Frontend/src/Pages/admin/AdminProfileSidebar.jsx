import { Clock4, Settings, User } from "lucide-react";
import React, { useState } from "react";

const AdminProfileSidebar = () => {
  const [activeTab, setActiveTab] = useState("Profile");

  const sidebar = [
    { name: "Profile", logo: <User /> },
    { name: "Setting", logo: <Settings /> },
    { name: "Activity log", logo: <Clock4 /> },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white pt-24 shadow-lg">
      <ul className="flex flex-col text-gray-900 text-xl">
        {sidebar.map((item) => (
          <li
            key={item.name}
            className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
              activeTab === item.name ? "bg-black text-white hover:text-black" : ""
            }`}
            onClick={() => setActiveTab(item.name)}
          >
            <span className="mr-3">{item.logo}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProfileSidebar;
