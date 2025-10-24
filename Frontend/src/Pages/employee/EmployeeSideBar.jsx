import React, { useState, useEffect } from "react";
import {
  User,
  FileText,
  Inbox,
  ChevronsUpDown,
  Target,
  ListTodo,
  ClipboardList,
  ClipboardCheck,
  Loader,
} from "lucide-react";
import { PiMoneyWavyBold } from "react-icons/pi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getAllProjects } from "../../api/ProjectApi";

const EmployeeSidebar = () => {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();
  const location = useLocation();

  const [dummyData, setDummyData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("Users");
  const [isChanging, setChanging] = useState(false);


  useEffect(() => {
  const getAllDatas = async () => {
    try {
      const response = await getAllProjects(`projects/project/${locallySavedUser.companyId}`);
      setDummyData(response.data);

      if (response.data.length > 0) {
        const existingProjectId = localStorage.getItem("projectId");
        const existingProject = response.data.find((p) => p._id === existingProjectId);

        if (existingProject) {
          setSelectedTask(existingProject);
        } else {
          const firstProject = response.data[0];
          setSelectedTask(firstProject);
          localStorage.setItem("projectId", firstProject._id);
        }

        setActiveTab("Overview");
        navigate("/employee/overview");
      }else{
        setActiveTab("Users");
        navigate('/employee/user')
      }
    } catch (err) {
      console.log(err);
    }
  };

  getAllDatas();
}, []);


  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      navigate(1);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);


  useEffect(() => {
    const currentPath = location.pathname;
    const foundTab = [...employeeSidebarList[0], ...employeeSidebarList[1]].find(
      (item) => item.url === currentPath
    );
    if (foundTab) {
      setActiveTab(foundTab.name);
    }
  }, [location.pathname]);

  const handleTabClick = (tabName) => setActiveTab(tabName);

  const employeeSidebarList = [
    [
      { name: "Users", url: "/employee/user", logo: <User /> },
      { name: "Docs", url: "/employee/docs", logo: <FileText /> },
      { name: "Mail", url: "/employee/mail", logo: <Inbox /> },
    ],
    [
      { name: "Overview", url: "/employee/overview", logo: <Target /> },
      { name: "Tasks", url: "/employee/tasks", logo: <ClipboardList /> },
      { name: "To Do", url: "/employee/todo", logo: <ListTodo /> },
      { name: "In Progress", url: "/employee/inprogress", logo: <Loader /> },
      { name: "For You", url: "/employee/completed", logo: <ClipboardCheck /> },
      {
        name: "Income/Expense",
        url: "/employee/transaction",
        logo: <PiMoneyWavyBold size={24} />,
      },
    ],
  ];

  return (
    <div
      className="h-screen w-75 bg-white pt-24 overflow-y-auto max-h-screen"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="h-full">
        <ul className="flex flex-col select-none text-gray-900 text-xl">
          <div className="w-full text-sm text-center text-gray-500">General</div>
          {/* Top Tabs */}
          {employeeSidebarList[0].map((item) => (
            <Link to={item.url} key={item.name}>
              <li
                className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
                  activeTab === item.name
                    ? "bg-black text-white hover:text-black"
                    : ""
                }`}
                onClick={() => handleTabClick(item.name)}
              >
                <span className="mr-3">{item.logo}</span>
                <span>{item.name}</span>
              </li>
            </Link>
          ))}
<div className="w-full text-sm text-center text-gray-500 mt-2">Project Management</div>

          {/* Project Selector */}
          {dummyData.length > 0 && selectedTask && (
            <div className="relative w-full py-3 mt-1 hover:bg-[#e4e4e488] transition-all">
              <select
                className="pl-9 pr-7 w-full appearance-none bg-transparent cursor-pointer capitalize"
                value={selectedTask.projectName || ""}
                onChange={(e) => {
                  const selected = dummyData.find(
                    (item) => item.projectName === e.target.value
                  );
                  if (selected) {
                    setSelectedTask(selected);
                    localStorage.setItem("projectId", selected._id);
                    window.location.reload()
                  }
                }}
              >
                {dummyData.map((item) => (
                  <option key={item._id} value={item.projectName}>
                    {item.projectName}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 translate-y-[-50%]">
                <ChevronsUpDown />
              </span>
            </div>
          )}

          {/* Bottom Tabs */}
          {dummyData.length > 0 &&
            employeeSidebarList[1].map((item) => (
              <Link to={item.url} key={item.name}>
                <li
                  className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
                    activeTab === item.name
                      ? "bg-black text-white hover:bg-black"
                      : ""
                  }`}
                  onClick={() => handleTabClick(item.name)}
                >
                  <span className="mr-3">{item.logo}</span>
                  <span>{item.name}</span>
                </li>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
