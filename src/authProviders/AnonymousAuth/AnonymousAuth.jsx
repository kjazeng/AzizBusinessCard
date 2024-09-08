import React, { useState } from "react";
import { getAuth, signInAnonymously } from "firebase/auth";
import { toast } from "react-toastify";
import "./AnonymousAuth.css";

const AnonymousAuth = () => {
  const [loading, setLoading] = useState(false); // Track loading state

  const handleAnonymousSignIn = async () => {
    if (loading) return; // Prevent multiple submissions during loading
    setLoading(true);
    try {
      const auth = getAuth();
      await signInAnonymously(auth);
      toast.success("Signed in as Guest!");
    } catch (error) {
      console.error("Error during anonymous sign-in:", error);
      toast.error(`Failed to sign in: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  return (
    <div>
      <button
        onClick={handleAnonymousSignIn}
        className="retro-button"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Continue as Guest"}
      </button>
    </div>
  );
};

export default AnonymousAuth;
