import { db } from './firebase-config.js';
import { collection, doc, setDb, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const DEFAULT_ACCOUNTS = [
  { id: "1000", name: "الأصول", type: "asset", isGroup: true },
  { id: "1100", name: "الصندوق", type: "asset", isGroup: false, parent: "1000" },
  { id: "1200", name: "البنك", type: "asset", isGroup: false, parent: "1000" },
  { id: "1300", name: "العملاء", type: "asset", isGroup: false, parent: "1000" },
  { id: "1400", name: "المخزون", type: "asset", isGroup: false, parent: "1000" },
  
  { id: "2000", name: "الالتزامات", type: "liability", isGroup: true },
  { id: "2100", name: "الموردون", type: "liability", isGroup: false, parent: "2000" },

  { id: "3000", name: "حقوق الملكية", type: "equity", isGroup: true },
  { id: "3100", name: "رأس المال", type: "equity", isGroup: false, parent: "3000" },

  { id: "4000", name: "الإيرادات", type: "revenue", isGroup: true },
  { id: "4100", name: "المبيعات", type: "revenue", isGroup: false, parent: "4000" },

  { id: "5000", name: "المصروفات", type: "expense", isGroup: true },
  { id: "5100", name: "تكلفة المبيعات", type: "expense", isGroup: false, parent: "5000" },
  { id: "5200", name: "الرواتب", type: "expense", isGroup: false, parent: "5000" },
  { id: "5300", name: "الإيجار", type: "expense", isGroup: false, parent: "5000" }
];

export async function seedAccounts(orgId) {
  const accountsRef = collection(db, `orgs/${orgId}/accounts`);
  const snap = await getDocs(accountsRef);
  if (!snap.empty) return; // تم الإنشاء مسبقاً

  for (const acc of DEFAULT_ACCOUNTS) {
    await setDoc(doc(accountsRef, acc.id), acc);
  }
}
