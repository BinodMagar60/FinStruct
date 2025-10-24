import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Pages/admin/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import Logout from "../../Components/Logout";

const Admin = () => {
  const [isLogout, setLogout] = useState(false);
  const user = JSON.parse(localStorage.getItem("userDetails"));

  return (
    <div className="bg-[#efefef] h-screen relative">
      <Navbar isLogout={isLogout} setLogout={setLogout} user={user} />
      <div className="flex">
        <Sidebar />
        <span
          className="pt-24 w-full h-screen  overflow-x-auto p-4"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <Outlet />
        </span>
      </div>

      {isLogout && <Logout setLogout={setLogout} isLogout={isLogout} />}
    </div>
  );
};

export default Admin;
