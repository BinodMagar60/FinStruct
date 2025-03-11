import React from 'react'
import { LayoutDashboard, User, FileText } from 'lucide-react';

const Sidebar = () => {




    const admin = true;



    const adminLists = [
        {
            name: "Dashboard",
            url: "/mainDashboard",
            logo: <LayoutDashboard />
        },
        {
            name: "Users",
            url: "/Users",
            logo: <User/>
        },
        {
            name: "Docs",
            url: "/Docs",
            logo: <FileText />
        }
    ]



  return (

    <>


    


    <div className='fixed top-0 left-0 h-screen w-64 bg-white pt-24'>
    
    {
        admin? <>
        <ul className='flex flex-col justify-center select-none'>
            {
                adminLists.map((items, index)=> { return (
                    <li key={index} className='flex text-xl text-gray-600  w-full pl-10 cursor-pointer py-5 hover:bg-[#e4e4e488] active:bg-black active:text-white transition-all'>
                        <span className='mr-3'>{items.logo}</span>
                        <span>{items.name}</span>
                    </li>
                )})
            }
        </ul>
        
        </>:<></>
    }
    </div>


    
    </>
  )
}

export default Sidebar