// src/utils/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { IoMdReturnRight } from "react-icons/io";



// Fake role-checking utility (replace or expand based on your auth system)
// const getUserFromToken = (token) => {
//   try {
//     const decoded = jwtDecode(token);
//     return decoded; // { id, username, role, ... }
//   } catch (err) {
//     return null;
//   }
// };

const ProtectedRoute = ({ allowedRoles }) => {

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("userDetails"));

  if (!user && !token) {
    // Not authenticated
    return <Navigate to="/"  replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Authenticated but not authorized
    return <Navigate to="/unauthorized" replace />;
  }

  // Authenticated and authorized
//   return navigate('/ad');
    return <Outlet/>
};

export default ProtectedRoute;
