import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase"; // Adjust the import based on your project structure
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserProfileEditModal.css"; // Ensure the CSS file is correctly linked

const UserProfileEditModal = ({ profileData, closeModal }) => {
  const [formData, setFormData] = useState({ ...profileData });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError("");

    try {
      const profileRef = doc(db, "users", formData.id); // Assuming user data is in "users" collection
      await updateDoc(profileRef, formData); // Update the user profile with the form data
      toast.success("Profile updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
      setError("Failed to update profile. Please try again.");
    }

    setLoading(false);
  };

  const handleClose = () => {
    closeModal();
    navigate("/profile"); // Navigate back to profile page
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={handleClose} className="close-button">
          &times;
        </button>
        <h5 className="mt-3">Edit Profile</h5>
        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          placeholder="Name"
          className="retro-input"
        />

        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          placeholder="Title"
          className="retro-input"
        />

        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          placeholder="Email"
          className="retro-input"
        />

        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          placeholder="Phone"
          className="retro-input"
        />

        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleInputChange}
          placeholder="Address"
          className="retro-input"
        />

        <input
          type="text"
          name="website"
          value={formData.website || ""}
          onChange={handleInputChange}
          placeholder="Website"
          className="retro-input"
        />

        <div className="modal-actions">
          <button onClick={handleSaveChanges} className="retro-button">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileEditModal;
