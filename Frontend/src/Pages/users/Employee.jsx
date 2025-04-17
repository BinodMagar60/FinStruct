import React, {useState, useRef} from 'react'
import Navbar from '../../Components/Navbar'
import EmployeeSidebar from './EmployeeSideBar';
import { Outlet } from 'react-router-dom';
import Logout from '../../Components/Logout';

const Employee = () => {
    const [isLogout, setLogout] = useState(false);
    

    
  

  return (
    <>
    <div className='bg-[#efefef] h-screen relative'>
        <Navbar isLogout={isLogout} setLogout={setLogout}/>

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

      {isLogout && <Logout isLogout={isLogout} setLogout={setLogout} />} 

    </div>
    </>
  )
}

export default Employee