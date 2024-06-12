import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import "./Login.scss";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContext } from "../../../context/ToastContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  //State for the form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Context
  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);

  //Check if the user exists in the database
  const loginUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        //Show a success message
        await addToast("Login successful", "success");

        login(data.data.token); //Use the login function from the context
      } else {
        console.log(data.error);
        toast.error(`Error: ${data.message}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      //Get the data from the response
      console.log(data);
    } catch (error) {
      console.error("Error logging in user:", error);
      toast.error("An unexpected error occurred", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  //Function to handle the form submission
  const handelSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <>
      <div className="Login">
        <div className="close">
          <Link to="/">
            <i className="fa-solid fa-xmark"></i>
          </Link>
        </div>
        {/* Conditional rendering based on login success */}

        <form onSubmit={handelSubmit}>
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>

          <p className="accountMissing">
            Dont have an account?
            <Link to="/register">Register</Link>
          </p>
        </form>

        <ToastContainer />
      </div>
    </>
  );
}
