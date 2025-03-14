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
app.put("/update-user-book/:userId/:bookId/:amount/:refcode", async (req, res) => {
    const { userId, bookId, amount, refcode } = req.params;
    const bookData = req.body;
  
    const amountNumber = Number(amount);
    const twentyFivePercent = amountNumber * 0.25;
  
    try {
      const bookRef = db.collection("Mybooks").doc(userId).collection("books").doc(bookId);
      const userRef = db.collection("users").doc(refcode);
  
      const bookDoc = await bookRef.get();
      const userDoc = await userRef.get();
  
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
  
      if (userDoc.exists) {
        const currentEarnings = userDoc.data().earnings || 0;
        const updatedEarnings = currentEarnings + twentyFivePercent;
  
        await userRef.update({ earnings: updatedEarnings  });
      } else {
        await userRef.set({ earnings: twentyFivePercent });
      }
  
      res.json({ success: true, message: "Book updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  
  // Update course

  app.put("/update-user-course/:userId/:bookId/:amount/:refcode", async (req, res) => {
    const { userId, bookId, amount, refcode } = req.params; // Fixed `bookId` to `courseId`
    const amountNumber = Number(amount);
    const twentyFivePercent = amountNumber * 0.25;

    try {
        const userRef = db.collection("users").doc(userId);
        const referrerRef = db.collection("users").doc(refcode);

        const userDoc = await userRef.get();
        const referrerDoc = await referrerRef.get();

        if (!userDoc.exists) {
            // If user doesn't exist, create it with the course_id as an array
            await userRef.set({
                course_id: [bookId] // Initialize array with the first course
            });

            return res.json({ success: true, message: "Course created successfully" });
        }

        // If user exists, update their course_id array
        const existingCourses = userDoc.data().course_id || [];
        if (!existingCourses.includes(bookId)) {
            await userRef.update({
                course_id: [...existingCourses, bookId] // Append the new course
            });
        }

        // Handle referral earnings
        if (referrerDoc.exists) {
            const currentEarnings = referrerDoc.data().earnings || 0;
            const updatedEarnings = currentEarnings + twentyFivePercent;

            await referrerRef.update({ earnings: updatedEarnings });
        } else {
            await referrerRef.set({ earnings: twentyFivePercent });
        }

        res.json({ success: true, message: "Course updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


exports.api11 = functions.https.onRequest(app);
