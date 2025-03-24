
import React,{ useState, useEffect, useRef} from 'react'
import { useCookies } from 'react-cookie'
import { IoIosWarning } from "react-icons/io";

const Logout = ({isLogout, setLogout}) => {

  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setLogout(false);
      }
    };

    if (isLogout) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLogout]);



  const handleLogout = () =>{
    setLogout(!isLogout)
  }

  const handleCancel = () =>{
    setLogout(!isLogout)
  }


  return (
    <>

    <div className="w-full h-screen absolute top-0 z-[998] bg-[#00000042]">

    <div ref={modalRef} className="absolute z-[999] top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]  text-2xl  shadow-inner border border-gray-300 rounded-xl ">
    <div className='w-full flex flex-col rounded-xl  gap-3 justify-center items-center bg-white px-15 py-10'>
      <div className='p-5 rounded-full bg-[#FEF9C3] '><IoIosWarning size={50} color='#EAB308'/></div>
      <div className='font-extrabold text-3xl'>Logout</div>
      <div className='text-center text-xl font-light'>Are you sure you would like to logout of your account?</div>
      <div className='text-[16px] flex gap-5'>
        <button className='border px-3 py-2 rounded cursor-pointer  hover:bg-gray-200 transition-all border-black' onClick={handleLogout}>Logout</button>
        <button className='bg-black text-white px-3 py-2 rounded cursor-pointer hover:bg-gray-800 transition-all border-black' onClick={handleCancel}>Cancel</button>
      </div>

    </div>
    </div>

    </div>



    {/* <div className='w-full flex flex-col rounded-xl  gap-3 justify-center items-center bg-white px-15 py-10'>
      <div className='p-5 rounded-full bg-[#FEF9C3] '><IoIosWarning size={50} color='#EAB308'/></div>
      <div className='font-extrabold text-3xl'>Logout</div>
      <div className='text-center text-xl font-light'>Are you sure you would like to logout of your account?</div>
      <div className='text-[16px] flex gap-5'>
        <button className='border px-3 py-2 rounded cursor-pointer  hover:bg-gray-200 transition-all border-black' onClick={handleLogout}>Logout</button>
        <button className='bg-black text-white px-3 py-2 rounded cursor-pointer hover:bg-gray-800 transition-all border-black' onClick={handleCancel}>Cancel</button>
      </div>

    </div> */}
    
    
    </>
  )
}

export default Logout