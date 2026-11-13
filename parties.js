import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function addParty(orgId, { name, type, phone, address }) {
  if (!name || !type) throw new Error("اسم الجهة والنوع مطلوبان");
  
  const partiesRef = collection(db, `orgs/${orgId}/parties`);
  const docRef = await addDoc(partiesRef, {
    name: name.trim(),
    type: type,
    phone: phone ? phone.trim() : "",
    address: address ? address.trim() : "",
    balance: 0,
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
}

export async function getParties(orgId, type = null) {
  const partiesRef = collection(db, `orgs/${orgId}/parties`);
  let q = partiesRef;
  
  if (type) {
    q = query(partiesRef, where("type", "==", type));
  }
  
  const snapshot = await getDocs(q);
  const parties = [];
  snapshot.forEach(doc => {
    parties.push({ id: doc.id, ...doc.data() });
  });
  
  return parties;
}
