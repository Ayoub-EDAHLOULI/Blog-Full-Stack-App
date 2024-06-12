import "./Dashboard.scss";
import { useEffect, useContext } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Profile from "../Profile/Profile";
import ArticlesCrud from "../../components/ArticlesCrud/ArticlesCrud";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    console.log("Current URL: ", window.location.href);
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get("tab");
    console.log("Tab parameter: ", tab);
  }, [location]);

  const handleNavigation = (tab) => {
    navigate(`/dashboard?tab=${tab}`);
  };

  return (
    <>
      <section className="dashboard">
        <div className="dashboard-container">
          <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar-header">
              <h2>Dashboard</h2>
              <div className="dashboard-sidebar-header-line"></div>
            </div>
            <div className="dashboard-sidebar-items">
              <div
                className={`dashboard-sidebar-item ${
                  location.search.includes("tab=dashboard") ? "active" : ""
                }`}
                onClick={() => handleNavigation("dashboard")}
              >
                <i className="fa-solid fa-table-columns"></i>
                <NavLink to="/dashboard">Dashboard</NavLink>
              </div>
              <h4 className="account-pages">Account Pages</h4>
              <div
                className={`dashboard-sidebar-item ${
                  location.search.includes("tab=profile") ? "active" : ""
                }`}
                onClick={() => handleNavigation("profile")}
              >
                <i className="fas fa-user"></i>
                <NavLink to="/dashboard/profile ">Profile</NavLink>
              </div>

              <div
                className={`dashboard-sidebar-item ${
                  location.search.includes("tab=Articles") ? "active" : ""
                }`}
                onClick={() => handleNavigation("Articles")}
              >
                <i className="fa-solid fa-newspaper"></i>
                <NavLink to="/dashboard/Articles ">Articles</NavLink>
              </div>

              <div className="dashboard-sidebar-item">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <NavLink to="/" onClick={logout}>
                  Sign Out
                </NavLink>
              </div>
            </div>
          </aside>

          <main className="dashboard-main">
            {
              // Dashboard content
              location.search.includes("tab=dashboard") && (
                <div className="dashboard-main-dashboard">
                  <h2>Dashboard</h2>
                  <p>Welcome to the dashboard</p>
                </div>
              )
            }

            {
              // Profile content
              location.search.includes("tab=profile") && (
                <div className="dashboard-main-profile">
                  <div className="profile-image"></div>
                  <div className="profile-content">
                    <h2>Profile</h2>
                    <Profile />
                  </div>
                </div>
              )
            }

            {
              // Articles content
              location.search.includes("tab=Articles") && (
                <div className="dashboard-main-articles">
                  <ArticlesCrud />
                </div>
              )
            }
          </main>
        </div>
      </section>
    </>
  );
}
