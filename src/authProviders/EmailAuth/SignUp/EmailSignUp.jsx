import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BeeLoader from "../../../pages/BeeLoader";
import GoogleAuth from "../../GoogleAuth/GoogleAuth";
import logo from "/assets/cardtobee_logo.png";
import "./EmailSignUp.css";

const EmailSignUp = ({ handleClose, handleShowSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        firstName,
        lastName,
        createdAt: serverTimestamp(),
      });

      toast.success("Account created successfully!");
      navigate("/card-2-business");
      handleClose();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already in use.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Weak password.");
      } else {
        toast.error("Sign-up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <img src={logo} alt="CardToBee Logo" className="logo" />
      <h2>Sign Up for CardToBee</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          className="honeycomb-input"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          className="honeycomb-input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="honeycomb-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="honeycomb-input"
        />
        <button type="submit" className="honeycomb-button" disabled={loading}>
          {loading ? <BeeLoader /> : "Buzz In"}
        </button>
      </form>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <GoogleAuth handleClose={handleClose} />
      <p className="auth-link">
        <span onClick={handleShowSignIn} role="button" tabIndex={0}>
          Already part of the hive? Sign In
        </span>
      </p>
    </div>
  );
};

export default EmailSignUp;
