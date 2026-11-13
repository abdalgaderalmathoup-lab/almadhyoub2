// استيراد الدوال الأساسية لفايربيس من CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// إعدادات الربط مع مشروع Firebase (almadhyoub2)
const firebaseConfig = {
  apiKey: "AIzaSyDdFkHr9h7dPMDYPGFCAQxF-2SRRFsV02s",
  authDomain: "almadhyoub2.firebaseapp.com",
  projectId: "almadhyoub2",
  storageBucket: "almadhyoub2.firebasestorage.app",
  messagingSenderId: "183992521523",
  appId: "1:183992521523:web:0b64d1b68c74d89fd4a446"
};

// تهيئة التطبيق رسمياً
const app = initializeApp(firebaseConfig);

export { app, firebaseConfig };
