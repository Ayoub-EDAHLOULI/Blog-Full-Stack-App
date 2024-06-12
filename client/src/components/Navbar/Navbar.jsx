import "./Navbar.scss";
import LogoDark from "../../assets/Logo-Dark-Theme.png";
import LogoLight from "../../assets/Logo-Light-Theme.png";
import "@fortawesome/fontawesome-free/css/all.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function Navbar() {
  const { isLoogedIn, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className="Navigation"
      style={
        theme === "light"
          ? {
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
            }
          : {
              boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
              backgroundColor: "#0C0C10",
            }
      }
    >
      <div className="blackSinta">
        <div className="iconContainer">
          <i className="fa-brands fa-facebook-f"></i>
          <i className="fa-brands fa-x-twitter"></i>
          <i className="fa-brands fa-instagram"></i>
          <i className="fa-brands fa-linkedin-in"></i>
          <i className="fa-brands fa-pinterest-p"></i>

          {theme === "light" ? (
            <i
              className="fa-solid fa-moon"
              onClick={toggleTheme}
              title="Dark Mode"
            ></i>
          ) : (
            <i
              className="fa-solid fa-sun"
              onClick={toggleTheme}
              title="Light Mode"
            ></i>
          )}
        </div>
      </div>
      <nav className="Navbar">
        <Link to="/">
          {theme === "light" ? (
            <img src={LogoDark} alt="Logo" className="NavLogo" />
          ) : (
            <img src={LogoLight} alt="Logo" className="NavLogo" />
          )}
        </Link>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <Link to="/articles?page=1">Articles</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact</Link>
          </li>
        </ul>

        {isLoogedIn ? (
          <div className="auth">
            <Link to="/dashboard?tab=dashboard" className="profile">
              Profile
            </Link>
            <Link to="/" onClick={logout}>
              Logout
            </Link>
          </div>
        ) : (
          <div className="auth">
            <Link to="/login" className="login">
              Login
            </Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}
      </nav>
    </div>
  );
}
