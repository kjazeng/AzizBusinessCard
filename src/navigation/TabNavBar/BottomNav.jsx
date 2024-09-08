import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faUser,
  faCog,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./BottomNav.css";

function BottomNav({ handleShowModal }) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <ul className="bottom-nav-list">
        <li className="bottom-nav-item">
          <Link
            to="/"
            className={`bottom-nav-link ${isActive("/") ? "active" : ""}`}
            aria-label="Home"
          >
            <FontAwesomeIcon icon={faHome} className="bottom-nav-icon" />
            <span className="bottom-nav-text">Home</span>
          </Link>
        </li>

        {!user && (
          <li className="bottom-nav-item">
            <Link
              to="/card-to-bee-list"
              className={`bottom-nav-link ${
                isActive("/card-to-bee-list") ? "active" : ""
              }`}
              aria-label="Search CardToBee"
            >
              <FontAwesomeIcon icon={faSearch} className="bottom-nav-icon" />
              <span className="bottom-nav-text">Search</span>
            </Link>
          </li>
        )}

        {user ? (
          <>
            <li className="bottom-nav-item">
              <Link
                to="/profile"
                className={`bottom-nav-link ${
                  isActive("/profile") ? "active" : ""
                }`}
                aria-label="Profile"
              >
                <FontAwesomeIcon icon={faUser} className="bottom-nav-icon" />
                <span className="bottom-nav-text">Profile</span>
              </Link>
            </li>
            <li className="bottom-nav-item">
              <Link
                to="/settings"
                className={`bottom-nav-link ${
                  isActive("/settings") ? "active" : ""
                }`}
                aria-label="Settings"
              >
                <FontAwesomeIcon icon={faCog} className="bottom-nav-icon" />
                <span className="bottom-nav-text">Settings</span>
              </Link>
            </li>
          </>
        ) : (
          <li className="bottom-nav-item">
            <button
              className="bottom-nav-link sign-in-btn"
              aria-label="Sign In"
              onClick={() => handleShowModal(true)}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="bottom-nav-icon" />
              <span className="bottom-nav-text">Sign In</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default BottomNav;
