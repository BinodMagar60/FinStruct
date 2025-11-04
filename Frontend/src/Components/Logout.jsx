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
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isLogout]);

  const handleLogout = async () => {
    try {
      await loggoutActivity(locallySavedUser.id);
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[998]">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-[380px] sm:w-[420px] p-8 text-center animate-fadeIn"
      >
        <div className="mx-auto mb-4 p-4 rounded-full bg-yellow-100 shadow-sm w-fit">
          <IoIosWarning size={60} className="text-yellow-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Logout</h2>

        <p className="text-gray-600 mt-3">
          Are you sure you want to log out of your account?
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-all duration-200 shadow-sm"
          >
            Logout
          </button>
          <button
            onClick={() => setLogout(false)}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
