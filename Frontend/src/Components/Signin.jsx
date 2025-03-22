import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, Flip } from "react-toastify";
import { apiCall } from "../api/api";
import { useCookies } from "react-cookie";  // ✅ Import react-cookie
import { useNavigate } from "react-router-dom";

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
  const [cookies, setCookie] = useCookies(["authToken"]);
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
    } else if (!formData.email.match(emailRegex)) {
      errors.e1 = "Invalid Email";
    }

    if (!formData.password) {
      errors.e2 = "Password is required";
    } else if (formData.password.length < 8) {
      errors.e2 = "Incorrect Password";
    }

    setLoginError(errors);
    if (!errors.e1 && !errors.e2) {
      try {
        const data = { email: formData.email, password: formData.password };
        const response = await apiCall("auth/login", data);
        const { token } = response.data;

        setCookie("authToken", token, { path: "/", maxAge: 30 * 24 * 60 * 60 });

        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Flip,
        });

        setTimeout(() => {
          navigate("/admin");
        }, 1000);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            toast.error("Invalid Email or Password", {
              position: "top-right",
              autoClose: 1500,
              theme: "light",
            });
          } else {
            toast.error("Something went wrong. Please try again.", {
              position: "top-right",
              autoClose: 1500,
            });
          }
        }
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
