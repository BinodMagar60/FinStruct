import React from "react";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center h-full w-full p-5 py-50">
        <div className="flex justify-center items-center">
          <div className="rounded-full h-15 w-15 bg-black animate-ping"></div>
        </div>
      </div>
    </>
  );
};

export default Loading;
