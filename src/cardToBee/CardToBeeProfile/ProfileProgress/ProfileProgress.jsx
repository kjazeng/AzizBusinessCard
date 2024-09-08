import React, { useEffect, useState } from "react";
import "./ProfileProgress.css";

const ProfileProgress = ({ profileData }) => {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [incompleteFields, setIncompleteFields] = useState([]);

  useEffect(() => {
    calculateCompletion(profileData);
  }, [profileData]);

  const calculateCompletion = (data) => {
    let totalPoints = 0;
    let completedPoints = 0;
    let incompleteSections = [];

    // Basic Information (30%)
    totalPoints += 30;
    if (data.name) completedPoints += 10;
    else incompleteSections.push("Name");
    if (data.email) completedPoints += 10;
    else incompleteSections.push("Email");
    if (data.phone) completedPoints += 10;
    else incompleteSections.push("Phone");

    // Business Information (20%)
    totalPoints += 20;
    if (data.businessServices) completedPoints += 10;
    else incompleteSections.push("Business Services");
    if (data.companySize) completedPoints += 5;
    else incompleteSections.push("Company Size");
    if (data.openingHours) completedPoints += 5;
    else incompleteSections.push("Opening Hours");

    // Social Media Links (20%)
    totalPoints += 20;
    const socialLinks = [
      "instagram",
      "twitter",
      "linkedin",
      "facebook",
      "whatsapp",
    ];
    socialLinks.forEach((link) => {
      if (data[link]) completedPoints += 4;
      else
        incompleteSections.push(
          `${link.charAt(0).toUpperCase() + link.slice(1)} Handle`
        );
    });

    // Other Features (20%)
    totalPoints += 20;
    if (data.bio) completedPoints += 10;
    else incompleteSections.push("Bio");
    if (data.skills) completedPoints += 10;
    else incompleteSections.push("Tags/Skills");

    // Other Info (10%)
    totalPoints += 10;
    if (data.logo) completedPoints += 5;
    else incompleteSections.push("Business Logo");
    if (data.address) completedPoints += 5;
    else incompleteSections.push("Address");

    // Calculate the completion percentage
    const completion = (completedPoints / totalPoints) * 100;
    setCompletionPercentage(Math.round(completion));
    setIncompleteFields(incompleteSections);
  };

  return (
    <div className="profile-progress-container">
      <h3>Profile Completion</h3>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      <p>{completionPercentage}% complete</p>

      {incompleteFields.length > 0 && (
        <div className="incomplete-sections">
          <p>Incomplete sections:</p>
          <ul>
            {incompleteFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
          <p>Complete these sections to reach 100%!</p>
        </div>
      )}
    </div>
  );
};

export default ProfileProgress;
