import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Flip } from "react-toastify";
import { loginUser } from "../api/LoginSignup";

import { useNavigate } from "react-router-dom";
import { xorEncrypt } from "../utils/passwordEncryption";

const Signin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState({
    e1: false,
    e2: false,
  });

  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePassword = () => {
    setShow(!show);
  };

  const submit = async (e) => {
    e.preventDefault();
    let errors = { e1: false, e2: false };
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+\.com$/;
  
    if (!formData.email) {
      errors.e1 = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.e1 = "Invalid Email";
    }
  
    if (!formData.password) {
      errors.e2 = "Password is required";
    } else if (formData.password.length < 8) {
      errors.e2 = "Password must be at least 8 characters";
    }
  
    setLoginError(errors);
    if (!errors.e1 && !errors.e2) {
      try {
        const data = { email: formData.email, password: xorEncrypt(formData.password) };

        const response = await loginUser("auth/login", data);
  
        if (response.status === 200) {
          const { token, message, safeUser } = response.data;
          

          localStorage.setItem('token', token)
          localStorage.setItem('userDetails', JSON.stringify(safeUser));

  
          toast.success(message || "Login successful", {
            theme: "light",
            autoClose: 1000
          });
  
          setTimeout(() => {
            if(safeUser.role === 'admin'){
              navigate("/admin")
            }else{
              navigate("/employee")
            }
          }, 1000);
        } else {
          throw new Error("Unexpected error");
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 1000,
          theme: "light",
        });
      }
    }
  };
  

  return (
    <>
      <form onSubmit={submit}>
        <div id="loginBox" className="flex flex-col text-xl select-none">
          <div id="title" className="text-center text-4xl font-extrabold mb-10">
            Login
          </div>
          <div className="mb-1.5">
            <label htmlFor="email">Email</label>
          </div>
          <div className="mb-5">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="font-light border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
              placeholder="Enter Email"
              onChange={handleChange}
            />
            {loginError.e1 && (
              <div className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {loginError.e1}
              </div>
            )}
          </div>
          <div className="mb-1.5">
            <label htmlFor="password" className="mb-1">
              Password
            </label>
          </div>
          <div className="relative mb-10">
            <input
              type={show ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              className="font-light border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
              placeholder="Enter Password"
              onChange={handleChange}
            />
            <FaEyeSlash
              className={`absolute right-2 top-2 ${show ? "hidden" : ""}`}
              onClick={togglePassword}
            />
            <FaEye
              className={`absolute right-2 top-2 ${show ? "" : "hidden"}`}
              onClick={togglePassword}
            />
            {loginError.e2 && (
              <div className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {loginError.e2}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 font-bold rounded-xl cursor-pointer"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default Signin;
