import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";

const BeeTaggedButton = ({ cardId }) => {
  const { user } = useAuth();

  const handleTagCard = async () => {
    if (!cardId) {
      console.error("No card ID provided for tagging.");
      return;
    }

    const tagId = `tag-${user.uid}-${cardId}`;
    try {
      await setDoc(doc(db, "beeTagged", tagId), {
        userId: user.uid,
        cardId: cardId,
        taggedAt: serverTimestamp(),
      });
      console.log("Business card tagged successfully.");
    } catch (error) {
      console.error("Error tagging business card:", error);
    }
  };

  return <button onClick={handleTagCard}>Tag Card</button>;
};

export default BeeTaggedButton;
