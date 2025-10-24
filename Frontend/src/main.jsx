import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Admin from "./Pages/admin/Admin"
import Salary from "./Pages/admin/salary/Salary";
import Mails from "./Pages/common_pages/mail/Mails"
import Docs from "./Pages/common_pages/documents/Docs"
import Employee from "./Pages/employee/Employee"
import Overview from "./Pages/common_pages/overview/Overview";
import Tasks from "./Pages/common_pages/taskpages/Tasks";
import IncomeExpenses from "./Pages/common_pages/incomeexpense/IncomeExpenses";
import TodoList from "./Pages/common_pages/taskpages/TodoList";
import CompletedList from "./Pages/common_pages/taskpages/CompletedList";
import InprogreeList from "./Pages/common_pages/taskpages/InprogreeList";
import TaskDetail from "./Components/TaskDetails/TaskDetail";
import ProtectedRoute from "./utils/ProtectedRoute";
import User from "./Pages/common_pages/users/User";
import Dashboard from "./Pages/admin/dashboard/Dashboard";
import Profile from "./Pages/userprofile/Profile";
import Setting from "./Pages/userprofile/Setting";
import ProfileUser from "./Pages/userprofile/ProfileUser";
import Activity from "./Pages/userprofile/Activity";
import NotFound from "./Components/NotFound";
import Unauthorized from "./Components/Unauthorized";









const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={['admin']}/>,
    errorElement: <NotFound />,
    children:[
      {
        path: "",
        element: <Admin/>,
        children: [
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
          },
          {
            path: "details",
            element: <TaskDetail/>
          }
        ]
      }
      
    ]
  },
  {
    path: "/admin/profile",
    element: <ProtectedRoute allowedRoles={['admin']}/>,
    errorElement: <NotFound />,

    children:[
      {
        path: "",
        element: <Profile/>,
        children: [
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
    ]
  },
  {
    path: "/employee",
    element: <ProtectedRoute allowedRoles={['employee']}/>,
    errorElement: <NotFound />,
    children:[
      {
        path: "",
        element: <Employee/>,
        children: [
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
          },
          {
            path: "details",
            element: <TaskDetail/>
          }
        ]
      } 
    ]
  },
  {
    path: "/employee/profile",
    element: <ProtectedRoute allowedRoles={['employee']}/>,
    errorElement: <NotFound />,

    children:[
      {
        path: "",
        element: <Profile/>,
        children: [
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
    ]
  },
  {
    path: "/unauthorized",
    element: <Unauthorized/>
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
