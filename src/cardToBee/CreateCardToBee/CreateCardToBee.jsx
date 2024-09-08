import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import businessCategories from "../Utilities/businessCategories";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import "./CreateCardToBee.css";

const CreateCardToBee = () => {
  const { user } = useAuth(); // Auth context to get the logged-in user
  const [formData, setFormData] = useState({
    businessCategory: "",
    personalInfo: {
      firstName: "",
      secondName: "",
      thirdName: "",
      lastName: "",
      firstJobTitle: "",
      secondJobTitle: "",
      companyName: "",
      logoUrl: "",
      imageUrl: "",
    },
    contactInfo: {
      email: user?.email || "",
      secondaryEmail: "",
      phone: "",
      website: "",
      whatsappLink: "",
    },
    address: {
      firstStreet: "",
      secondStreet: "",
      city: "",
      state: "",
      country: "Kuwait",
    },
    socialMedia: {
      linkedin: "",
      twitter: "",
      instagram: "",
    },
    professionalSummary: {
      bio: "",
      skills: [],
    },
    cardDesign: {
      template: "default",
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
    },
  });

  const [loading, setLoading] = useState(false);
  const [cardExists, setCardExists] = useState(false);
  const navigate = useNavigate();

  // Check if the user already has a CardToBee
  useEffect(() => {
    const checkIfCardExists = async () => {
      if (user) {
        try {
          const cardRef = doc(db, "businessCards", user.uid);
          const cardSnap = await getDoc(cardRef);

          if (cardSnap.exists()) {
            setCardExists(true);
            toast.error("You already have a CardToBee.");
            navigate(`/card-2-business/${user.uid}`); // Redirect if card exists
          }
        } catch (error) {
          console.error("Error checking business card:", error);
          toast.error("Failed to check if card exists.");
        }
      }
    };

    checkIfCardExists();
  }, [user, navigate]);

  // Handle top-level input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle nested personal info input changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: { ...prevData.personalInfo, [name]: value },
    }));
  };

  // Handle phone number change
  const handlePhoneChange = (phone) => {
    setFormData((prevData) => ({
      ...prevData,
      contactInfo: { ...prevData.contactInfo, phone },
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const {
      personalInfo: { firstName, lastName },
      contactInfo: { email, phone },
      businessCategory,
    } = formData;

    if (!firstName || !lastName || !email || !phone || !businessCategory) {
      toast.error("Please fill all the required fields.");
      return false;
    }

    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
      toast.error("Please enter a valid phone number.");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || cardExists) return;

    setLoading(true);
    try {
      const cardRef = doc(db, "businessCards", user.uid);
      await setDoc(cardRef, {
        ownerId: user.uid,
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      toast.success("CardToBee created successfully!");
      navigate(`/card-2-business/${user.uid}`);
    } catch (error) {
      console.error("Error saving business card:", error);
      toast.error("Failed to save your card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="CreateCardToBee-container">
      <ToastContainer />
      <h2>Create Your CardToBee</h2>

      <form onSubmit={handleSubmit}>
        {/* Personal Info Section */}
        <h5>Personal Information</h5>
        <input
          type="text"
          name="firstName"
          value={formData.personalInfo.firstName}
          onChange={handlePersonalInfoChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="secondName"
          value={formData.personalInfo.secondName}
          onChange={handlePersonalInfoChange}
          placeholder="Second Name"
        />
        <input
          type="text"
          name="thirdName"
          value={formData.personalInfo.thirdName}
          onChange={handlePersonalInfoChange}
          placeholder="Third Name"
        />
        <input
          type="text"
          name="lastName"
          value={formData.personalInfo.lastName}
          onChange={handlePersonalInfoChange}
          placeholder="Last Name"
          required
        />
        <PhoneInput
          country={"kw"}
          value={formData.contactInfo.phone}
          onChange={handlePhoneChange}
          placeholder="Phone Number"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.contactInfo.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />

        {/* Business Info Section */}
        <h5>Business Information</h5>
        <select
          name="businessCategory"
          value={formData.businessCategory}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Business Category</option>
          {businessCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="companyName"
          value={formData.personalInfo.companyName}
          onChange={handlePersonalInfoChange}
          placeholder="Company Name"
          required
        />

        <button type="submit" className="retro-button">
          Create Business Card
        </button>
      </form>
    </div>
  );
};

export default CreateCardToBee;
