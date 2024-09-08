import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, updateDoc, addDoc, collection } from 'firebase/firestore';

// Generate WhatsApp Link
export const generateWhatsappLink = (phone, country = 'KW') => {
    const countryCode = country === 'KW' ? '965' : ''; // Update with more country codes if needed
    return phone ? `https://wa.me/${countryCode}${phone.replace(/\D/g, '')}` : '';
};

// Upload Image to Firebase Storage
export const uploadImageToStorage = async (storage, image, name) => {
    const imageRef = ref(storage, `business-cards/${Date.now()}-${name}.png`);
    await uploadString(imageRef, image, 'data_url');
    return await getDownloadURL(imageRef);
};

// Save or Update Card in Firestore
export const saveCardToFirestore = async (db, cardData, id) => {
    if (id) {
        const docRef = doc(db, 'businessCards', id);
        await updateDoc(docRef, cardData);
        return docRef.id;
    } else {
        const collectionRef = collection(db, 'businessCards');
        const docRef = await addDoc(collectionRef, cardData);
        return docRef.id;
    }
};
