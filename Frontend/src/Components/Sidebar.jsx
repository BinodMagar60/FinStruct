import React from "react";
import { useState } from "react";
import { LayoutDashboard, User, FileText, Inbox, Plus, ChevronsUpDown, Target, ListTodo, CircleCheckBig, ClipboardList, ClipboardCheck, Loader, Trash2 } from "lucide-react";





const Sidebar = () => {

  


  const admin = true;

  const dummyData = [
    { name: 'Task 1 asdasdasdassdaaa', status: 'complete' },
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
        url: "/users",
        logo: <User />,
      },
      {
        name: "Docs",
        url: "/docs",
        logo: <FileText />,
      },
      {
        name: "Mail",
        url: "/mail",
        logo: <Inbox />,
      },
    ],
    [
      {
        name: "Overview",
        url: "/overview",
        logo: <Target />
      },
      {
        name: "Tasks",
        url: "/tasks",
        logo: <ClipboardList />,
      },
      {
        name: "To Do",
        url: "/todo",
        logo: <ListTodo />,
      },
      {
        name: "In Progress",
        url: "/inprogress",
        logo: <Loader />,
      },
      {
        name: "Completed",
        url: "/completed",
        logo: <ClipboardCheck />,
      },
      {
        name: "Trash",
        url: "/trash",
        logo: <Trash2 />,
      }
    ]
  ];

  return (
    <>
      <div className="fixed top-0 left-0 h-screen w-64 bg-white pt-24">
        {admin ? (
          <>
            <ul className="flex flex-col justify-center select-none text-gray-900 text-xl">
              {adminLists[0].map((items, index) => {
                return (
                  <li
                    key={index}
                    className="flex w-full pl-10 cursor-pointer py-4 hover:bg-[#e4e4e488] active:bg-black active:text-white transition-all"
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
                  <span>Create Project</span>
                </button>
                
              </div>
              <div className="relative w-full py-3 mt-1 hover:bg-[#e4e4e488] active:bg-black active:text-white transition-all">
                <select name="" id="" className="pl-9 pr-7 w-full appearance-none">
                  {
                    dummyData.map((item, index)=>{
                      return <option value={item.name} key={index}>{item.name}</option>
                    })
                  }
                </select>
                <span className="absolute right-1 top-1/2 translate-y-[-50%]"><ChevronsUpDown /></span>
              </div>
              {adminLists[1].map((items, index) => {
                return (
                  <li
                    key={index}
                    className="flex w-full pl-10 cursor-pointer py-4 hover:bg-[#e4e4e488] active:bg-black active:text-white transition-all"
                  >
                    <span className="mr-3">{items.logo}</span>
                    <span>{items.name}</span>
                  </li>
                );
              })}
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
