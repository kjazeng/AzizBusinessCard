import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import AnonymousAuth from "../../authProviders/AnonymousAuth";
import BeeLoader from "../BeeLoader";
import logo from "/assets/cardtobee_logo.png";
import "./Home.css";

function Home({ handleShowModal, handleShowSignUp }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      setLoading(true);
      setTimeout(() => {
        navigate("/card-to-bee-list");
      }, 1000);
    }
  }, [user, navigate, authLoading]);

  if (loading) {
    return (
      <div className="loader-container">
        <BeeLoader />
        <p className="loader-text">Buzzing you to your hive...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <div className="bee-box">
          <img
            src={logo}
            alt="CardToBee Logo"
            className="cardtobee-logo float-animation"
          />
          <h1 className="bee-title">Welcome to CardToBee</h1>
          <p className="bee-text">
            Create your bee-siness card today and let it take flight with
            CardToBee!
          </p>

          <div className="honeycomb-grid">
            <div className="honeycomb-cell">
              <i className="fas fa-id-card"></i>
              <p>Create Cards</p>
            </div>
            <div className="honeycomb-cell">
              <i className="fas fa-share-alt"></i>
              <p>Share Easily</p>
            </div>
            <div className="honeycomb-cell">
              <i className="fas fa-network-wired"></i>
              <p>Connect</p>
            </div>
          </div>

          <div className="promotion-section">
            {user ? (
              <Link
                to="/card-2-business"
                className="bee-btn create-card-button"
              >
                Create CardToBee
              </Link>
            ) : (
              <div className="auth-buttons">
                <button
                  className="bee-btn"
                  onClick={() => handleShowModal(true)}
                >
                  Sign In / Sign Up
                </button>
                <AnonymousAuth />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
