import React from 'react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl px-4">
        <div className="flex flex-col items-center">
         
          <svg viewBox="0 0 800 300" className="w-full max-w-2xl mb-6">
          
            <rect x="100" y="100" width="60" height="150" fill="#f0f0f0" />
            <rect x="180" y="130" width="50" height="120" fill="#f0f0f0" />
            <rect x="250" y="80" width="70" height="170" fill="#f0f0f0" />
            <rect x="340" y="110" width="60" height="140" fill="#f0f0f0" />
            <rect x="420" y="70" width="80" height="180" fill="#f0f0f0" />
            <rect x="520" y="120" width="50" height="130" fill="#f0f0f0" />
            <rect x="590" y="90" width="70" height="160" fill="#f0f0f0" />
            
         
            <line x1="50" y1="250" x2="750" y2="250" stroke="#ff9baf" strokeWidth="2" />
            
        
            <line x1="80" y1="130" x2="120" y2="130" stroke="#ff9baf" strokeWidth="2" />
            <line x1="200" y1="100" x2="240" y2="100" stroke="#ff9baf" strokeWidth="2" />
            <line x1="350" y1="90" x2="390" y2="90" stroke="#ff9baf" strokeWidth="2" />
            <line x1="500" y1="80" x2="540" y2="80" stroke="#ff9baf" strokeWidth="2" />
            <line x1="620" y1="110" x2="660" y2="110" stroke="#ff9baf" strokeWidth="2" />
            
            
            <g transform="translate(180, 250)">
              <rect x="-40" y="-30" width="80" height="30" fill="#f0f0f0" />
              <line x1="-40" y1="-30" x2="40" y2="-30" stroke="#ff9baf" strokeWidth="2" />
              <line x1="-40" y1="-20" x2="40" y2="-20" stroke="#ff9baf" strokeWidth="2" />
              <line x1="-40" y1="-10" x2="40" y2="-10" stroke="#ff9baf" strokeWidth="2" />
              <rect x="-35" y="-40" width="10" height="10" fill="#ff9baf" />
              <rect x="25" y="-40" width="10" height="10" fill="#ff9baf" />
            </g>
            
            <g transform="translate(420, 250)">
              <rect x="-40" y="-30" width="80" height="30" fill="#f0f0f0" />
              <line x1="-40" y1="-30" x2="40" y2="-30" stroke="#ff9baf" strokeWidth="2" />
              <line x1="-40" y1="-20" x2="40" y2="-20" stroke="#ff9baf" strokeWidth="2" />
              <line x1="-40" y1="-10" x2="40" y2="-10" stroke="#ff9baf" strokeWidth="2" />
              <rect x="-35" y="-40" width="10" height="10" fill="#ff9baf" />
              <rect x="25" y="-40" width="10" height="10" fill="#ff9baf" />
            </g>
            
           
            <g transform="translate(300, 210)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="#ff9baf" strokeWidth="4" />
              <circle cx="0" cy="0" r="20" fill="#ff9baf" fillOpacity="0.2" stroke="#ff9baf" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fontFamily="Arial" fontSize="12" fill="#ff9baf" fontWeight="bold">STOP</text>
            </g>
          </svg>
          
   
          <h1 className="text-3xl font-bold text-pink-400 mb-4">Access Denied</h1>
          <p className="text-gray-500 text-center mb-1">You currently do not have access to this page.</p>
          <p className="text-gray-500 text-center">Please try again later.</p>
        </div>
      </div>
    </div>
  );
}



export default Unauthorized