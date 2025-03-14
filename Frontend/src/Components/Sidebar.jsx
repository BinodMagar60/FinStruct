import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  FileText,
  Inbox,
  Plus,
  ChevronsUpDown,
  Target,
  ListTodo,
  ClipboardList,
  ClipboardCheck,
  Loader,
} from "lucide-react";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { PiMoneyWavyBold } from "react-icons/pi";

const Sidebar = () => {
  const admin = true;

  const dummyData = [
    { name: "Task 1", status: "complete" },
    { name: "Task 2", status: "incomplete" },
    { name: "Task 3", status: "incomplete" },
  ];

  const [selectedTask, setSelectedTask] = useState(dummyData[0]);
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    if (dummyData.length > 0) {
      setSelectedTask(dummyData[0]);
      setActiveTab("Overview");
    }
  }, []);

  const handleTabClick = (tabName) => setActiveTab(tabName);

  const adminLists = [
    [
      { name: "Dashboard", url: "/mainDashboard", logo: <LayoutDashboard /> },
      { name: "Users", url: "/users", logo: <User /> },
      { name: "Salary", url: "/salary", logo: <RiMoneyDollarCircleLine size={24} /> },
      { name: "Docs", url: "/docs", logo: <FileText /> },
      { name: "Mail", url: "/mail", logo: <Inbox /> },
    ],
    [
      { name: "Overview", url: "/overview", logo: <Target /> },
      { name: "Tasks", url: "/tasks", logo: <ClipboardList /> },
      { name: "To Do", url: "/todo", logo: <ListTodo /> },
      { name: "In Progress", url: "/inprogress", logo: <Loader /> },
      { name: "Completed", url: "/completed", logo: <ClipboardCheck /> },
      { name: "Income/Expense", url: "/income-expense", logo: <PiMoneyWavyBold size={24} /> },
    ],
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white pt-24 overflow-y-auto max-h-screen" style={{
      scrollbarWidth: "none"}}>
      <div className="h-full">
        {admin && (
          <ul className="flex flex-col select-none text-gray-900 text-xl">
            {adminLists[0].map((item) => (
              <li
                key={item.name}
                className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
                  activeTab === item.name ? "bg-black text-white hover:text-black" : ""
                }`}
                onClick={() => handleTabClick(item.name)}
              >
                <span className="mr-3">{item.logo}</span>
                <span>{item.name}</span>
              </li>
            ))}

            <div className="h-[3px] w-full bg-[#efefef] my-3"></div>
            <div className="flex justify-center">
              <button className="flex shadow-md py-3 px-4 rounded-md border-r border-b border-gray-300 cursor-pointer transition-all hover:bg-[#e4e4e488]">
                <span className="mr-1 flex items-center">
                  <Plus size={22} />
                </span>
                <span>Create Project</span>
              </button>
            </div>

            {dummyData.length > 0 && (
              <div className="relative w-full py-3 mt-1 hover:bg-[#e4e4e488] transition-all">
                <select
                  className="pl-9 pr-7 w-full appearance-none bg-transparent cursor-pointer"
                  value={selectedTask.name}
                  onChange={(e) => setSelectedTask(dummyData.find((item) => item.name === e.target.value))}
                >
                  {dummyData.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 translate-y-[-50%]">
                  <ChevronsUpDown />
                </span>
              </div>
            )}

            {dummyData.length > 0 &&
              adminLists[1].map((item) => (
                <li
                  key={item.name}
                  className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
                    activeTab === item.name ? "bg-black text-white hover:bg-black" : ""
                  }`}
                  onClick={() => handleTabClick(item.name)}
                >
                  <span className="mr-3">{item.logo}</span>
                  <span>{item.name}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
