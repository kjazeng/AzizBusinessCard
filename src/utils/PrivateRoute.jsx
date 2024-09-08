import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import BeeLoader from "../pages/BeeLoader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [agreedToTerms, setAgreedToTerms] = useState(null);

  useEffect(() => {
    const checkTerms = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().agreedToTerms) {
          setAgreedToTerms(true);
        } else {
          setAgreedToTerms(false);
        }
      }
    };
    if (user) checkTerms();
  }, [user]);

  if (loading || agreedToTerms === null) return <BeeLoader />;

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  if (!agreedToTerms) {
    return <Navigate to="/terms-agreement" />;
  }

  return children;
};

export default PrivateRoute;
