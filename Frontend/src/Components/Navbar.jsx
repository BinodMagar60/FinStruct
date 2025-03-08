import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  Clock, 
  LogOut
} from 'lucide-react';
import { CgLaptop } from 'react-icons/cg';
import Notes from './Notes';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationSignChecker, setnotificationSignChecker] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New message received',
      description: 'You have a new message from Jane Smith',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'Project update',
      description: 'Your project "Dashboard Redesign" has been updated',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Task completed',
      description: 'Task "Update user interface" has been marked as completed',
      time: '3 hours ago',
      read: true
    },
    {
      id: 4,
      title: 'New comment',
      description: 'Alex commented on your recent post',
      time: '5 hours ago',
      read: true
    },
    {
      id: 5,
      title: 'Meeting reminder',
      description: 'Team standup meeting starts in 30 minutes',
      time: 'Yesterday',
      read: true
    },
    {
      id: 6,
      title: 'System update',
      description: 'System maintenance scheduled for tonight',
      time: 'Yesterday',
      read: true
    },
    {
      id: 7,
      title: 'New feature available',
      description: 'Check out the new dashboard analytics feature',
      time: '2 days ago',
      read: true
    }
  ])
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

//   dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };



  }, []);


  useEffect(() => {
    const hasUnread = notifications.some((notification) => !notification.read);
    setnotificationSignChecker(hasUnread);
  }, [notifications]);
  

  
  

  return (
    <nav className="flex items-center justify-between bg-white shadow-md px-6 py-3">
        {/* logo */}
      <div className="flex items-center">
        <img 
          src="logo.png" 
          alt="Company Logo" 
          className="h-10 w-auto"
        />
      </div>
      




      {/* Right side tools and profile*/}
      <div className="flex items-center gap-1 space-x-4 outline-none">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          >
            {notificationSignChecker? <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>: ""}
            <Bell className="h-7 w-7 text-gray-600" />
          </button>
          



          {/* Notification dropdown*/}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 ">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-20">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <button className="text-sm cursor-pointer text-blue-600 hover:text-blue-800" onClick={()=>setNotifications((prv)=>{
                  const newArr=[...prv]
                   newArr.forEach((obj)=>(
                    obj.read=true
                  ))
                  return newArr
                })}>
                  Mark all as read
                </button>
              </div>
              
              <div className="max-h-64 overflow-y-auto scroll cursor-pointer " >
                {notifications.map((notification,index) => (
                  <div 
                  onClick={()=>setNotifications((prv)=>{
                    const newArr=[...prv]
                    newArr[notification.id-1].read=true
                    return newArr
                  })}
                    key={notification.id} 
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                    // onClick={()=>notification.read=true}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      {notification.read ? (
                        <span className="text-xs text-gray-500">Read</span>
                      ) : (
                        <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
              
              <div className="px-4 py-2 border-t border-gray-100 sticky bottom-0 bg-white z-20">
                <a href="#all-notifications" className="block text-center text-sm text-blue-600 hover:text-blue-800">
                  View all notifications
                </a>
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
            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
              <img 
                src="profilePic.png" 
                alt="User Avatar" 
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDown 
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {/* Profile dropdown menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm leading-5 font-medium text-gray-900">Binod Kaucha</p>
                <p className="text-xs leading-4 font-medium text-gray-500 truncate">kauchabinod88@gmail.com</p>
              </div>
              
              <a href="#profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Your Profile
                </div>
              </a>
              
              <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-gray-500" />
                  Settings
                </div>
              </a>
              
              <a href="#activity" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  Activity Log
                </div>
              </a>
              
              <div className="border-t border-gray-100"></div>
              
              <a href="#logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <div className="flex items-center text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;