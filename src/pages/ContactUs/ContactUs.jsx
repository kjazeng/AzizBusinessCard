// ContactUs.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "./ContactUs.css";

function ContactUs() {
  return (
    <div className="contact-us-container">
      <div className="honeycomb-bg"></div>
      <div className="content">
        <img
          src="/assets/cardtobee_logo.png"
          alt="CardToBee Logo"
          className="logo"
        />
        <h2>Buzz Us!</h2>
        <p>Have a question or need assistance? We're here to help!</p>
        <ul className="contact-info-list">
          <li>
            <FontAwesomeIcon icon={faPhone} className="contact-icon" />
            <span>+1 234 567 890</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
            <a href="mailto:support@cardtobee.com?subject=Support Request">
              support@cardtobee.com
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ContactUs;
