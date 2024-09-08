// UserProfile.jsx
import React, { useState, useEffect, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";
import UserProfileEditModal from "../UserProfileEditModal";
import ProfileProgress from "../ProfileProgress";
import BeeLoader from "../../../pages/BeeLoader";
import { toast } from "react-toastify";
import { useSwipeable } from "react-swipeable";
import "./UserProfile.css";

const UserProfile = () => {
  const { user } = useAuth();
  const { id: profileId } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [shortNote, setShortNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!profileId) {
      const currentUserId = user ? user.uid : null;
      if (!currentUserId) {
        toast.error("Please sign in to view your profile.");
        navigate("/");
        return;
      }
      setProfileData(user);
      setLoading(false);
      return;
    }

    try {
      const profileRef = doc(db, "users", profileId);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setProfileData(data);
        setShortNote(data.shortNote || "");
      } else {
        toast.warn("Profile not found.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [profileId, navigate, user]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const isOwnProfile = user && (user.uid === profileId || !profileId);

  const handleSaveNote = async () => {
    if (!isOwnProfile) {
      toast.error("You can only edit your own profile.");
      return;
    }

    setIsSavingNote(true);
    try {
      const profileRef = doc(db, "users", user.uid);
      await updateDoc(profileRef, { shortNote });
      toast.success("Note saved successfully!");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note. Please try again.");
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData((prevData) => ({ ...prevData, ...updatedData }));
  };

  const handlers = useSwipeable({
    onSwipedRight: () => {
      navigate(-1);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  if (loading) return <BeeLoader />;
  if (!profileData)
    return (
      <div className="no-profile bee-card">No profile data available.</div>
    );

  return (
    <div {...handlers} className="profile-container bee-card">
      <div className="profile-header">
        <img
          src="/assets/cardtobee_logo.png"
          alt="CardToBee Logo"
          className="cardtobee-logo float-animation"
        />
        <h2>{isOwnProfile ? "My Profile" : `${profileData.name}'s Profile`}</h2>
      </div>

      <div className="hexagon-container">
        <div className="hexagon profile-pic-hex">
          <img
            src={profileData.photoURL || "/assets/default_profile.png"}
            alt="Profile"
            className="profile-pic"
          />
        </div>
      </div>

      <ProfileProgress profileData={profileData} />

      <div className="profile-details">
        <div className="name-and-badge">
          <h3>{profileData.name}</h3>
          {profileData.badgeUrl && (
            <img src={profileData.badgeUrl} alt="Badge" className="badge" />
          )}
        </div>

        <section className="public-info">
          <h4>Public Information</h4>
          <div className="info-list">
            <InfoItem label="Business Name" value={profileData.businessName} />
            <InfoItem label="Job Title" value={profileData.jobTitle} />
            <InfoItem label="Country" value={profileData.country} />
            {profileData.website && (
              <InfoItem
                label="Website"
                value={
                  <a
                    href={profileData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {profileData.website}
                  </a>
                }
              />
            )}
            <InfoItem
              label="Email"
              value={
                <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
              }
            />
            <InfoItem
              label="Phone"
              value={
                <a href={`tel:${profileData.phone}`}>{profileData.phone}</a>
              }
            />
          </div>
        </section>

        {isOwnProfile && (
          <section className="private-info">
            <h4>Private Information</h4>
            <div className="info-list">
              <InfoItem label="Date of Birth" value={profileData.dateOfBirth} />
              <InfoItem label="Address" value={profileData.address} />
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="edit-profile-button bee-btn"
            >
              Edit Profile
            </button>

            <div className="short-note-section">
              <textarea
                className="short-note-textarea"
                placeholder="Write a short note..."
                value={shortNote}
                onChange={(e) => setShortNote(e.target.value)}
              />
              <button
                className="save-note-button bee-btn"
                onClick={handleSaveNote}
                disabled={isSavingNote}
              >
                {isSavingNote ? "Saving..." : "Save Note"}
              </button>
            </div>
          </section>
        )}
      </div>

      {isEditModalOpen && (
        <UserProfileEditModal
          profileData={profileData}
          closeModal={() => setIsEditModalOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      <div className="swipe-overlay">
        <div className="swipe-right">⬅ Swipe to go back</div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="info-item">
    <strong>{label}:</strong>
    <span>{value}</span>
  </div>
);

export default UserProfile;
