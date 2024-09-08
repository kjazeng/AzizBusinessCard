// NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import cardToBeeLogo from "/assets/cardtobee_logo.png";

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="honeycomb-background"></div>
      <div className="content-wrapper">
        <h1 className="error-title">!!?</h1>
        <img
          src={cardToBeeLogo}
          alt="CardToBee Logo"
          className="cardtobee-logo float-animation"
        />
        <h1 className="error-code">404</h1>
        <div className="hexagon-container">
          <div className="hexagon">
            <p className="error-message">Oops! This page doesn't exist.</p>
          </div>
        </div>
        <p className="error-instruction">
          Looks like you've buzzed into the wrong honeycomb!
        </p>
        <Link to="/" className="bee-btn">
          Fly Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
