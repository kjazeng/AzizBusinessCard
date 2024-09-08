import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProfileSetupPage.css";

const ProfileSetupPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    businessServices: "",
    companySize: "",
    openingHours: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    bio: "",
    skills: "",
    logo: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const profileRef = doc(db, "users", user.uid);
      await setDoc(profileRef, formData, { merge: true });
      toast.success("Profile setup complete!");
      navigate("/profile");
    } catch (error) {
      console.error("Error setting up profile:", error);
      toast.error("Failed to set up profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <h2>Complete Your Profile</h2>
      <p>Fill out the sections below to complete your profile.</p>

      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="retro-input"
        />
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="retro-input"
        />
      </div>

      <div className="form-group">
        <label>Phone *</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="retro-input"
        />
      </div>

      {/* Other input fields (optional) */}

      <button
        onClick={handleSubmit}
        className="retro-button"
        disabled={loading}
      >
        {loading ? "Saving..." : "Complete Profile"}
      </button>
    </div>
  );
};

export default ProfileSetupPage;
