import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signupUser } from "../api/LoginSignup";
import { toast, Flip } from "react-toastify";

const Signup = ({ isSignin, setSignin }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPasword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [signupError, setSignupError] = useState({
    e1: false,
    e2: false,
    e3: false,
    e4: false,
    e5: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePassword = () => {
    setShowPassword(!showPasword);
  };

  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  const submit = async (e) => {
    e.preventDefault();
    let errors = { e1: false, e2: false, e3: false, e4: false, e5: false };
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+\.com$/;
    const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    const companyRegex = /^[a-zA-Z][a-zA-Z0-9 &-]*$/;

    if (!formData.name) {
      errors.e1 = "Name is required";
    } else if (!formData.name.match(nameRegex)) {
      errors.e1 = "Invalid name";
    }

    if (!formData.company) {
      errors.e2 = "Company name is required";
    }
    if (!formData.company.match(companyRegex)) {
      errors.e2 = "Invalid company name";
    }

    if (!formData.email) {
      errors.e3 = "Email is required";
    } else if (!formData.email.match(emailRegex)) {
      errors.e3 = "Invalid email";
    }

    if (!formData.password) {
      errors.e4 = "New password is requred";
    } else if (formData.password.length < 8) {
      errors.e4 = "Password must be atleast 8 character";
    }

    if (!formData.confirm) {
      errors.e5 = "Confirm password is required";
    } else if (!formData.confirm.match(formData.password)) {
      errors.e5 = "Password doesn't match";
    }
   
    setSignupError(errors);
    if (!(errors.e1 || errors.e2 || errors.e3 || errors.e4 || errors.e5)) {


      try {
        const data = {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          company: formData.company,
        };

      
        const response = await signupUser('auth/signup', data)
      

        toast[response.show](response.message, {
          autoClose: 1000,
          theme: "light",
          
        });
        setTimeout(() => {
          setSignin(!isSignin);
        }, 1000);
      } catch (err) {
        // console.log(err)
      if (err.response) {
        if (err.response.status === 400) {
          if (err.response.data.message === "Company already registered."){
            setSignupError((prev) => ({ ...prev, e2: "Company name already in use" }));
          }
          if (err.response.data.message === "Email already registered."){
            setSignupError((prev) => ({ ...prev, e3: "Email already in use" }));
          }
          
        } else {
          toast.error("Something went wrong. Please try again.", {
            position: "top-right",
            autoClose: 1000,
          });
        }
      }
      }
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <div id="Signupbox" className="flex flex-col text-xl select-none">
          <div id="title" className="text-center text-4xl font-extrabold mb-10">
            Singup
          </div>
          <div className="mb-1">
            <label htmlFor="name">Full Name</label>
          </div>
          <div className="mb-2">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
              placeholder="Enter Full Name"
            />
            {signupError.e1 && (
              <div className=" text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {signupError.e1}
              </div>
            )}
          </div>
          <div className="mb-1">
            <label htmlFor="company">Company Name</label>
          </div>
          <div className="mb-2">
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
              placeholder="Enter Company Name"
            />
            {signupError.e2 && (
              <div className=" text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {signupError.e2}
              </div>
            )}
          </div>
          <div className="mb-1">
            <label htmlFor="email">Email</label>
          </div>
          <div className="mb-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
              placeholder="Enter Work Email"
            />
            {signupError.e3 && (
              <div className=" text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {signupError.e3}
              </div>
            )}
          </div>

          <div className="mb-1">
            <label htmlFor="password" className="mb-1">
              New Password
            </label>
          </div>
          <div className="relative mb-2">
            <input
              type={showPasword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
              placeholder="Enter New Password"
            />
            <FaEyeSlash
              className={`absolute right-2 top-2 ${
                showPasword ? "hidden" : ""
              }`}
              onClick={togglePassword}
            />
            <FaEye
              className={`absolute right-2 top-2 ${
                showPasword ? "" : "hidden"
              }`}
              onClick={togglePassword}
            />
            {signupError.e4 && (
              <div className=" text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {signupError.e4}
              </div>
            )}
          </div>

          <div className="mb-1">
            <label htmlFor="confirm" className="mb-1">
              Confirm Password
            </label>
          </div>
          <div className="relative mb-6">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirm"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
              placeholder="Confirm Password"
            />
            <FaEyeSlash
              className={`absolute right-2 top-2 ${
                showConfirm ? "hidden" : ""
              }`}
              onClick={toggleConfirm}
            />
            <FaEye
              className={`absolute right-2 top-2 ${
                showConfirm ? "" : "hidden"
              }`}
              onClick={toggleConfirm}
            />
            {signupError.e5 && (
              <div className=" text-sm text-red-600 flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {signupError.e5}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 font-bold rounded-xl cursor-pointer"
          >
            Signup
          </button>
        </div>
      </form>
    </>
  );
};

export default Signup;
