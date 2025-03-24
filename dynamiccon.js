/** @format */



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtaftgrL4p4wqNC2w211mUi8amkjw2kzM",
  authDomain: "profstudymate-6d0fc.firebaseapp.com",
  projectId: "profstudymate",
  storageBucket: "profstudymate.appspot.com",
  messagingSenderId: "141453158869",
  appId: "1:141453158869:web:d4ded426a90e9937e2f55c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  document.getElementById("signOut").addEventListener("click", () => {
    auth
      .signOut()
      .then(() => {
        window.location.href = "./";
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  });

  if (user) {
    const userId = user.uid;
    const userDoc = doc(db, "users", userId);
    getDoc(userDoc)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          username = userData.email || "userEmail";
          document.getElementById("userName").innerText =
            userData.name || "User Name";
          document.getElementById("userEmail").innerText =
            userData.email || "User Email";
          document.getElementById("userImage").src =
            userData.photoURL || "https://via.placeholder.com/150";
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    document.getElementById("card1").innerHTML = "";
    document.getElementById("textDiv").innerHTML = "";
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    let namee = user.email; // Replace with your actual string variable
    let trimmedName = (namee.charAt(0) + namee.charAt(1)).toUpperCase();
    document.getElementById(
      "sinb"
    ).innerHTML = `<div class ="flex flex-row justify-center items-center">
    <div class="bg-white w-10 h-10 rounded-full mr-2 text-blue-600 font-extrabold text-center items-center justify-center flex cursor-pointer">
${trimmedName}
    </div>
    <div  class =" text-white cursor-pointer hover:text-blue-600 ">${user.email}</div>
    </div> `;
    document.getElementById(
      "sinm"
    ).innerHTML = `<div class ="flex flex-row  items-center">
    <div class="bg-white w-10 h-10 rounded-full mr-2 text-blue-600 font-extrabold text-center items-center justify-center flex cursor-pointer">
${trimmedName}
    </div>
    <div  class =" text-white cursor-pointer hover:text-blue-600 ">${user.email}</div>
    </div>`;
  } else {
  }
});

document
  .getElementById("toggle-login")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("create-account-section").style.display = "none";
    document.getElementById("login-section").style.display = "block";
  });

document
  .getElementById("toggle-create")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("login-section").style.display = "none";
    document.getElementById("create-account-section").style.display = "block";
  });
// Function to handle account creation form submission
document
  .getElementById("account-form")
  .addEventListener("submit", async (e) => {
    document.getElementById('loading-screen').classList.remove("hidden");
    e.preventDefault();

    const name = document.getElementById("full-name").value;
    const registn = document.getElementById("reg-number").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const telephone = document.getElementById("telephone").value;
    const referralcode = document.getElementById("referral").value||'YM9J45qmiggNlMC4HpJZbXtn1CM2';
    const userType = document.getElementById("user-type").value; // Get the selected user type (student or author)

    // Author-specific fields (if user is an author)
    const zoomId =
      userType === "author" ? document.getElementById("zoom-id").value : null;
    
    try {
      // Create a new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional author-specific data to Firestore or Realtime Database
      if (userType === "author") {
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          telephone,
          underef: referralcode,
          affiliatelink: user.uid,
          earnings: 0,
          totalrefs: 0,
          zoomId,
      status: "Offline",
          role: ['pending'],
        });
      } else {
        // Save student-specific data if needed
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          telephone,
          registern: registn,
          role: ['student'],
          underef: referralcode,
          affiliatelink: user.uid,
          earnings: 0,
          totalrefs: 0,
        });
        try {
          const userRef = doc(db, "users", referralcode);

          // Get the current document data
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            let currentRefs = docSnap.data().totalrefs || 0;
            currentRefs += 1;

            // Update only the totalrefs field
            await updateDoc(userRef, { totalrefs: currentRefs });

            console.log("Total refs updated successfully!");
          } else {
            console.log("No such document, creating a new one.");
            // Create a new document with only totalrefs field
            await setDoc(userRef, { totalrefs: 1 }, { merge: true });
          }
        } catch (error) {
          console.error("Error updating totalrefs:", error);
        }

      }

      // Close the modal after successful account creation
      closeModal();
      showSuccessToast()
      setTimeout(() => {
        window.location.href = "./"; // Change this to your actual dashboard URL
    }, 3000);
    } catch (error) { document.getElementById('loading-screen').classList.add("hidden");
      showerrorToast1(error.message)
      // Handle account creation errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating account:", errorCode, errorMessage);

      // Display error message to the user (you can customize this based on your UI)
      const errorElement = document.createElement("div");
      errorElement.textContent = errorMessage;
      errorElement.classList.add("text-red-500", "text-sm", "mt-2");
      document.getElementById("account-form").appendChild(errorElement);
    }
  });

// Function to handle login form submission
document.getElementById("login-form").addEventListener("submit", async (e) => {  document.getElementById('loading-screen').classList.remove("hidden");
  e.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Login successful
    console.log("User logged in:", userCredential.user.email);
showSuccessToast1()
    // window.location.href = "./";
    setTimeout(() => {
      window.location.href = "./"; // Change this to your actual dashboard URL
  }, 3000);

    // Optionally, you can add logic here to handle adding the item to the cart after login
    // Replace with your actual add to cart function
    closeModal(); // Close modal after successful login
  } catch (error) {
    // Handle login errors
    document.getElementById('loading-screen').classList.add("hidden");
    showerrorToast1(error.message)
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing in:", errorCode, errorMessage);

    // Display error message to the user (you can customize this based on your UI)
    const errorElement = document.createElement("div");
    errorElement.textContent = errorMessage;
    errorElement.classList.add("text-red-500", "text-sm", "mt-2");
    document.getElementById("login-form").appendChild(errorElement);
  }
});
function showSuccessToast() {
  Toastify({
      text: "🎉 Account created successfully!",
      duration: 3000, // Auto close after 3 seconds
      close: true, // Show close button
      gravity: "top", // Position on top
      position: "right", // Align to the right
      backgroundColor: "linear-gradient(to right, #38a169, #2f855a)", // Green gradient
      stopOnFocus: true, // Stop dismissing on hover
  }).showToast();
}
function showerrorToast1(err) {
  Toastify({
      text: err,
      duration: 3000, // Auto close after 3 seconds
      close: true, // Show close button
      gravity: "top", // Position on top
      position: "right", // Align to the right
      backgroundColor: "linear-gradient(to right, rgba(231,76,60,0.8), rgba(192,57,43,0.8))", // Green gradient
      stopOnFocus: true, // Stop dismissing on hover
  }).showToast();
}

function showSuccessToast1() {
  Toastify({
      text: "🎉 Login successfully!",
      duration: 3000, // Auto close after 3 seconds
      close: true, // Show close button
      gravity: "top", // Position on top
      position: "right", // Align to the right
      backgroundColor: "linear-gradient(to right, #38a169, #2f855a)", // Green gradient
      stopOnFocus: true, // Stop dismissing on hover
  }).showToast();
}
function closeModal() {
  const modal = document.getElementById("account-modal");
  modal.style.display = "none";
}
//Change Cart number
function changeCart() {
  document.getElementById("cartn").innerHTML = "10";
}
document.addEventListener("DOMContentLoaded", changeCart);
//Change mybooks number
async function changeMybooks() {
  try {
    const books = await getDocs(collection(db, "books"));
    const numberbooks = books.size;
    document.getElementById("booksn").innerHTML = numberbooks;
  } catch (error) {}
}

document.addEventListener("DOMContentLoaded", changeMybooks);

// signout
