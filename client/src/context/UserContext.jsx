import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.id;
    setUserId(userId);

    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/api/v1/user/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (isMounted) {
          setUser(data.data);
          console.log("User data fetched successfully", data.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("An error occurred while fetching the user", error);
        }
      }
    };

    fetchUser();
  }, [userId]);

  const value = {
    user,
  };

  return <UserContext.Provider value={value} {...props} />;
};

export { UserProvider, UserContext };
