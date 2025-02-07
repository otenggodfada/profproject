const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Update user book
app.put("/update-user-book/:userId/:bookId", async (req, res) => {
    const { userId, bookId } = req.params;
    const bookData = req.body;
  
    try {
      const bookRef = db.collection("Mybooks").doc(userId).collection("books").doc(bookId);
  
      const bookDoc = await bookRef.get();
  
      if (!bookDoc.exists) {
        // If book doesn't exist, create it
        await bookRef.set({
          bookid: bookId,
          ...bookData,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
        return res.json({ success: true, message: "Book created successfully" });
      }
  
      // If book exists, update it
      await bookRef.update({
        ...bookData,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
  
      res.json({ success: true, message: "Book updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  

exports.api11 = functions.https.onRequest(app);
