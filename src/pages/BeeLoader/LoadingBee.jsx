// BeeLoader.jsx
import React from "react";
import "./LoadingBee.css";
import logo from "../../../public/assets/cardtobee_logo.png";

const BeeLoader = () => {
  return (
    <div className="bee-loader-container">
      <div className="honeycomb">
        {[...Array(7)].map((_, index) => (
          <div key={index} className="comb"></div>
        ))}
      </div>
      <div className="loader-content">
        <img src={logo} alt="CardToBee Logo" className="flying-bee" />
        <h3>Loading CardToBee...</h3>
      </div>
    </div>
  );
};

export default BeeLoader;
