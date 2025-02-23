import React from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { TbXboxXFilled } from "react-icons/tb";

const Popup = (props) => {
  return (
    <>
    <div className="min-w-[170px] text-center h-fit absolute z-100 bg-white px-10 py-2 text-md flex justify-center items-center gap-3 left-[50%] translate-x-[-50%] rounded-md mt-14 drop-shadow-xl">
       {
        props.status==="success"?  <FaCheckCircle className='text-green-500 text-xl'/>: props.status === "error"? <TbXboxXFilled className='text-red-500 text-[22px]'/>: ""
       }
       
        {props.message}</div>
    </>
  )
}

export default Popup