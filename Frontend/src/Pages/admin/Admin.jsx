import React from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <div className='bg-[#efefef] h-screen'>
      <Navbar/>
      <div className="flex">
      <Sidebar/>
      <span className='pt-24 w-full h-screen mx-15 overflow-x-auto p-5' style={{
        scrollbarWidth: "none"
      }}><Outlet/></span>
      </div>
    </div>
  );
};

export default Admin;
