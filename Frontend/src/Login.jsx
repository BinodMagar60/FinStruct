import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import Popup from "./Components/Popup"
import "./login.css"
import Loading from "./Components/Loading";

const Login = () => {
  const [login, setLogin] = useState(false)
  const [LPassword, setLPassword] = useState(false);
  const [SNPassword, setSNPassword] = useState(false);
  const [SCPassword, setSCPassword] = useState(false);
  const [alert, setAlert] = useState(false);


  const [Lemail, setLemail] = useState("");
  const [Lpassowrd, setLpassword] = useState("");
  const [Sfname, setSfname] = useState("");
  const [Scompanyname, setScompanyname] = useState("");
  const [Swemail, setSwemail] = useState("");
  const [Snpassword, setSnpassword] = useState("");
  const [Scpassword, setScpassword] = useState("");


  const resetFields = () => {
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
    
  }


  const showAlert = () =>{
    
  }
  

  const showBox = {
    transition: "ease-in-out all 300ms",
    
    display: "none"
    // translate: 
  }

  return (
    <>
      
      {/* <Popup message="Successful" status="success"/> */}
      
      
    <div
      className="w-screen h-screen bg-red-200 bg-cover bg-center pt-12 fixed"
      style={{ backgroundImage: "url('/login/background.jpg'" }}
    >
      <div
        id="loginSingupBOx"
        className="w-[606px] h-fit bg-white b-rounded m-auto rounded-xl py-14 px-32 flex gap-5"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
      }}
      >

        {/* Login box */}


        <div id="loginBox" className="flex flex-col text-xl" style={login? showBox: {}}>
        <div id="title" className="text-center text-4xl font-extrabold mb-10">
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
              onChange={(e)=>setLemail(e.target.value)}
            />
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
              onChange={(e)=>setLpassword(e.target.value)}
            />
            <FaEyeSlash
              className={`absolute right-2 top-2 ${LPassword? "hidden":""}`}
              onClick={() => setLPassword(!LPassword)}
            />
            <FaEye className={`absolute right-2 top-2 ${LPassword? "":"hidden"}`} onClick={() => setLPassword(!LPassword)}/>
          </div>

          <button
            type="button"
            className="w-full bg-black text-white py-3 font-bold rounded-xl cursor-pointer"
          >
            Login
          </button>

          <div className="w-full h-[1px] bg-black my-4"></div>

          <div className="w-[350px] text-[18px] text-center">
            Don't have an account?
            <br />
            <span className="text-blue-800 underline cursor-pointer" onClick={()=>{
              setLogin(true);
              resetFields();
            }}>
              Click Here.
            </span>
          </div>
        </div>


          {/* Signup Box */}


        <div id="Signupbox" className="flex flex-col text-xl" style={!login? showBox: {}}>
        <div id="title" className="text-center text-4xl font-extrabold mb-10">
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
              onChange={(e)=>setSfname(e.target.value)}
            />
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
              onChange={(e)=>setScompanyname(e.target.value)}

            />
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
              onChange={(e)=>setSwemail(e.target.value)}
            />
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
              onChange={(e)=>setSnpassword(e.target.value)}
            />
            <FaEyeSlash
              className={`absolute right-2 top-2 ${SNPassword? "hidden":""}`}
              onClick={() => setSNPassword(!SNPassword)}
            />
            <FaEye className={`absolute right-2 top-2 ${SNPassword? "":"hidden"}`} onClick={() => setSNPassword(!SNPassword)}/>
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
              onChange={(e)=>{setScpassword(e.target.value)}}
            />
            <FaEyeSlash
              className={`absolute right-2 top-2 ${SCPassword? "hidden":""}`}
              onClick={() => setSCPassword(!SCPassword)}
            />
            <FaEye className={`absolute right-2 top-2 ${SCPassword? "":"hidden"}`} onClick={() => setSCPassword(!SCPassword)}/>
          </div>

          <button
            type="button"
            className="w-full bg-black text-white py-3 font-bold rounded-xl cursor-pointer"
          >
            Signup
          </button>

          <div className="w-full h-[1px] bg-black my-4"></div>

          <div className="w-[350px] text-[18px] text-center">
            Already have an account?
            <br />
            <span className="text-blue-800 underline cursor-pointer" onClick={()=>{
              setLogin(false);
              resetFields();
            }}>
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
