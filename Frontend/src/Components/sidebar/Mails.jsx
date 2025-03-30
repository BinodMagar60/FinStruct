import React, { useState } from 'react';
import { Mail, Send, Star, Circle, CheckCircle2, Plus, Eye } from 'lucide-react';
import data from "../../db/notificationData.json"

const Mails = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);

  const [mailMessages, setMailMessages] = useState(data)
  
  
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
    <div className=' p-6'>
      <div className="relative flex flex-col container mx-auto p-4 bg-white pb-8 rounded">
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