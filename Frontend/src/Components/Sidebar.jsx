import React from 'react'
import { LayoutDashboard, User, FileText, Inbox, Plus } from 'lucide-react';

const Sidebar = () => {




    const admin = true;



    const adminLists = [
        [{
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
        ,{
            name: "Mail",
            url: "/Mail",
            logo: <Inbox/>
        }]
    ]



  return (

    <>


    


    <div className='fixed top-0 left-0 h-screen w-56 bg-white pt-24'>
    
    {
        admin? <>
        <ul className='flex flex-col justify-center select-none text-gray-900 text-xl'>
            {
                adminLists[0].map((items, index)=> { return (
                    <li key={index} className='flex w-full pl-10 cursor-pointer py-5 hover:bg-[#e4e4e488] active:bg-black active:text-white transition-all'>
                        <span className='mr-3'>{items.logo}</span>
                        <span>{items.name}</span>
                    </li>
                )})
            }
            <div className='h-[3px] w-full bg-[#efefef] my-3'></div>
            <div className='flex justify-center'>
                <button className='flex shadow-md py-3 px-4 rounded-md border-r 
               border-b border-r-gray-300 border-b-gray-300 cursor-pointer transition-all hover:bg-[#e4e4e488] active:bg-black active:text-white'>
                <span className='mr-1 flex items-center'><Plus size={22}/></span>
                <span>Add Project</span>
                </button>
                
            </div>

        </ul>
        
        </>:<></>
    }
    </div>


    
    </>
  )
}

export default Sidebar