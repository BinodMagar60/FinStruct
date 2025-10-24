import React, { useEffect, useState } from 'react';
import {
  Search,
  LogIn,
  UserCog,
  FileText,
  BadgeDollarSign,
  Info,
  User,
  UserPlus, // ✅ Added Lucide User icon
} from 'lucide-react';
import { getAllActivities } from '../../api/UserActivityApi';

const Activity = () => {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activities, setActivities] = useState([]);

  const normalizeType = (type) => type; // ✅ Keep original type

  const isToday = (isoDate) => {
    const today = new Date();
    const givenDate = new Date(isoDate);
    return today.toDateString() === givenDate.toDateString();
  };

  const formatDisplayDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  const filteredActivities = activities.filter((activity) => {
    const normalizedType = normalizeType(activity.type);

    const matchesSearch =
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      normalizedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDisplayDate(activity.date).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      activeFilter === 'all' ||
      (activeFilter === 'profile_update' &&
        ['profile_update', 'user'].includes(normalizedType)) ||
      activeFilter === normalizedType;

    return matchesSearch && matchesType;
  });

  const getActivityIcon = (type) => {
    const normalizedType = normalizeType(type);
    const iconClass = 'w-4 h-4';

    switch (normalizedType) {
      case 'login':
        return <div className="bg-blue-100 p-2 rounded-full"><LogIn className={`${iconClass} text-blue-600`} /></div>;
      case 'profile_update':
        return <div className="bg-green-100 p-2 rounded-full"><UserCog className={`${iconClass} text-green-600`} /></div>;
      case 'document':
        return <div className="bg-purple-100 p-2 rounded-full"><FileText className={`${iconClass} text-purple-600`} /></div>;
      case 'transaction':
        return <div className="bg-amber-100 p-2 rounded-full"><BadgeDollarSign className={`${iconClass} text-amber-600`} /></div>;
      case 'user':
        return <div className="bg-sky-100 p-2 rounded-full"><UserPlus className={`${iconClass} text-sky-600`} /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><Info className={`${iconClass} text-gray-600`} /></div>;
    }
  };

  const groupActivitiesByDate = (activityList) => {
    return activityList.reduce((groups, activity) => {
      const date = new Date(activity.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllActivities(locallySavedUser.id);
        setActivities(response);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="">
        <div className="bg-white rounded-lg shadow p-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Activity Log</h2>

          {/* Search bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none sm:text-sm"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter tabs */}
          <div className="flex space-x-4 mb-6 border-b border-gray-200">
            {['all', 'login', 'transaction', 'document', 'profile_update'].map((filter) => (
              <button
                key={filter}
                className={`px-3 py-2 text-sm font-medium ${
                  activeFilter === filter
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'all'
                  ? 'All Activity'
                  : filter.charAt(0).toUpperCase() + filter.slice(1).replace('_', 's ')}
              </button>
            ))}
          </div>

          {/* Activities list */}
          <div className="space-y-8">
            {Object.keys(groupedActivities).length > 0 ? (
              Object.keys(groupedActivities)
                .sort((a, b) => new Date(b) - new Date(a))
                .map((groupedDate) => (
                  <div key={groupedDate} className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {isToday(groupedActivities[groupedDate][0].date)
                        ? 'Today'
                        : formatDisplayDate(groupedActivities[groupedDate][0].date)}
                    </h3>
                    <div className="space-y-4">
                      {groupedActivities[groupedDate].map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="mr-4 flex-shrink-0">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0 py-0.5">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">{formatTime(activity.date)}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Activity;
