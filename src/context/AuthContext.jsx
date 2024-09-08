// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          if (userData.accountStatus === "deleted") {
            await signOut(auth);
            toast.error("Your account has been deleted. Contact support.");
          } else if (userData.accountStatus === "suspended") {
            await signOut(auth);
            toast.error("Your account is suspended. Contact support.");
          } else {
            setUser({ ...currentUser, ...userData });
          }
        } else {
          await setDoc(userDocRef, {
            email: currentUser.email,
            firstName: "",
            lastName: "",
            agreedToTerms: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            accountStatus: "active",
          });
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
