import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";

const BeeNotes = () => {
  const { user } = useAuth();
  const [noteContent, setNoteContent] = useState("");

  const handleSaveNote = async () => {
    if (!noteContent) {
      console.error("Note content is empty.");
      return;
    }

    const noteId = `note-${Date.now()}`;
    try {
      await setDoc(doc(db, "beeNotes", noteId), {
        ownerId: user.uid,
        content: noteContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNoteContent("");
      console.log("Note saved successfully.");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  return (
    <div>
      <textarea
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Write your note..."
      />
      <button onClick={handleSaveNote}>Save Note</button>
    </div>
  );
};

export default BeeNotes;
