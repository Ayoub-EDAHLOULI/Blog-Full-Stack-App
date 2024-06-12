import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function PrivateRoute() {
  const { isLoogedIn, user } = useContext(AuthContext);

  const loggedInRole = user.role === "ADMIN" ? true : false;

  return isLoogedIn && loggedInRole ? <Outlet /> : <Navigate to="/" />;
}
