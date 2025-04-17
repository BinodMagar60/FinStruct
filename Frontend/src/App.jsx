import React, { useEffect, useState } from "react";
import Signin from "./Components/Signin";
import Signup from "./Components/Signup";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [isSignin, setSignin] = useState(true);
  const token = localStorage.getItem("token");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const navigate = useNavigate();

 
  useEffect(() => {
    if (token && userDetails) {
      if (userDetails.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    }
  }, [token, userDetails, navigate]);

  return (
    <>
      {
        !token && (
          <div
            className="w-screen h-screen bg-red-200 bg-cover bg-center pt-12 fixed"
            style={{ backgroundImage: "url('/login/background.jpg')" }}
          >
            <div
              id="loginSingupBOx"
              className="w-[606px] h-fit bg-white b-rounded m-auto rounded-xl py-12 px-32 flex gap-5 flex-col"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                translate: "-50% -50%",
              }}
            >
              {isSignin ? <Signin /> : <Signup isSignin={isSignin} setSignin={setSignin} />}

              <div className="w-full h-[1px] bg-black my-4"></div>

              <div className="w-[350px] text-[18px] text-center">
                {isSignin ? "Already have an account?" : "Don't have an account?"}
                <br />
                <span
                  className="text-blue-800 underline cursor-pointer"
                  onClick={() => setSignin(!isSignin)}
                >
                  Click Here.
                </span>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default App;
