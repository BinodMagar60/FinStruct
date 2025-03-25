import React, {useState, useRef} from 'react'
import Navbar from '../../Components/Navbar'
import EmployeeSidebar from './EmployeeSideBar';
import { Outlet } from 'react-router-dom';

const Employee = () => {
    const [isLogout, setLogout] = useState(true);
    

    const profile = [
      "/employee/profile/profileuser",
      "/employee/profile/setting",
      "/employee/profile/activity"
    ]
  

  return (
    <>
    <div className='bg-[#efefef] h-screen relative'>
        <Navbar isLogout={isLogout} setLogout={setLogout} profile={profile}/>

      <div className=' flex'>
        <span >
        <EmployeeSidebar />
        </span>
        <span className='pt-24 w-full h-screen mx-15 overflow-x-auto p-5' style={{
        scrollbarWidth: "none"
      }}>
          <Outlet/>
        </span>
      </div>


    </div>
    </>
  )
}

export default Employee