import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  Clock,
  LogOut,
  Router,
} from "lucide-react";
import { Link } from "react-router-dom";
import Notes from "./Notes";
import Logout from "./Logout";
import { getInitials } from "../utils/getInitials";

const Navbar = ({ isLogout, setLogout, user }) => {
  const userDetails = user;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [notificationSignChecker, setnotificationSignChecker] = useState(false);
  

  const profileSidebarAdmin = [
    `/admin/profile/profileuser`,
    "/admin/profile/setting",
    "/admin/profile/activity",
    "/admin/mail"
  ];

  const profileSidebarEmployee = [
    `/employee/profile/profileuser`,
    "/employee/profile/setting",
    "/employee/profile/activity",
    "/employee/mail"
  ];

  const profile = isAdmin ? profileSidebarAdmin : profileSidebarEmployee;

  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("userDetails"));

    if (userDetails.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New project proposal",
      description: "Detailed proposal for Q2 marketing strategy",
      time: "5 minutes ago",
      read: false,
      sendBy: "Emily Johnson",
      sendTo: "Marketing Team",
      sender: {
        email: "emily.j@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 2,
      title: "Budget Review Meeting",
      description: "Agenda and financial reports for upcoming meeting",
      time: "1 hour ago",
      read: false,
      sendBy: "Michael Chen",
      sendTo: "Finance Department",
      sender: {
        email: "michael.c@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 3,
      title: "Customer Feedback Report",
      description: "Quarterly customer satisfaction analysis",
      time: "3 hours ago",
      read: true,
      sendBy: "Sarah Rodriguez",
      sendTo: "Customer Success Team",
      sender: {
        email: "sarah.r@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 4,
      title: "Product Development Update",
      description: "Sprint progress and upcoming feature roadmap",
      time: "5 hours ago",
      read: true,
      sendBy: "Alex Kim",
      sendTo: "Engineering Team",
      sender: {
        email: "alex.k@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 5,
      title: "Training Session Invitation",
      description: "Annual company-wide professional development workshop",
      time: "Yesterday",
      read: true,
      sendBy: "HR Department",
      sendTo: "All Employees",
      sender: {
        email: "hr@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 6,
      title: "System Maintenance Notification",
      description: "Scheduled downtime for system upgrades",
      time: "Yesterday",
      read: true,
      sendBy: "IT Support",
      sendTo: "All Users",
      sender: {
        email: "it-support@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 7,
      title: "New Client Onboarding",
      description: "Welcome package and initial consultation details",
      time: "2 days ago",
      read: true,
      sendBy: "David Thompson",
      sendTo: "Sales Team",
      sender: {
        email: "david.t@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 8,
      title: "Quarterly Sales Report",
      description: "Comprehensive analysis of Q1 sales performance",
      time: "3 days ago",
      read: false,
      sendBy: "Rachel Green",
      sendTo: "Executive Team",
      sender: {
        email: "rachel.g@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 9,
      title: "Marketing Campaign Review",
      description: "Preliminary results of recent digital marketing initiative",
      time: "4 days ago",
      read: false,
      sendBy: "Tom Harris",
      sendTo: "Marketing Strategy Team",
      sender: {
        email: "tom.h@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 10,
      title: "Compliance Training Reminder",
      description: "Annual mandatory compliance and ethics training",
      time: "5 days ago",
      read: true,
      sendBy: "Legal Department",
      sendTo: "All Staff",
      sender: {
        email: "legal@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 11,
      title: "Performance Review Scheduling",
      description: "Instructions for scheduling annual performance reviews",
      time: "6 days ago",
      read: true,
      sendBy: "HR Management",
      sendTo: "Department Managers",
      sender: {
        email: "hr-management@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
    {
      id: 12,
      title: "Product Feedback Collection",
      description: "Request for input on upcoming product improvements",
      time: "1 week ago",
      read: true,
      sendBy: "Product Team",
      sendTo: "Beta Testers",
      sender: {
        email: "product@company.com",
        avatar: "/api/placeholder/40/40",
      },
    },
  ]);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  //   dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const hasUnread = notifications.some((notification) => !notification.read);
    setnotificationSignChecker(hasUnread);
  }, [notifications]);

  const handleLogout = () => {
    setIsProfileOpen(!isProfileOpen);
    setLogout(!isLogout);
  };

  return (
    <div className="w-full fixed top-0 z-100">
      <nav className="flex items-center justify-between bg-white shadow-md px-6 py-3 relative ">
        {/* logo */}

        <div className="flex items-center">
          <img src="/logo.png" alt="Company Logo" className="h-10 w-auto" />
        </div>

        {/* Right side tools and profile*/}
        <div className="flex items-center gap-1 space-x-4 outline-none">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              {notificationSignChecker ? (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              ) : (
                ""
              )}
              <Bell className="h-7 w-7 text-gray-600" />
            </button>

            {/* Notification dropdown*/}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 ">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-20">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h3>
                  <button
                    className="text-sm cursor-pointer text-blue-600 hover:text-blue-800"
                    onClick={() =>
                      setNotifications((prv) => {
                        const newArr = [...prv];
                        newArr.forEach((obj) => (obj.read = true));
                        return newArr;
                      })
                    }
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto scroll cursor-pointer ">
                  {notifications.map((notification, index) => (
                    <div
                      onClick={() =>
                        setNotifications((prv) => {
                          const newArr = [...prv];
                          newArr[notification.id - 1].read = true;
                          return newArr;
                        })
                      }
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      // onClick={()=>notification.read=true}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {notification.read ? (
                          <span className="text-xs text-gray-500">Read</span>
                        ) : (
                          <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 border-t border-gray-100 sticky bottom-0 bg-white z-20">
                  <Link to={profile[3]}>
                  <button
                    className="block text-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all notifications
                  </button></Link>
                </div>
              </div>
            )}
          </div>

          <Notes />

          {/* Profile*/}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-1 py-1 px-2 gap-2 rounded hover:bg-gray-100 outline-none cursor-pointer"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {userDetails.photo ? (
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img
                    src={userDetails.photo}
                    alt={userDetails.username}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {getInitials(userDetails.username)}
                </div>
              )}
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile dropdown menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm leading-5 font-medium text-gray-900 capitalize">
                    {userDetails.username}
                  </p>
                  <p className="text-xs leading-4 font-medium text-gray-500 truncate">
                    {userDetails.email}
                  </p>
                </div>

                <Link to={profile[0]}>
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      Your Profile
                    </div>
                  </div>
                </Link>

                <Link to={profile[1]}>
                  <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <div className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-gray-500" />
                      Settings
                    </div>
                  </div>
                </Link>

                <Link
                  to={profile[2]}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    Activity Log
                  </div>
                </Link>

                <div className="border-t border-gray-100"></div>

                <div
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={handleLogout}
                >
                  <div className="flex items-center text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
