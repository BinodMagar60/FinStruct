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
import { Link, useNavigate, useLocation } from "react-router-dom";
import CreateProject from "../../Components/sidebar/CreateProject";
import { getAllProjects } from "../../api/ProjectApi";

const Sidebar = () => {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));
  const admin = true;

  const navigate = useNavigate();
  const location = useLocation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [dummyData, setDummyData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  

  const adminLists = [
    [
      { name: "Dashboard", url: "/admin/dashboard", logo: <LayoutDashboard /> },
      { name: "Users", url: "/admin/user", logo: <User /> },
      {
        name: "Salary",
        url: "/admin/salary",
        logo: <RiMoneyDollarCircleLine size={24} />,
      },
      { name: "Docs", url: "/admin/docs", logo: <FileText /> },
      { name: "Mail", url: "/admin/mail", logo: <Inbox /> },
    ],
    [
      { name: "Overview", url: "/admin/overview", logo: <Target /> },
      { name: "Tasks", url: "/admin/tasks", logo: <ClipboardList /> },
      { name: "To Do", url: "/admin/todo", logo: <ListTodo /> },
      { name: "In Progress", url: "/admin/inprogress", logo: <Loader /> },
      { name: "Completed", url: "/admin/completed", logo: <ClipboardCheck /> },
      {
        name: "Transaction",
        url: "/admin/transaction",
        logo: <PiMoneyWavyBold size={24} />,
      },
    ],
  ];

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
        navigate("/admin/overview");
      }
    } catch (err) {
      console.log(err);
    }
  };

  getAllDatas();
}, [isCreateOpen]);


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
    const foundTab = [...adminLists[0], ...adminLists[1]].find(
      (item) => item.url === currentPath
    );
    if (foundTab) {
      setActiveTab(foundTab.name);
    }
  }, [location.pathname]);

  const handleTabClick = (tabName) => setActiveTab(tabName);

  return (
    <div
      className="h-screen w-75 bg-white pt-24 overflow-y-auto max-h-screen"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="h-full">
        {admin && (
          <ul className="flex flex-col select-none text-gray-900 text-xl">
            {adminLists[0].map((item) => (
              <Link to={item.url} key={item.name}>
                <li
                  className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
                    activeTab === item.name ? "bg-black text-white hover:text-black" : ""
                  }`}
                  onClick={() => handleTabClick(item.name)}
                >
                  <span className="mr-3">{item.logo}</span>
                  <span>{item.name}</span>
                </li>
              </Link>
            ))}

            <div className="h-[3px] w-full bg-[#efefef] my-3"></div>
            <div className="flex justify-center">
              <button
                className="flex shadow-md py-3 px-4 rounded-md border-r border-b border-gray-300 cursor-pointer transition-all hover:bg-[#e4e4e488]"
                onClick={() => setIsCreateOpen(!isCreateOpen)}
              >
                <span className="mr-1 flex items-center">
                  <Plus size={22} />
                </span>
                <span>Create Project</span>
              </button>
            </div>

            {dummyData.length > 0 && selectedTask && (
              <div className="relative w-full py-3 mt-1 hover:bg-[#e4e4e488] transition-all">
                <select
                  className="pl-9 pr-7 w-full appearance-none bg-transparent cursor-pointer"
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

            {dummyData.length > 0 &&
              adminLists[1].map((item) => (
                <Link to={item.url} key={item.name}>
                  <li
                    className={`flex w-full pl-10 cursor-pointer py-4 hover:bg-[#6e6e6e88] transition-all ${
                      activeTab === item.name ? "bg-black text-white hover:bg-black" : ""
                    }`}
                    onClick={() => handleTabClick(item.name)}
                  >
                    <span className="mr-3">{item.logo}</span>
                    <span>{item.name}</span>
                  </li>
                </Link>
              ))}
          </ul>
        )}
      </div>

      {isCreateOpen && (
        <CreateProject
          isCreateOpen={isCreateOpen}
          setIsCreateOpen={setIsCreateOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;
