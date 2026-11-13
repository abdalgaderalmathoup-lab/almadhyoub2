import { db } from './firebase-config.js';
import { collection, doc, getDoc, setDoc, addDoc, getDocs, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { seedAccounts } from './seed-accounts.js';

export async function getMembership(uid) {
  const membersGroup = query(collection(db, "orgs"), where("ownerId", "==", uid));
  const snap = await getDocs(membersGroup);
  if (!snap.empty) {
    const orgDoc = snap.docs[0];
    return { orgId: orgDoc.id, role: 'owner', orgData: orgDoc.data() };
  }
  return null;
}

export async function createOrg(uid, email) {
  const orgId = "org_" + Math.random().toString(36.2, 9);
  const orgRef = doc(db, "orgs", orgId);
  
  await setDoc(orgRef, {
    name: "شركة " + email.split('@')[0],
    ownerId: uid,
    currency: "ريال",
    createdAt: serverTimestamp()
  });

  await seedAccounts(orgId);
  return orgId;
}
