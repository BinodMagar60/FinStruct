import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import "./login.css";
import Loading from "./Components/Loading";
import { useNavigate } from "react-router-dom";
import { toast, Bounce, Flip } from "react-toastify";

const Login = () => {
  const [login, setLogin] = useState(false);
  const [LPassword, setLPassword] = useState(false);
  const [SNPassword, setSNPassword] = useState(false);
  const [SCPassword, setSCPassword] = useState(false);
  const [loginError, setLoginError] = useState({
    e1: false,
    e2: false,
  });

  const [signupError, setSignupError] = useState({
    e1: false,
    e2: false,
    e3: false,
    e4: false,
    e5: false,
  });

  const [Lemail, setLemail] = useState("");
  const [Lpassowrd, setLpassword] = useState("");
  const [Sfname, setSfname] = useState("");
  const [Scompanyname, setScompanyname] = useState("");
  const [Swemail, setSwemail] = useState("");
  const [Snpassword, setSnpassword] = useState("");
  const [Scpassword, setScpassword] = useState("");

  const navigate = useNavigate();

  const resetFields = () => {
    setSignupError({ e1: false, e2: false, e3: false, e4: false, e5: false });
    setLoginError({ e1: false, e2: false });

    setLemail("");
    setLpassword("");
    setSfname("");
    setScompanyname("");
    setSwemail("");
    setSnpassword("");
    setScpassword("");
    setLPassword(false);
    setSNPassword(false);
    setSCPassword(false);
  };

  const loginValidation = (e) => {
    let errors = { e1: false, e2: false };
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+\.com$/;

    if (!Lemail) {
      errors.e1 = "Email is required";
    } else if (!Lemail.match(emailRegex)) {
      errors.e1 = "Invalid Email";
    }

    if (!Lpassowrd) {
      errors.e2 = "Password is required";
    } else if (Lpassowrd.length < 8) {
      errors.e2 = "Incorrect Password";
    }

    setLoginError(errors);
    if (!errors.e1 && !errors.e2) {
      toast.success("Login Successful", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip,
      });
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
      
    }
  };

  const signupValidation = (e) => {
    let errors = { e1: false, e2: false, e3: false, e4: false, e5: false };
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+\.com$/;
    const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;
    const companyRegex = /^[a-zA-Z][a-zA-Z0-9 &-]*$/;

    if (!Sfname) {
      errors.e1 = "Name is required";
    } else if (!Sfname.match(nameRegex)) {
      errors.e1 = "Invalid name";
    }

    if (!Scompanyname) {
      errors.e2 = "Company name is required";
    }
    if (!Scompanyname.match(companyRegex)) {
      errors.e2 = "Invalid company name";
    }

    if (!Swemail) {
      errors.e3 = "Email is required";
    } else if (!Swemail.match(emailRegex)) {
      errors.e3 = "Invalid email";
    }

    if (!Snpassword) {
      errors.e4 = "New password is requred";
    } else if (Snpassword.length < 8) {
      errors.e4 = "Password must be atleast 8 character";
    }

    if (!Scpassword) {
      errors.e5 = "Confirm password is required";
    } else if (!Scpassword.match(Snpassword)) {
      errors.e5 = "Password doesn't match";
    }

    setSignupError(errors);
    navigate("/");
  };

  const showBox = {
    transition: "ease-in-out all 300ms",

    display: "none",
  };

  return (
    <>
   

      <div
        className="w-screen h-screen bg-red-200 bg-cover bg-center pt-12 fixed"
        style={{ backgroundImage: "url('/login/background.jpg'" }}
      >
        <div
          id="loginSingupBOx"
          className="w-[606px] h-fit bg-white b-rounded m-auto rounded-xl py-12 px-32 flex gap-5"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            translate: "-50% -50%",
          }}
        >
          
          {/* Login box */}
          <div
            id="loginBox"
            className="flex flex-col text-xl"
            style={login ? showBox : {}}
          >
            <div
              id="title"
              className="text-center text-4xl font-extrabold mb-10"
            >
              Login
            </div>
            <div className="mb-1.5">
              <label htmlFor="Lemail">Email</label>
            </div>
            <div className="mb-5">
              <input
                type="email"
                id="Lemail"
                className="font-light border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
                placeholder="Enter Email"
                value={Lemail}
                onChange={(e) => setLemail(e.target.value)}
              />
              {loginError.e1 && (
                <div className="text-red-500 italic font-light text-[16px]">
                  {loginError.e1}
                </div>
              )}
            </div>
            <div className="mb-1.5">
              <label htmlFor="Lpassword" className="mb-1">
                Password
              </label>
            </div>
            <div className="relative mb-10">
              <input
                type={LPassword ? "text" : "password"}
                id="Lpassword"
                className="font-light border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
                placeholder="Enter Password"
                value={Lpassowrd}
                onChange={(e) => setLpassword(e.target.value)}
              />
              <FaEyeSlash
                className={`absolute right-2 top-2 ${
                  LPassword ? "hidden" : ""
                }`}
                onClick={() => setLPassword(!LPassword)}
              />
              <FaEye
                className={`absolute right-2 top-2 ${
                  LPassword ? "" : "hidden"
                }`}
                onClick={() => setLPassword(!LPassword)}
              />
              {loginError.e2 && (
                <div className="text-red-500 italic font-light text-[16px]">
                  {loginError.e2}
                </div>
              )}
            </div>

            <button
              type="button"
              className="w-full bg-black text-white py-3 font-bold rounded-xl cursor-pointer"
              onClick={loginValidation}
            >
              Login
            </button>

            <div className="w-full h-[1px] bg-black my-4"></div>

            <div className="w-[350px] text-[18px] text-center">
              Don't have an account?
              <br />
              <span
                className="text-blue-800 underline cursor-pointer"
                onClick={() => {
                  setLogin(true);
                  resetFields();
                }}
              >
                Click Here.
              </span>
            </div>
          </div>
          {/* Signup Box */}
          <div
            id="Signupbox"
            className="flex flex-col text-xl"
            style={!login ? showBox : {}}
          >
            
              <div
                id="title"
                className="text-center text-4xl font-extrabold mb-10"
              >
                Singup
              </div>
              <div className="mb-1.5">
                <label htmlFor="SFName">Full Name</label>
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  id="SFName"
                  className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
                  placeholder="Enter Full Name"
                  value={Sfname}
                  onChange={(e) => setSfname(e.target.value)}
                />
                {signupError.e1 && (
                  <div className="text-red-500 italic font-light text-[16px]">
                    {signupError.e1}
                  </div>
                )}
              </div>
              <div className="mb-1.5">
                <label htmlFor="SCompany">Company Name</label>
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  id="SCompany"
                  className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
                  placeholder="Enter Company Name"
                  value={Scompanyname}
                  onChange={(e) => setScompanyname(e.target.value)}
                />
                {signupError.e2 && (
                  <div className="text-red-500 italic font-light text-[16px]">
                    {signupError.e2}
                  </div>
                )}
              </div>
              <div className="mb-1.5">
                <label htmlFor="Semail">Email</label>
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  id="Semail"
                  className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
                  placeholder="Enter Work Email"
                  value={Swemail}
                  onChange={(e) => setSwemail(e.target.value)}
                />
                {signupError.e3 && (
                  <div className="text-red-500 italic font-light text-[16px]">
                    {signupError.e3}
                  </div>
                )}
              </div>

              <div className="mb-1.5">
                <label htmlFor="SNpassword" className="mb-1">
                  New Password
                </label>
              </div>
              <div className="relative mb-5">
                <input
                  type={SNPassword ? "text" : "password"}
                  id="SNpassword"
                  className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
                  placeholder="Enter New Password"
                  value={Snpassword}
                  onChange={(e) => setSnpassword(e.target.value)}
                />
                <FaEyeSlash
                  className={`absolute right-2 top-2 ${
                    SNPassword ? "hidden" : ""
                  }`}
                  onClick={() => setSNPassword(!SNPassword)}
                />
                <FaEye
                  className={`absolute right-2 top-2 ${
                    SNPassword ? "" : "hidden"
                  }`}
                  onClick={() => setSNPassword(!SNPassword)}
                />
                {signupError.e4 && (
                  <div className="text-red-500 italic font-light text-[16px]">
                    {signupError.e4}
                  </div>
                )}
              </div>

              <div className="mb-1.5">
                <label htmlFor="SCpassword" className="mb-1">
                  Confirm Password
                </label>
              </div>
              <div className="relative mb-10">
                <input
                  type={SCPassword ? "text" : "password"}
                  id="SCpassword"
                  className="border rounded-sm outline-none pl-[8px] pr-[35px] py-[3px] w-[350px]"
                  placeholder="Confirm Password"
                  value={Scpassword}
                  onChange={(e) => {
                    setScpassword(e.target.value);
                  }}
                />
                <FaEyeSlash
                  className={`absolute right-2 top-2 ${
                    SCPassword ? "hidden" : ""
                  }`}
                  onClick={() => setSCPassword(!SCPassword)}
                />
                <FaEye
                  className={`absolute right-2 top-2 ${
                    SCPassword ? "" : "hidden"
                  }`}
                  onClick={() => setSCPassword(!SCPassword)}
                />
                {signupError.e5 && (
                  <div className="text-red-500 italic font-light text-[16px]">
                    {signupError.e5}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="w-full bg-black text-white py-3 font-bold rounded-xl cursor-pointer"
                onClick={signupValidation}
              >
                Signup
              </button>

              <div className="w-full h-[1px] bg-black my-4"></div>

              <div className="w-[350px] text-[18px] text-center">
                Already have an account?
                <br />
                <span
                  className="text-blue-800 underline cursor-pointer"
                  onClick={() => {
                    setLogin(false);
                    resetFields();
                  }}
                >
                  Click Here.
                </span>
              </div>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
