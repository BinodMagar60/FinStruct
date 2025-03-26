import React, { useState } from 'react';
import { Mail, Send, Star, Circle, CheckCircle2, Plus, Eye } from 'lucide-react';

const Mails = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [mailMessages, setMailMessages] = useState([
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
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
        avatar: "/api/placeholder/40/40"
      }
    }
  ]);

  const mailTabs = [
    { 
      id: 'all', 
      icon: <Mail className="w-5 h-5" />, 
      label: 'All Mail',
      count: mailMessages.length
    },
    { 
      id: 'sent', 
      icon: <Send className="w-5 h-5" />, 
      label: 'Sent',
      count: mailMessages.filter(msg => msg.sendBy === "Emily Johnson").length
    },
    { 
      id: 'unread', 
      icon: <Star className="w-5 h-5" />, 
      label: 'Unread',
      count: mailMessages.filter(msg => !msg.read).length
    },
    { 
      id: 'read', 
      icon: <Eye className="w-5 h-5" />, 
      label: 'Read',
      count: mailMessages.filter(msg => msg.read).length
    }
  ];

  const handleMessageClick = (messageId) => {
    setMailMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId 
          ? { ...message, read: true } 
          : message
      )
    );
  };

  const filteredMessages = activeTab === 'all' 
    ? mailMessages 
    : activeTab === 'unread' 
      ? mailMessages.filter(msg => !msg.read)
      : activeTab === 'read'
        ? mailMessages.filter(msg => msg.read)
        : activeTab === 'sent'
          ? mailMessages.filter(msg => msg.sendBy === "Emily Johnson")
          : [];

  const ComposeModal = () => {
    return (
      <div className="fixed inset-0 bg-[#7e7e7e50] bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Compose New Message</h2>
            <button 
              onClick={() => setIsComposeModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Enter recipient email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Enter message subject"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
              <textarea 
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 outline-none"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsComposeModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='container p-6 '>
      <div className="w-full relative h-screen flex flex-col p-4 pb-8 bg-white rounded">
        <h1 className='text-2xl font-bold mb-5'>Mails</h1>
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {mailTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 
                ${activeTab === tab.id 
                  ? 'border-b-2 shadow-inner' 
                  : 'text-gray-600 hover:text-gray-800'}
                transition-colors duration-200
              `}
            >
              {tab.icon}
              <span className="">{tab.label}</span>
              <span className={`
                text-xs px-2 py-0.5 rounded-full ml-2
                ${activeTab === tab.id 
                  ? 'bg-black text-white' 
                  : 'bg-gray-200 text-gray-600'}
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Message List */}
        <div className="flex-grow overflow-auto" style={{
          scrollbarWidth: "none"
        }}>
          {filteredMessages.map((message) => (
            <div 
              key={message.id} 
              onClick={() => handleMessageClick(message.id)}
              className={`
                p-4 border-b border-gray-200 flex items-start gap-3 hover:bg-gray-50 cursor-pointer
                ${!message.read ? 'bg-blue-50' : ''}
              `}
            >
              {message.read ? (
                <CheckCircle2 className="w-5 h-5 text-gray-400 mt-1" />
              ) : (
                <Circle className="w-5 h-5 text-blue-500 mt-1" />
              )}
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className={`
                    text-sm font-semibold
                    ${!message.read ? 'text-blue-800' : 'text-gray-800'}
                  `}>
                    {message.title}
                  </h3>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <p className={`
                  text-xs mt-1
                  ${!message.read ? 'text-blue-700' : 'text-gray-600'}
                `}>
                  {message.description}
                </p>
                <div className="text-xs text-gray-500 mt-2 flex justify-between">
                  <span>From: {message.sendBy}</span>
                  <span>To: {message.sendTo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compose Button */}
        <div className="fixed bottom-6 right-28 z-40">
          <button 
            onClick={() => setIsComposeModalOpen(true)}
            className="flex items-center gap-3 bg-black text-white px-3 py-2 rounded-full shadow-lg w-10 hover:w-fit hover:bg-gray-800  overflow-hidden" 
          >
            <span className='ml-[-2px]'><Plus className="w-5 h-5 " /></span>
            <span>Compose</span>
          </button>
        </div>

        {/* Compose Modal */}
        {isComposeModalOpen && <ComposeModal />}
      </div>
    </div>
  );
};

export default Mails;