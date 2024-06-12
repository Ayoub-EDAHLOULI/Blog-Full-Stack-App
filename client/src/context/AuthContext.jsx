import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider(props) {
  const [token, setToken] = useState(null);
  const [isLoogedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const login = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", true);
    setIsLoggedIn(true);
    navigate("/");
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    navigate("/");
  };

  //Check if the token is expired
  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (decodedToken.exp < Date.now() / 1000) {
        logout();
        navigate("/login");
      }
    }
  });

  //User Info
  useEffect(() => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser(decodedToken);
    }
  }, [token]);

  const values = {
    login,
    logout,
    token,
    user,
    isLoogedIn,
  };

  return <AuthContext.Provider value={values} {...props} />;
}

export { AuthContext, AuthProvider };
