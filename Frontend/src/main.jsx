import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import Admin from "./Pages/admin/Admin";
import Profile from "./Components/userprofile/Profile";
import { Dashboard } from "./Pages/admin/Dashboard";
import Salary from "./Pages/admin/Salary";
import User from "./Pages/admin/User";
import Mail from "./Pages/admin/Mail";
import Docs from "./Pages/admin/Docs";
import Setting from "./Components/userprofile/Setting";
import ProfileUser from "./Components/userprofile/ProfileUser";
import Overview from "./Pages/admin/Overview";
import { CookiesProvider } from "react-cookie";
import Employee from "./Pages/users/Employee";
import EmployeeUser from "./Pages/users/SideBarLists/top/EmployeeUser";
import EmployeeDocs from "./Pages/users/SideBarLists/top/EmployeeDocs";
import EmployeeMail from "./Pages/users/SideBarLists/top/EmployeeMail";
import Activity from "./Components/userprofile/Activity";



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
  {
    path: "/employee",
    element: <Employee />,
    errorElement: <NotFound />,
    children:[
      
      {
        path: "user",
        element: <EmployeeUser/>
      },
      {
        path: "mail",
        element: <EmployeeMail/>
      },
      {
        path: "docs",
        element: <EmployeeDocs/>
      },
      {
        path: "overview",
        element: <div>Overview</div>
      },
      {
        path: "tasks",
        element: <div>Tasks</div>
      },
      {
        path: "todo",
        element: <div>Todo</div>
      },
      {
        path: "inprogress",
        element: <div>inprogress</div>
      },
      {
        path: "completed",
        element: <div>completed</div>
      },
      {
        path: "income-expense",
        element: <div>income</div>
      }
    ]
  },
  {
    path: "/employee/profile",
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
  }
 
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CookiesProvider>
    <ToastContainer />
    <RouterProvider router={router} />
    </CookiesProvider>
  </StrictMode>
);
