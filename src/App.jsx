import React, { useState, Suspense, lazy, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeContext } from "./context/DarkModeContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./navigation/NavBar";
import BottomNav from "./navigation/TabNavBar/BottomNav";
import Footer from "./pages/CardToBeeFooter";
import PrivateRoute from "./utils/PrivateRoute";
import AuthModalController from "./authProviders/EmailAuth/AuthModalController";
import BeeLoader from "./pages/BeeLoader";
import "./styles/CardToBeeStyles.css";
import cardToBeeLogo from "../public/assets/cardtobee_logo.png";

// Lazy loaded components
const Home = lazy(() => import("./pages/Home/Home"));
const CreateCardToBee = lazy(() =>
  import("./cardToBee/CreateCardToBee/CreateCardToBee")
);
const DisplayCard = lazy(() =>
  import("./cardToBee/DisplayCardToBee/DisplayCardToBee")
);
const TermsAgreement = lazy(() => import("./pages/Legal/TermsAgreement"));
const TermsOfService = lazy(() => import("./pages/Legal/CardsToBeeTerms"));
const PrivacyPolicy = lazy(() => import("./pages/Legal/CardToBeePrivcay"));
const CookiesPolicy = lazy(() => import("./pages/Legal/CoockiesPolicy"));
const CardToBeeList = lazy(() => import("./cardToBee/ListCardToBee"));
const Profile = lazy(() => import("./cardToBee/CardToBeeProfile/UserProfile"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const ContactUs = lazy(() => import("./pages/ContactUs/ContactUs"));
const AboutCardToBee = lazy(() => import("./pages/AboutCardToBee"));
const Settings = lazy(() => import("./pages/Settings/Settings"));

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { user, loading } = useAuth();

  const handleShowModal = (isSignIn = true) => {
    setIsSignIn(isSignIn);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="loader-container">
        <BeeLoader />
      </div>
    );
  }

  return (
    <Router>
      <div className={`app-wrapper ${darkMode ? "dark-mode" : ""}`}>
        <Navbar handleShowModal={handleShowModal} logo={cardToBeeLogo} />
        <main className="main-content">
          <Suspense fallback={<BeeLoader />}>
            <Routes>
              <Route
                path="/"
                element={<Home handleShowModal={handleShowModal} />}
              />
              <Route
                path="/card-to-bee-list"
                element={<CardToBeeList handleShowModal={handleShowModal} />}
              />
              <Route
                path="/card-to-bee"
                element={
                  <PrivateRoute>
                    <CreateCardToBee />
                  </PrivateRoute>
                }
              />
              <Route path="/card-to-bee/:id" element={<DisplayCard />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/terms-agreement" element={<TermsAgreement />} />
              <Route path="/cookies" element={<CookiesPolicy />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/about" element={<AboutCardToBee />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/user-profile/:id" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav handleShowModal={handleShowModal} />
        <Footer />
        <button
          className="dark-mode-toggle bee-btn"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <AuthModalController
        show={showModal}
        isSignIn={isSignIn}
        handleClose={handleCloseModal}
        setIsSignIn={setIsSignIn}
      />
    </Router>
  );
}

export default App;
