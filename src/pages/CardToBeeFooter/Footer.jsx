import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "/assets/cardtobee_logo.png";

function Footer() {
  const [showFooter, setShowFooter] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setShowFooter(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!showFooter) return null;

  return (
    <footer className="cardtobee-footer">
      <div className="footer-content">
        <img src={logo} alt="CardToBee Logo" className="footer-logo" />
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <Link to="/terms" className="footer-link">
            Terms of Service
          </Link>
          <Link to="/cookies" className="footer-link">
            Cookie Policy
          </Link>
        </div>
      </div>
      <p className="footer-copyright">
        &copy; {new Date().getFullYear()} CardToBee. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
