import React from "react";
import { useState } from "react";
import { LayoutDashboard, User, FileText, Inbox, Plus, Dot, ChevronsUpDown } from "lucide-react";





const Sidebar = () => {

  


  const admin = true;

  const dummyData = [
    { name: 'Task 1 asdasdasdassd', status: 'complete' },
    { name: 'Task 2', status: 'incomplete' },
    { name: 'Task 3', status: 'incomplete' },
    { name: 'Task 4', status: 'complete' },
    { name: 'Task 5', status: 'complete' },
    { name: 'Task 6', status: 'complete' },
    { name: 'Task 7', status: 'incomplete' }
  ];

  const [selectedTask, setSelectedTask] = useState(dummyData[0]);

  const handleChange = (event) => {
    const selectedName = event.target.value;
    const task = dummyData.find((item) => item.name === selectedName);
    setSelectedTask(task);
  };


  const adminLists = [
    [
      {
        name: "Dashboard",
        url: "/mainDashboard",
        logo: <LayoutDashboard />,
      },
      {
        name: "Users",
        url: "/Users",
        logo: <User />,
      },
      {
        name: "Docs",
        url: "/Docs",
        logo: <FileText />,
      },
      {
        name: "Mail",
        url: "/Mail",
        logo: <Inbox />,
      },
    ],
  ];

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-60 bg-white pt-24">
        {admin ? (
          <>
            <ul className="flex flex-col justify-center select-none text-gray-900 text-xl">
              {adminLists[0].map((items, index) => {
                return (
                  <li
                    key={index}
                    className="flex w-full pl-10 cursor-pointer py-5 hover:bg-[#e4e4e488] active:bg-black active:text-white transition-all"
                  >
                    <span className="mr-3">{items.logo}</span>
                    <span>{items.name}</span>
                  </li>
                );
              })}
              <div className="h-[3px] w-full bg-[#efefef] my-3"></div>
              <div className="flex justify-center">
                <button
                  className="flex shadow-md py-3 px-4 rounded-md border-r 
               border-b border-r-gray-300 border-b-gray-300 cursor-pointer transition-all hover:bg-[#e4e4e488] active:bg-black active:text-white"
                >
                  <span className="mr-1 flex  items-center">
                    <Plus size={22} />
                  </span>
                  <span>Add Project</span>
                </button>
                
              </div>
              <div className="w-full  hover:bg-[#e4e4e488] active:bg-black active:text-white transition-all relative">
                <select name="" id="" className="w-full appearance-none py-5 pl-15 pr-10 cursor-pointer" onChange={handleChange}
              value={selectedTask.name}>
                  {
                    dummyData.map((item, index)=>{
                      return <option value={item.name} key={index}
                      style={{
                      
                      }}>{item.name}</option>
                    })
                  }
                  
                </select>
                  <span className="absolute top-[50%] right-4 translate-y-[-50%]"><ChevronsUpDown size={24} strokeWidth={1.5} /></span>
                  <span className="absolute left-3 top-[50%] translate-y-[-50%]">
              <Dot
                size={66}
                strokeWidth={1.5}
                color={selectedTask.status === "complete" ? "#9DFF64" : "#FF4141"}
              />
            </span>
              </div>
            </ul>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Sidebar;
