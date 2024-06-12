import "./App.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Profile from "./pages/Profile/Profile";
import PrivateRoute from "./components/PrivateRoutes/PrivateRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import Articles from "./pages/Articles/Articles";
import CreateArticle from "./components/CreateArticle/CreateArticle";
import PrivateAdminRoute from "./components/PrivateRoutes/PrivateAdminRoute";
import DisplayArticle from "./pages/DisplayArticle/DisplayArticle";
import ContactUs from "./pages/ContactUs/ContactUs";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { isLoogedIn, login } = useContext(AuthContext);

  //Keep the user logged in
  if (localStorage.getItem("token") && !isLoogedIn) {
    const token = localStorage.getItem("token");
    login(token);
  }

  return (
    <>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<DisplayArticle />} />
          <Route path="/contact-us" element={<ContactUs />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<PrivateAdminRoute />}>
            <Route path="/create-article" element={<CreateArticle />} />
          </Route>
        </Routes>

        <Footer />

        <ToastContainer />
      </div>
    </>
  );
}

export default App;
