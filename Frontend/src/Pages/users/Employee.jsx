import React, {useState} from 'react'
import Navbar from '../../Components/Navbar'

const Employee = () => {
    const [isLogout, setLogout] = useState(false);


  return (
    <>
    <div className='bg-[#efefef] h-screen relative'>
        <Navbar isLogout={isLogout} setLogout={setLogout}/>
    </div>
    </>
  )
}

export default Employee