import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import { CookiesProvider } from "react-cookie";
import Admin from "./Pages/admin/Admin"
import Dashboard from "./Components/sidebar/Dashboard";
import Salary from "./Components/sidebar/Salary";
import User from "./Pages/admin/SideBarLists/User";
import Mails from "./Components/sidebar/Mails"
import Docs from "./Components/sidebar/Docs"
import Profile from "./Components/userprofile/Profile"
import Setting from "./Components/userprofile/Setting"
import ProfileUser from "./Components/userprofile/ProfileUser"
import Activity from "./Components/userprofile/Activity"
import Employee from "./Pages/users/Employee"
import Overview from "./Components/sidebar/Overview";
import EmployeeUser from "./Pages/users/SideBarLists/EmployeeUser";
import Tasks from "./Components/sidebar/Tasks";



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
        element: <Mails/>
      },
      {
        path: "docs",
        element: <Docs/>
      },
      {
        path: "overview",
        element: <Overview/>
      },
      {
        path: "tasks",
        element: <Tasks/>
      },
      {
        path: "todo",
        element: <div>todo</div>
      },
      {
        path: "inprogress",
        element: <div>in progress</div>
      },
      {
        path: "completed",
        element: <div>competed</div>
      },
      {
        path: "income-expense",
        element: <div>income expense</div>
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
        element: <Mails/>
      },
      {
        path: "docs",
        element: <Docs/>
      },
      {
        path: "overview",
        element: <Overview/>
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
