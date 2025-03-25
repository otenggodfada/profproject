const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
require('dotenv').config();
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());





// Nodemailer Setup (Use App Passwords for Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


// Endpoint to Send Emails to All Users
app.post("/send-email", async (req, res) => {
  const { subject, message } = req.body;

  try {
      const usersSnapshot = await db.collection("users").get();
      const emails = usersSnapshot.docs.map(doc => doc.data().email).filter(email => email);

      if (emails.length === 0) {
          return res.status(400).json({ success: false, message: "No users found with email addresses." });
      }

      // Send email to all users
      const mailOptions = {
          from: "otenggodfada@gmail.com",
          to: emails.join(","), // Send to all users at once
          subject,
          text: message
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: `Emails sent to ${emails.length} users!` });
  } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: error.message });
  }
});



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
    const { userId, bookId, amount, refcode } = req.params;
    const amountNumber = Number(amount);
    const twentyFivePercent = amountNumber * 0.25;

    try {
      // Set expiration date (3 months from now)
      const expireDate = new Date();
      expireDate.setMonth(expireDate.getMonth() + 3);

      // Firestore references
      const userRef = db.collection("users").doc(userId);
      const referrerRef = db.collection("users").doc(refcode);
      const courseRef = db.collection("courses").doc(bookId);

      // Fetch user, course, and referrer data concurrently
      const [userDoc, referrerDoc, courseDoc] = await Promise.all([
          userRef.get(),
          referrerRef.get(),
          courseRef.get()
      ]);

      // Validate course existence
      if (!courseDoc.exists) {
          return res.status(404).json({ success: false, message: "Course not found" });
      }

      const courseData = courseDoc.data();
      const authorId = courseData.author.id;

      // Fetch author details
      const authorRef = db.collection("users").doc(authorId);
      const authorDoc = await authorRef.get();

      if (!authorDoc.exists) {
          return res.status(404).json({ success: false, message: "Author not found" });
      }

      const { zoomID, status } = authorDoc.data();

      const courseDetails = {
          course_id: bookId,
          expire_date: admin.firestore.Timestamp.fromDate(expireDate),
          name: courseData.name,
          author: {
              id: authorId,
              name: courseData.author.name,
              image_url: courseData.author.image_url
          },
          zoomID,
          status
      };

      // If user does not exist, create user record and add course
      if (!userDoc.exists) {
          await userRef.set({ course_id: [bookId] });
          await userRef.collection("Courses").doc(bookId).set(courseDetails);
          return res.json({ success: true, message: "User created and course added successfully" });
      }

      // If user exists, update their course_id array and add course
      const existingCourses = userDoc.data().course_id || [];
      if (!existingCourses.includes(bookId)) {
          await Promise.all([
              userRef.update({
                  course_id: admin.firestore.FieldValue.arrayUnion(bookId)
              }),
              userRef.collection("Courses").doc(bookId).set(courseDetails)
          ]);
      }

      // Handle referral earnings
      if (referrerDoc.exists) {
          const totalRefs = referrerDoc.data().totalrefs || 0;
          const updatedTotalRefs = totalRefs + 1;
          const currentEarnings = referrerDoc.data().earnings || 0;
          const updatedEarnings = currentEarnings + twentyFivePercent;

          await referrerRef.update({ earnings: updatedEarnings, totalrefs: updatedTotalRefs });
      } else {
          await referrerRef.set({ earnings: twentyFivePercent, totalrefs: 1 });
      }

      res.json({ success: true, message: "Course updated successfully" });
  } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
});




exports.api11 = functions.https.onRequest(app);
