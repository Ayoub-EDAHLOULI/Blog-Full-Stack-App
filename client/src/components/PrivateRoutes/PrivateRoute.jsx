import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const isLoogedIn = localStorage.getItem("isLoggedIn");
  console.log("This is logged in", isLoogedIn);
  return isLoogedIn ? <Outlet /> : <Navigate to="/login" />;
}
