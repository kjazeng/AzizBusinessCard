// src/pages/Settings/Settings.jsx

import React, { useState, useContext } from "react";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReportProblemModal from "../ReportProblemModal";
import {
  faBug,
  faEnvelope,
  faShieldAlt,
  faFileContract,
  faInfoCircle,
  faMoon,
  faSun,
  faTrashAlt,
  faCookieBite,
} from "@fortawesome/free-solid-svg-icons";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { DarkModeContext } from "../../context/DarkModeContext";
import { useAuth } from "../../context/AuthContext";
import BeeLoader from "../BeeLoader";
import "./Settings.css";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user } = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    toast.success(`Dark mode ${darkMode ? "disabled" : "enabled"}`, {
      icon: darkMode ? "🌞" : "🌙",
    });
  };

  const handleSoftDeleteAccount = async () => {
    if (!user) {
      toast.error("You must be logged in to delete your account.");
      return;
    }
    setLoading(true);

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        accountStatus: "deleted",
        deletedAt: new Date(),
      });

      toast.success("Account marked for deletion successfully.");
      auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error soft deleting user:", error);
      toast.error("Failed to mark account for deletion. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const settingsOptions = [
    {
      icon: faBug,
      text: "Report a Problem",
      action: () => setShowReportModal(true),
    },
    { icon: faEnvelope, text: "Contact Us", link: "/contact-us" },
    { icon: faInfoCircle, text: "About CardToBee", link: "/about" },
    { icon: faShieldAlt, text: "Privacy Policy", link: "/privacy" },
    { icon: faFileContract, text: "Terms of Service", link: "/terms" },
    { icon: faCookieBite, text: "Cookies Policy", link: "/cookies" },
    {
      icon: darkMode ? faSun : faMoon,
      text: "Dark Mode",
      action: handleDarkModeToggle,
    },
  ];

  return (
    <div className={`settings-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="logo-container">
        <img
          src="/assets/cardtobee_logo.png"
          alt="CardToBee Logo"
          className="cardtobee-logo"
        />
      </div>
      <h2 className="settings-title">Settings</h2>
      <div className="honeycomb-grid">
        {settingsOptions.map((option, index) =>
          option.link ? (
            <Link key={index} to={option.link} className="honeycomb-cell">
              <div className="honeycomb-content">
                <FontAwesomeIcon icon={option.icon} className="settings-icon" />
                <span>{option.text}</span>
              </div>
            </Link>
          ) : (
            <div key={index} className="honeycomb-cell" onClick={option.action}>
              <div className="honeycomb-content">
                <FontAwesomeIcon icon={option.icon} className="settings-icon" />
                <span>{option.text}</span>
              </div>
            </div>
          )
        )}
        {user && (
          <div
            className="honeycomb-cell delete-account"
            onClick={() => setShowDeleteModal(true)}
          >
            <div className="honeycomb-content">
              <FontAwesomeIcon icon={faTrashAlt} className="settings-icon" />
              <span>Delete My Account</span>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal honeycomb-modal">
          <div className="modal-content">
            <h4>Are you sure you want to delete your account?</h4>
            <p>This action can be undone by contacting support.</p>
            <div className="modal-buttons">
              <button
                className="bee-btn cancel-button"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bee-btn delete-button"
                onClick={handleSoftDeleteAccount}
                disabled={loading}
              >
                {loading ? <BeeLoader /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportProblemModal
        show={showReportModal}
        handleClose={() => setShowReportModal(false)}
      />
      <div className="copyright">
        &copy; {new Date().getFullYear()} CardToBee. All rights reserved.
      </div>
    </div>
  );
};

export default Settings;
