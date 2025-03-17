import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Bounce, toast, ToastContainer } from "react-toastify";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import Admin from "./Pages/admin/Admin";
import Profile from "./Pages/admin/Profile";
import { Dashboard } from "./Pages/admin/Dashboard";
import Salary from "./Pages/admin/Salary";
import User from "./Pages/admin/User";
import Mail from "./Pages/admin/Mail";
import Docs from "./Pages/admin/Docs";
import Setting from "./Pages/admin/Setting";
import ProfileUser from "./Pages/admin/ProfileUser";
import Activity from "./Pages/admin/Activity";
import Overview from "./Pages/admin/Overview";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    element: <Admin />,
    errorElement: <NotFound />,
    children:[
      {
        path:'dashboard',
        element:<Dashboard/>
      },
      {
        path: "salary",
        element: <Salary/>
      },
      {
        path: "user",
        element: <User/>
      },
      {
        path: "mail",
        element: <Mail/>
      },
      {
        path: "docs",
        element: <Docs/>
      },
      {
        path: "overview",
        element: <Overview/>
      }
    ]
  },
  {
    path: "/admin/profile",
    element: <Profile />,
    errorElement: <NotFound />,

    children:[
      {
        path: "setting",
        element: <Setting/>
      },
      {
        path: "profileuser",
        element: <ProfileUser/>
      },
      {
        path: "activity",
        element: <Activity/>
      }
    ]
  },
 
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
    <RouterProvider router={router} />
  </StrictMode>
);
