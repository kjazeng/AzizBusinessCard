import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BeeLoader from "../../../pages/BeeLoader";
import GoogleAuth from "../../GoogleAuth/GoogleAuth";
import ForgotPasswordModal from "../ForgotPasswordModal";
import logo from "/assets/cardtobee_logo.png";
import "react-toastify/dist/ReactToastify.css";
import "./EmailSignIn.css";

const EmailSignIn = ({ handleClose, handleShowSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const cardRef = doc(db, "businessCards", user.uid);
      const cardDoc = await getDoc(cardRef);

      if (cardDoc.exists()) {
        toast.warn("You have already created a CardToBee.");
        navigate("/profile");
      } else {
        toast.success("Login successful! You can now create a CardToBee.");
        navigate("/card-2-business");
      }

      handleClose();
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <img src={logo} alt="CardToBee Logo" className="logo" />
      <h2>Log In to CardToBee</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
          className="honeycomb-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="honeycomb-input"
        />
        <button type="submit" className="honeycomb-button" disabled={loading}>
          {loading ? <BeeLoader /> : "Sign In"}
        </button>
      </form>
      <p className="forgot-password">
        <span
          onClick={() => setIsForgotPasswordOpen(true)}
          role="button"
          tabIndex={0}
        >
          Forgot Password?
        </span>
      </p>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <GoogleAuth handleClose={handleClose} />
      <p className="auth-link">
        <span onClick={handleShowSignUp} role="button" tabIndex={0}>
          Don't have an account? Sign Up
        </span>
      </p>
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default EmailSignIn;
