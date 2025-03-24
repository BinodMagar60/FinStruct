import React, {useState, useRef} from 'react'
import Navbar from '../../Components/Navbar'
import EmployeeSidebar from './EmployeeSideBar';
import { Outlet } from 'react-router-dom';

const Employee = () => {
    const [isLogout, setLogout] = useState(true);
    const modalRef = useRef(null)

    const handleLogout = () => {
      // removeCookie('authToken')
      // navigate('/')
      setLogout(!isLogout)
    }

  return (
    <>
    <div className='bg-[#efefef] h-screen relative'>
        <Navbar isLogout={isLogout} setLogout={setLogout}/>

      <div className='w-full flex'>
        <EmployeeSidebar />
        <span>
          <Outlet/>
        </span>
      </div>


    </div>
    </>
  )
}

export default Employee