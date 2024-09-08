// CardToBeeList.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  doc,
  setDoc,
  deleteDoc,
  where,
} from "firebase/firestore";
import { db, analytics } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { useAuth } from "../../context/AuthContext";
import logo from "/assets/cardtobee_logo.png";
import beeIcon from "/assets/cardtobee_logo.png";
import { toast } from "react-toastify";
import businessCategories from "../Utilities/businessCategories";
import "react-toastify/dist/ReactToastify.css";
import BeeLoader from "../../pages/BeeLoader";
import "./ListCardToBee.css";

function CardToBeeList({ handleShowModal }) {
  const [businessCards, setBusinessCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [beeTagging, setBeeTagging] = useState(new Map());
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [favoritedCards, setFavoritedCards] = useState(new Map());

  useEffect(() => {
    const fetchBusinessCards = async () => {
      setLoading(true);
      try {
        const cardsQuery = query(collection(db, "businessCards"));
        const querySnapshot = await getDocs(cardsQuery);
        const cards = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBusinessCards(cards);
        setFilteredCards(cards);
        logEvent(analytics, "business_cards_loaded", { count: cards.length });
      } catch (error) {
        toast.error("Failed to load business cards. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchFavoritedCards = async () => {
      if (user) {
        const likedCardsRef = collection(db, `users/${user.uid}/likedCards`);
        const likedCardsSnapshot = await getDocs(likedCardsRef);
        const likedCardsMap = new Map();
        likedCardsSnapshot.forEach((doc) => {
          likedCardsMap.set(doc.id, true);
        });
        setFavoritedCards(likedCardsMap);
      }
    };

    fetchBusinessCards();
    if (user) fetchFavoritedCards();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchKeyword(keyword);
    applyFilters(keyword, selectedCategories);
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    applyFilters(searchKeyword, updatedCategories);
  };

  const applyFilters = (keyword, categories) => {
    let filtered = businessCards;

    if (keyword) {
      filtered = filtered.filter((card) =>
        ["name", "title", "email", "phone", "businessCategory"].some((key) =>
          card[key]?.toLowerCase().includes(keyword)
        )
      );
    }

    if (categories.length > 0) {
      filtered = filtered.filter((card) =>
        categories.includes(card.businessCategory)
      );
    }

    setFilteredCards(filtered);
  };

  const clearFilters = () => {
    setSearchKeyword("");
    setSelectedCategories([]);
    setFilteredCards(businessCards);
  };

  const handleViewCard = (cardId) => {
    navigate(`/card-to-bee/${cardId}`);
  };

  const getFavoriteCount = async (cardId) => {
    const likedCardsRef = collection(db, `users/${user.uid}/likedCards`);
    const likedCardsSnapshot = await getDocs(
      query(likedCardsRef, where("cardId", "==", cardId))
    );
    return likedCardsSnapshot.size;
  };

  const handleBeeTag = async (cardId) => {
    if (!user) {
      handleShowModal();
      toast.warn("Please log in to BeeTag this card.");
      return;
    }

    setBeeTagging((prevState) => new Map(prevState.set(cardId, true)));

    const favoriteDocRef = doc(db, `users/${user.uid}/likedCards`, cardId);
    const cardDocRef = doc(db, "businessCards", cardId);

    try {
      if (favoritedCards.has(cardId)) {
        await deleteDoc(favoriteDocRef);
        favoritedCards.delete(cardId);
        setFavoritedCards(new Map(favoritedCards));
        toast.success("Card UnBeeTagged.");
      } else {
        await setDoc(favoriteDocRef, {
          cardId,
          timestamp: new Date(),
        });
        favoritedCards.set(cardId, true);
        setFavoritedCards(new Map(favoritedCards));
        toast.success("Card BeeTagged!");
      }

      const realFavoriteCount = await getFavoriteCount(cardId);
      await setDoc(
        cardDocRef,
        { favoriteCount: realFavoriteCount },
        { merge: true }
      );

      setBusinessCards((prevCards) =>
        prevCards.map((card) =>
          card.id === cardId
            ? { ...card, favoriteCount: realFavoriteCount }
            : card
        )
      );
    } catch (error) {
      console.error("Error BeeTagging card:", error);
      toast.error("Failed to BeeTag card. Please try again.");
    } finally {
      setBeeTagging((prevState) => new Map(prevState.set(cardId, false)));
    }
  };

  return (
    <div className="cardtobee-list-container">
      <div className="cardtobee-header">
        <h1 className="cardtobee-title">
          Find CardToBee
          <img src={logo} alt="CardToBee Logo" className="cardtobee-logo" />
        </h1>
      </div>

      {loading ? (
        <BeeLoader />
      ) : (
        <>
          <div className="cardtobee-search-filter">
            <input
              type="text"
              placeholder="Search by any keyword"
              value={searchKeyword}
              onChange={handleSearch}
              className="cardtobee-search-input"
            />
            <div className="cardtobee-category-dropdown" ref={dropdownRef}>
              <button
                className="cardtobee-category-button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                Categories
              </button>
              {showCategoryDropdown && (
                <div className="cardtobee-category-menu">
                  {businessCategories.map((category) => (
                    <label key={category} className="cardtobee-category-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              )}
            </div>
            <button className="cardtobee-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          <div className="cardtobee-selected-categories">
            {selectedCategories.map((category) => (
              <span key={category} className="cardtobee-category-tag">
                {category}
                <button
                  onClick={() => handleCategoryChange(category)}
                  className="cardtobee-category-remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <p className="cardtobee-results-count">
            {filteredCards.length} cards found
          </p>

          <div className="cardtobee-grid">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <div key={card.id} className="cardtobee-card-wrapper">
                  <div
                    className="cardtobee-card"
                    onClick={() => handleViewCard(card.id)}
                  >
                    <div className="cardtobee-card-content">
                      <div className="cardtobee-card-text">
                        <h3 className="cardtobee-card-name">{card.name}</h3>
                        <p className="cardtobee-card-title">{card.title}</p>
                        <p className="cardtobee-card-category">
                          {card.businessCategory}
                        </p>
                        <p className="cardtobee-card-phone">{card.phone}</p>
                        <p className="cardtobee-card-email">{card.email}</p>
                        <p className="cardtobee-card-address">{card.address}</p>
                      </div>
                      <div className="cardtobee-card-image">
                        <img
                          src={card.imageUrl || logo}
                          alt="Business Card"
                          className="cardtobee-image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="cardtobee-card-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBeeTag(card.id);
                      }}
                      className={`cardtobee-beetag-button ${
                        favoritedCards.get(card.id) ? "favorited" : ""
                      }`}
                      disabled={beeTagging.get(card.id)}
                    >
                      {beeTagging.get(card.id) ? (
                        <div className="cardtobee-spinner"></div>
                      ) : (
                        <img
                          src={beeIcon}
                          alt="BeeTag"
                          className="cardtobee-beetag-icon"
                        />
                      )}
                    </button>
                    <p className="cardtobee-favorite-count">
                      {card.favoriteCount || 0} Bzzz
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="cardtobee-no-results">No business cards found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CardToBeeList;
