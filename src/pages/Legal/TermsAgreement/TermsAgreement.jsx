import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "./TermsAgreement.css";

const TermsAgreement = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  const handleAgreement = async () => {
    if (!agreed) {
      toast.error("You must agree to the terms to proceed.");
      return;
    }

    try {
      // Update user's agreedToTerms status in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { agreedToTerms: true }, { merge: true });

      toast.success("Thank you for agreeing to the terms.");
      navigate("/profile"); // Redirect to profile after agreeing
    } catch (error) {
      console.error("Error updating terms agreement:", error);
      toast.error("Failed to update terms agreement. Please try again.");
    }
  };

  return (
    <div className="terms-agreement-container">
      <h2>Terms of Service and Privacy Policy</h2>
      <p>
        Please read our <a href="/terms">Terms of Service</a> and{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>
      <div className="terms-checkbox">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
        />
        <label htmlFor="terms">
          I agree to the Terms of Service and Privacy Policy
        </label>
      </div>
      <button className="agree-button" onClick={handleAgreement}>
        Agree and Continue
      </button>
    </div>
  );
};

export default TermsAgreement;
