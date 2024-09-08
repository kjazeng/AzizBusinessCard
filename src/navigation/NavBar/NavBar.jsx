// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "/assets/cardtobee_logo.png";
import BeeLoader from "../../pages/BeeLoader";
import "./Navbar.css";

function Navbar({ handleShowModal }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasCardToBee, setHasCardToBee] = useState(null);
  const [loadingCardCheck, setLoadingCardCheck] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      toast.success("Successfully logged out.");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    }
    closeMenu();
  };

  useEffect(() => {
    const checkIfCardExists = async () => {
      if (user) {
        try {
          const docRef = doc(db, "businessCards", user.uid);
          const docSnap = await getDoc(docRef);
          setHasCardToBee(docSnap.exists());
        } catch (error) {
          toast.error("Failed to check user data.");
        } finally {
          setLoadingCardCheck(false);
        }
      } else {
        setLoadingCardCheck(false);
      }
    };

    checkIfCardExists();
  }, [user]);

  useEffect(() => {
    closeMenu();
  }, [location]);

  const renderCardLink = () => {
    if (loadingCardCheck) {
      return <BeeLoader />;
    } else if (user && hasCardToBee) {
      return (
        <Link
          to={`/card-to-bee/${user.uid}`}
          onClick={closeMenu}
          className="nav-link"
        >
          View My Bee
        </Link>
      );
    } else {
      return (
        <Link
          to={user ? "/card-2-business" : "#"}
          onClick={() => {
            if (!user) {
              handleShowModal(true);
              toast.warn("Please log in to create a Bee.");
            }
            closeMenu();
          }}
          className="nav-link"
        >
          Create Bee
        </Link>
      );
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="CardToBee Logo" className="logo-style" />
          <span className="brand-text">CardToBee</span>
        </Link>

        <button
          onClick={toggleMenu}
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`menu ${menuOpen ? "open" : ""}`}>
          <ul className="menu-items">
            {user ? (
              <>
                <li>
                  <Link to="/profile" onClick={closeMenu} className="nav-link">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/card-to-bee-list"
                    onClick={closeMenu}
                    className="nav-link"
                  >
                    Bees
                  </Link>
                </li>
                <li>{renderCardLink()}</li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="nav-link logout-btn"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => {
                      handleShowModal(true);
                      closeMenu();
                    }}
                    className="nav-link login-btn"
                  >
                    Log In
                  </button>
                </li>
                <li>
                  <Link to="/" onClick={closeMenu} className="nav-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/card-to-bee-list"
                    onClick={closeMenu}
                    className="nav-link"
                  >
                    Bees
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={closeMenu} className="nav-link">
                    Settings
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
