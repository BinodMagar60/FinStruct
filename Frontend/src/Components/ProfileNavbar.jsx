import React, { useState } from 'react';

const ProfileNavbar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className='w-full fixed top-0 z-50'>
        <nav className="flex items-center justify-between bg-white shadow-md px-6 py-3 pr-4 relative">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Right Side - Profile */}
          <div className="flex items-center gap-1 space-x-4 outline-none relative">
            <div 
              className="relative flex items-center space-x-2 cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Profile Picture */}
              <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src="/profilePic.png" 
                  alt="User Avatar" 
                  className="h-full w-full object-cover"
                />
              </div>

              <div className='flex flex-col text-left mr-3'>
                <div className='font-medium'>Binod Kaucha magar</div>
                <div className='text-sm text-gray-500'>Owner</div>
              </div>

              {/* Hover Info Tooltip */}
              {isHovered && (
                <div className="absolute top-12 right-0 bg-white border border-gray-300 shadow-lg p-3 rounded-md z-20">
                  <div className="text-sm text-gray-700">Binod Kaucha Magar</div>
                  <div className="text-xs text-gray-500">kauchabinod88@gmail.com</div>
                  <div className="text-xs text-gray-500">Owner</div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default ProfileNavbar;
