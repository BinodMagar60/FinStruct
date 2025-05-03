import React from "react";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center h-full w-full p-5 ">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
      </div>
    </>
  );
};

export default Loading;
