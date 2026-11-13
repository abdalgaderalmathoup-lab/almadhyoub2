import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdFkHr9h7dPMDYPGFCAQxF-2SRRFsV02s",
  authDomain: "almadhyoub2.firebaseapp.com",
  projectId: "almadhyoub2",
  storageBucket: "almadhyoub2.firebasestorage.app",
  messagingSenderId: "183992521523",
  appId: "1:183992521523:web:0b64d1b68c74d89fd4a446"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, firebaseConfig, auth, db };
