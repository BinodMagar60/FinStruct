import React, {useState, useEffect, useRef} from "react";
import Navbar from "../../Components/Navbar";
import Sidebar from "../../Components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Home, LogOut } from "lucide-react";
import { useCookies } from "react-cookie";
import { apiCall } from "../../api/api";
import { PiCloudFogLight } from "react-icons/pi";

const Admin = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['authToken'])
  const [isLogout, setLogout] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [user, setUser] = useState(null);
  
  const handleLogout = () => {
    removeCookie('authToken')
    navigate('/')
  }
  
  useEffect(()=>{
    const token = cookies.authToken
    if(token){
      console.log(token)
      apiCall.get("/auth")
    }
    else{
      navigate('/')
    }
  },[])

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

  return (
    <div className='bg-[#efefef] h-screen relative'>
      <Navbar isLogout={isLogout} setLogout={setLogout}/>
      <div className="flex">
      <Sidebar isLogout={isLogout} setLogout={setLogout}/>
      <span className='pt-24 w-full h-screen mx-15 overflow-x-auto p-5' style={{
        scrollbarWidth: "none"
      }}><Outlet/></span>
      </div>

      
    {isLogout && (<div ref={modalRef} className="absolute z-[999] top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white text-2xl  shadow-inner border border-gray-300 px-15 py-10 rounded ">
        <div>Would you like to Logout?</div>
        <div className="mt-5 text-base flex justify-center gap-5"> 
          <button className=" flex items-center gap-1 bg-white border px-3 py-1 text-black rounded cursor-pointer hover:bg-black hover:text-white transition-all" onClick={()=>setLogout(!isLogout)}><span><Home size={16}/></span><span>Return</span></button>
          <button className="flex items-center gap-1 border border-red-500 bg-red-500 px-3 py-1 text-white rounded cursor-pointer transition-all hover:bg-red-600" onClick={handleLogout}><span><LogOut size={16}/></span><span>Leave</span></button>
        </div>
      </div>)
      }


    </div>
  );
};

export default Admin;
