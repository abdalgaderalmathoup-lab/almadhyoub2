// استيراد الدوال الأساسية لفايربيس من CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// إعدادات الربط مع مشروع Firebase (almadhyoub2)
const firebaseConfig = {
  apiKey: "AIzaSyDdFkHr9h7dPMDYPGFCAQxF-2SRRFsV02s",
  authDomain: "almadhyoub2.firebaseapp.com",
  projectId: "almadhyoub2",
  storageBucket: "almadhyoub2.firebasestorage.app",
  messagingSenderId: "183992521523",
  appId: "1:183992521523:web:0b64d1b68c74d89fd4a446"
};

// تهيئة التطبيق وخدمات المصادقة وقاعدة البيانات
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// تصدير جميع الخدمات لكي تستخدمها باقي الملفات
export { app, firebaseConfig, auth, db };
