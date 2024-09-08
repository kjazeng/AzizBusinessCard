const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");

admin.initializeApp();
const db = admin.firestore();

// Your existing function: deleteInactiveUsers
exports.deleteInactiveUsers = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const usersToDelete = await db
      .collection("users")
      .where("lastActive", "<", threeMonthsAgo)
      .get();

    const batch = db.batch();
    usersToDelete.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${usersToDelete.size} inactive users`);
    return null;
  });

// Add the new deleteOldNotes function here
exports.deleteOldNotes = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context) => {
    const cutoff = moment().subtract(24, "hours").toDate();
    const notesRef = db.collection("shortNotes");
    const oldNotesQuery = notesRef.where("timestamp", "<=", cutoff);

    const batch = db.batch();
    const oldNotesSnapshot = await oldNotesQuery.get();

    oldNotesSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("Old notes deleted successfully");
    return null;
  });

// Other existing functions below, like scheduledFunctionCrontab
