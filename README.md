# نظام المضيوب المحاسبي (Al-Madhyoub Accounting System)

نظام محاسبي متكامل بقيد مزدوج، يعمل كتطبيق ويب تقدمي (PWA) على الهواتف والمتصفحات دون الحاجة لخادم خلفي تقليدي، معتمدًا على Firebase و Firestore والعمل دون انترنت (Offline-first).

## الهيكل التقني
- **Frontend**: Vanilla JavaScript (ES Modules), SPA.
- **Backend / DB**: Firebase Authentication & Cloud Firestore.
- **Security**: Firestore Security Rules تمنع تعديل أو حذف القيود وتضمن توازنها.
- **PWA**: Service Worker لدعم العمل دون إنترنت والتخزين المحلي عبر IndexedDB.

## طريقة الرفع إلى GitHub & Netlify
1. أنشئ مستودعاً جديداً على GitHub.
2. قم برفع هذه الملفات بالكامل إلى المستودع.
3. اربط المستودع بـ Netlify لنشر التطبيق فوراً عبر رابط HTTPS.
