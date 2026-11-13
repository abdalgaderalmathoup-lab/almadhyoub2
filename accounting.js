import { db } from './firebase-config.js';
import { doc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export async function postJournalEntry(orgId, { date, description, lines, uid }) {
  if (!lines || lines.length === 0) throw new Error("القيد فارغ");

  let totalD = 0;
  let totalC = 0;

  lines.forEach(l => {
    const d = Number(l.debit) || 0;
    const c = Number(l.credit) || 0;
    if (d < 0 || c < 0) throw new Error("المبالغ لا يمكن أن تكون سالبة");
    if (d > 0 && c > 0) throw new Error("السطر لا يمكن أن يكون مدين ودائن معاً");
    if (d === 0 && c === 0) throw new Error("السطر فارغ");
    if (!l.accountId) throw new Error("تحديد الحساب إلزامي");
    totalD += d;
    totalC += c;
  });

  if (Math.abs(totalD - totalC) > 0.005) {
    throw new Error(`القيد غير متوازن: المدين (${totalD}) لا يساوي الدائن (${totalC})`);
  }
  if (totalD === 0) throw new Error("قيد بصفر غير مسموح");

  const year = new Date().getFullYear();
  const seqRef = doc(db, `orgs/${orgId}/sequences`, `JV_${year}`);
  const entryRef = doc(db, `orgs/${orgId}/journal_entries`, "_" + Date.now());

  await runTransaction(db, async (transaction) => {
    const seqDoc = await transaction.get(seqRef);
    let nextNum = 1;
    if (seqDoc.exists()) {
      nextNum = (seqDoc.data().lastNum || 0) + 1;
    }
    const entryNo = `JV-${year}-${String(nextNum).padStart(6, '0')}`;

    transaction.set(seqRef, { lastNum: nextNum }, { merge: true });
    transaction.set(entryRef, {
      orgId,
      entryNo,
      date,
      description,
      lines,
      debitTotal: totalD,
      creditTotal: totalC,
      status: "posted",
      createdBy: uid,
      createdAt: serverTimestamp()
    });
  });

  return true;
}
