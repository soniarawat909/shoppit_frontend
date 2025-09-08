import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Links = ({ isAuthenticated, username, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      {!isAuthenticated ? (
        <>
          <li className="nav-item">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
              }
            >
              Login
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
              }
            >
              Register
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li className="nav-item">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-link active fw-semibold" : "nav-link fw-semibold"
              }
            >
              Hi, {username}
            </NavLink>
          </li>

          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="btn btn-link nav-link fw-semibold"
            >
              Logout
            </button>
          </li>
        </>
      )}
    </ul>
  );
};

export default Links;
