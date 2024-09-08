import React from "react";
import EmailSignIn from "../SignIn/EmailSignIn";
import EmailSignUp from "../SignUp/EmailSignUp";
import "./AuthModal.css";

const AuthModalController = ({ show, isSignIn, handleClose, setIsSignIn }) => {
  if (!show) return null;

  const toggleSignInSignUp = () => {
    setIsSignIn(!isSignIn);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "auth-modal-overlay") {
      handleClose();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        {isSignIn ? (
          <EmailSignIn
            handleClose={handleClose}
            handleShowSignUp={toggleSignInSignUp}
          />
        ) : (
          <EmailSignUp
            handleClose={handleClose}
            handleShowSignIn={toggleSignInSignUp}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModalController;
