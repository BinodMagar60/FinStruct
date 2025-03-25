import { Clock4, Settings, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isAdmin, setIsAdmin] =useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  // useEffect(() => {
  //   if (activeTab === "Profile") {
  //     // navigate("/admin/profile/profileuser");
  //   }
  // }, [activeTab]);

  useEffect(() => {
    const currentPath = location.pathname;
    const foundTab = sidebar.find((item) => item.url === currentPath);
    if (foundTab) {
      setActiveTab(foundTab.name);
    }
  }, [location.pathname]);


  const sidebar = [
    { name: "Profile", logo: <User />, url: isAdmin? "/admin/profile/profileuser":"/employee/profile/profileuser" },
    { name: "Setting", logo: <Settings />, url: isAdmin? "/admin/profile/setting": "/employee/profile/setting" },
    { name: "Activity log", logo: <Clock4 />, url: isAdmin? "/admin/profile/activity":"/employee/profile/activity" },
  ];




  useEffect(() => {
    const handlePopState = () => {
      if(isAdmin){
        navigate("/admin");
      }else{
        navigate("/employee")
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="h-screen w-74 bg-white pt-24 shadow-lg">
      <ul className="flex flex-col text-gray-900 text-xl">
        {sidebar.map((item) => {
          return (
            <Link
              to={item.url}
              key={item.name}

            >
              <li
                className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
                  activeTab === item.name
                    ? "bg-black text-white hover:text-black"
                    : ""
                }`}
                onClick={() => setActiveTab(item.name)}
              >
                <span className="mr-3">{item.logo}</span>
                <span>{item.name}</span>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default ProfileSidebar;
