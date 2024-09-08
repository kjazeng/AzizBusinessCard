// DisplayCardToBee.jsx

import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  getDocs,
  limit,
  orderBy,
  where,
} from "firebase/firestore";
import { db, analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";
import html2canvas from "html2canvas";
import { QRCode } from "react-qrcode-logo";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import beeIcon from "/assets/cardtobee_logo.png";
import BeeLoader from "../../pages/BeeLoader";
import {
  FaSave,
  FaShare,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import "./DisplayCardToBee.css";

function DisplayCardToBee() {
  const { id } = useParams();
  const [cardData, setCardData] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const cardRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const docRef = doc(db, "businessCards", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const currentCardData = { ...docSnap.data(), id: docSnap.id };
          if (!currentCardData.uid) {
            console.warn("Card data is missing uid", currentCardData);
            currentCardData.uid = "unknown";
          }
          setCardData(currentCardData);
          if (user) {
            try {
              const favoriteDocRef = doc(
                db,
                `users/${user.uid}/likedCards`,
                id
              );
              const favoriteDocSnap = await getDoc(favoriteDocRef);
              setIsFavorited(favoriteDocSnap.exists());
            } catch (error) {
              console.error("Error fetching favorite status:", error);
            }
          }
          logEvent(analytics, "view_business_card", { id });
        } else {
          console.error("No card data found for id:", id);
          toast.error("No card data found.");
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
        toast.error("Error fetching card data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, [id, user]);

  const handleSaveAsPNG = async () => {
    if (!user) {
      toast.warn("Please log in to save the card.");
      return;
    }
    if (cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        const link = document.createElement("a");
        link.download = `${cardData.businessName}-card-to-bee.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        logEvent(analytics, "save_business_card_as_png", { id });
        toast.success("Business card saved as PNG.");
      } catch (error) {
        console.error("Error saving PNG:", error);
        toast.error("Error saving PNG. Please try again.");
      }
    }
  };

  const handleShare = async () => {
    if (!user) {
      toast.warn("Please log in to share the card.");
      return;
    }
    if (navigator.share && cardRef.current) {
      try {
        const canvas = await html2canvas(cardRef.current);
        canvas.toBlob((blob) => {
          const file = new File(
            [blob],
            `${cardData.businessName}-card-to-bee.png`,
            {
              type: "image/png",
            }
          );
          navigator
            .share({
              title: `${cardData.businessName}'s Business Card`,
              text: "Check out this business card!",
              files: [file],
            })
            .then(() => {
              logEvent(analytics, "share_business_card", { id });
              toast.success("Card shared successfully.");
            })
            .catch((error) => {
              console.error("Error sharing card:", error);
              toast.error("Error sharing card. Please try again.");
            });
        });
      } catch (error) {
        console.error("Error sharing card:", error);
        toast.error("Error sharing card. Please try again.");
      }
    } else {
      toast.warn("Web Share API is not supported in your browser.");
    }
  };

  const handleBeeTag = async () => {
    if (!user) {
      toast.warn("Please log in to save this card.");
      return;
    }
    try {
      const favoriteDocRef = doc(db, `users/${user.uid}/likedCards`, id);
      if (isFavorited) {
        await deleteDoc(favoriteDocRef);
        setIsFavorited(false);
        toast.success("Card removed from your favorites.");
      } else {
        await setDoc(favoriteDocRef, {
          cardRef: doc(db, "businessCards", id),
          timestamp: serverTimestamp(),
        });
        setIsFavorited(true);
        toast.success("Card added to your favorites!");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status. Please try again.");
    }
  };

  const handleCardTap = () => {
    setIsFlipped(!isFlipped);
  };

  const fetchNextCard = async () => {
    try {
      const cardsRef = collection(db, "businessCards");
      let q;

      if (cardData && cardData.timestamp) {
        q = query(
          cardsRef,
          orderBy("timestamp"),
          where("timestamp", ">", cardData.timestamp),
          limit(1)
        );
      } else {
        q = query(cardsRef, orderBy("timestamp"), limit(1));
      }

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const nextCardData = querySnapshot.docs[0].data();
        const nextCardId = querySnapshot.docs[0].id;
        if (nextCardId !== id) {
          navigate(`/card-to-bee/${nextCardId}`);
        } else {
          // If we get the same card, try to fetch the next one
          fetchNextCard();
        }
      } else {
        // If no next card, wrap around to the first card
        const firstCardQuery = query(cardsRef, orderBy("timestamp"), limit(1));
        const firstCardSnapshot = await getDocs(firstCardQuery);
        if (!firstCardSnapshot.empty) {
          const firstCardId = firstCardSnapshot.docs[0].id;
          if (firstCardId !== id) {
            navigate(`/card-to-bee/${firstCardId}`);
          } else {
            toast.info("No more cards available.");
          }
        } else {
          toast.info("No cards available.");
        }
      }
    } catch (error) {
      console.error("Error fetching next card:", error);
      toast.error("Error fetching next card. Please try again.");
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      console.log("Swiped left");
      setSwipeDirection("left");
      setTimeout(() => {
        if (cardData && cardData.uid && cardData.uid !== "unknown") {
          navigate(`/user-profile/${cardData.uid}`);
        } else {
          console.warn("User profile not available for card:", cardData);
          toast.error("User profile not available");
        }
      }, 300);
    },
    onSwipedRight: () => {
      console.log("Swiped right");
      setSwipeDirection("right");
      setTimeout(() => {
        fetchNextCard();
      }, 300);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    if (swipeDirection) {
      const timer = setTimeout(() => setSwipeDirection(null), 300);
      return () => clearTimeout(timer);
    }
  }, [swipeDirection]);

  if (loading) return <BeeLoader />;
  if (!cardData) return <p>No card data found.</p>;

  return (
    <div
      {...handlers}
      className={`display-card-container ${
        swipeDirection ? `swipe-${swipeDirection}` : ""
      }`}
    >
      <div className="honeycomb-background"></div>
      <div
        className={`card ${isFlipped ? "flipped" : ""}`}
        ref={cardRef}
        onClick={handleCardTap}
      >
        <div className="card-inner">
          <div className="card-front">
            <div className="card-content">
              <div className="card-info">
                <h2>{cardData.businessName}</h2>
                <p className="title">{cardData.jobTitle}</p>
                <p>
                  <FaEnvelope /> {cardData.email}
                </p>
                <p>
                  <FaPhone /> {cardData.phone}
                </p>
                {cardData.website && (
                  <p>
                    <FaGlobe /> {cardData.website}
                  </p>
                )}
                <p>
                  <FaMapMarkerAlt /> {cardData.country}
                </p>
              </div>
              <div className="card-image-container">
                <img
                  src={cardData.imageUrl || beeIcon}
                  alt={cardData.businessName}
                  className="card-image"
                />
              </div>
            </div>
          </div>
          <div className="card-back">
            <div className="social-links">
              {cardData.instagram && (
                <a
                  href={`https://instagram.com/${cardData.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram /> {cardData.instagram}
                </a>
              )}
              {cardData.twitter && (
                <a
                  href={`https://twitter.com/${cardData.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter /> {cardData.twitter}
                </a>
              )}
              {cardData.whatsapp && (
                <a
                  href={`https://wa.me/${cardData.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp /> WhatsApp
                </a>
              )}
            </div>
            <div className="qr-code">
              <QRCode
                value={window.location.href}
                size={80}
                logoImage={beeIcon}
                logoWidth={20}
                logoHeight={20}
                eyeRadius={5}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-actions">
        <button onClick={handleSaveAsPNG} disabled={!user}>
          <FaSave /> Save
        </button>
        <button onClick={handleShare} disabled={!user}>
          <FaShare /> Share
        </button>
        <button
          onClick={handleBeeTag}
          disabled={!user}
          className={isFavorited ? "favorited" : ""}
        >
          <FaStar /> {isFavorited ? "Unfavorite" : "Favorite"}
        </button>
      </div>
      <div className="swipe-overlay">
        <div className="swipe-left">View Profile</div>
        <div className="swipe-right">Next Card</div>
      </div>
    </div>
  );
}

export default DisplayCardToBee;
