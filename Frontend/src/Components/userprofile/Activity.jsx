import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample activity data
  const activities = [
    { id: 1, type: 'login', description: 'Logged in to the system', date: '2025-03-24', time: '09:45 AM' },
    { id: 2, type: 'profile_update', description: 'Updated personal information', date: '2025-03-24', time: '10:12 AM' },
    { id: 3, type: 'document', description: 'Uploaded financial report Q1-2025.pdf', date: '2025-03-23', time: '03:27 PM' },
    { id: 4, type: 'transaction', description: 'Approved transaction #FT-87652', date: '2025-03-22', time: '11:38 AM' },
    { id: 5, type: 'login', description: 'Logged in to the system', date: '2025-03-22', time: '09:30 AM' },
    { id: 6, type: 'user', description: 'Added new team member - Sarah Johnson', date: '2025-03-21', time: '02:15 PM' },
    { id: 7, type: 'transaction', description: 'Reviewed transaction #FT-87645', date: '2025-03-20', time: '04:50 PM' },
  ];
  
  // Filter activities based on search query and active filter
  const filteredActivities = activities.filter(activity => {
    // Search query filter
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.date.includes(searchQuery);
    
    // Type filter
    const matchesType = 
      activeFilter === 'all' || 
      (activeFilter === 'login' && activity.type === 'login') ||
      (activeFilter === 'transaction' && activity.type === 'transaction') ||
      (activeFilter === 'document' && activity.type === 'document') ||
      (activeFilter === 'profile_update' && activity.type === 'profile_update');
    
    return matchesSearch && matchesType;
  });
  
  // Get icon based on activity type
  const getActivityIcon = (type) => {
    switch(type) {
      case 'login':
        return <div className="bg-blue-100 p-2 rounded-full"><svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg></div>;
      case 'profile_update':
        return <div className="bg-green-100 p-2 rounded-full"><svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>;
      case 'document':
        return <div className="bg-purple-100 p-2 rounded-full"><svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>;
      case 'transaction':
        return <div className="bg-amber-100 p-2 rounded-full"><svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>;
      case 'user':
        return <div className="bg-sky-100 p-2 rounded-full"><svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>;
    }
  };
  
  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    if (!groups[activity.date]) {
      groups[activity.date] = [];
    }
    groups[activity.date].push(activity);
    return groups;
  }, {});
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Check if date is today
  const isToday = (dateString) => {
    const today = new Date();
    const activityDate = new Date(dateString);
    return today.toDateString() === activityDate.toDateString();
  };

  return (
    <div className="flex-1 overflow-y-auto">
        <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Activity Log</h2>
      
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Filter tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeFilter === 'all' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('all')}
        >
          All Activity
        </button>
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeFilter === 'login' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('login')}
        >
          Logins
        </button>
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeFilter === 'transaction' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('transaction')}
        >
          Transactions
        </button>
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeFilter === 'document' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('document')}
        >
          Documents
        </button>
        <button 
          className={`px-3 py-2 text-sm font-medium ${activeFilter === 'profile_update' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveFilter('profile_update')}
        >
          Profile Updates
        </button>
      </div>
      
      {/* Activities list */}
      <div className="space-y-8">
        {Object.keys(groupedActivities).length > 0 ? (
          Object.keys(groupedActivities)
            .sort((a, b) => new Date(b) - new Date(a))
            .map(date => (
              <div key={date} className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  {isToday(date) ? 'Today' : formatDate(date)}
                </h3>
                <div className="space-y-4">
                  {groupedActivities[date].map(activity => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mr-4 flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No activities found</p>
          </div>
        )}
      </div>
      
      {filteredActivities.length > 7 && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800">
            Load more activities
          </button>
        </div>
      )}
    </div>
        </div>
    </div>
  );
};

export default Activity;