import React, { useState, useEffect, useRef } from "react";
import { IoIosWarning } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loggoutActivity } from "../api/UserActivityApi";

const Logout = ({ isLogout, setLogout }) => {
  const locallySavedUser = JSON.parse(localStorage.getItem("userDetails"));

  const modalRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setLogout(false);
      }
    };

    if (isLogout) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLogout]);

  const handleLogout = async () => {
    try {
      const response = await loggoutActivity(locallySavedUser.id)
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("projectId");
      localStorage.removeItem("userDetails");
      navigate("/");
      toast.success("Logged Out Successful", {
        autoClose: 1000,
        theme: "light",
      });
    }
  };

  const handleCancel = () => {
    setLogout(!isLogout);
  };

  return (
    <>
      <div className="w-full h-screen absolute top-0 z-[998] bg-[#00000042]">
        <div
          ref={modalRef}
          className="absolute z-[999] top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%]  text-2xl  shadow-inner border border-gray-300 rounded-xl "
        >
          <div className="w-full flex flex-col rounded-xl  gap-3 justify-center items-center bg-white px-15 py-10">
            <div className="p-5 rounded-full bg-[#FEF9C3] ">
              <IoIosWarning size={50} color="#EAB308" />
            </div>
            <div className="font-extrabold text-3xl">Logout</div>
            <div className="text-center text-xl font-light">
              Are you sure you would like to logout of your account?
            </div>
            <div className="text-[16px] flex gap-5">
              <button
                className="border px-3 py-2 rounded cursor-pointer  hover:bg-gray-200 transition-all border-black"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="bg-black text-white px-3 py-2 rounded cursor-pointer hover:bg-gray-800 transition-all border-black"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
