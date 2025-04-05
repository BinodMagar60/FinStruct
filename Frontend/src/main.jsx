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
import IncomeExpenses from "./Components/sidebar/IncomeExpenses";
import TodoList from "./Components/sidebar/TodoList";
import CompletedList from "./Components/sidebar/CompletedList";
import InprogreeList from "./Components/sidebar/InprogreeList";



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
        element: <TodoList/>
      },
      {
        path: "inprogress",
        element: <InprogreeList/>
      },
      {
        path: "completed",
        element: <CompletedList/>
      },
      {
        path: "transaction",
        element: <IncomeExpenses/>
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
        element: <Tasks/>
      },
      {
        path: "todo",
        element: <TodoList/>
      },
      {
        path: "inprogress",
        element: <InprogreeList/>
      },
      {
        path: "completed",
        element: <CompletedList/>
      },
      {
        path: "transaction",
        element: <IncomeExpenses/>
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
