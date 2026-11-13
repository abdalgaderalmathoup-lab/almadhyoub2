import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { toSmallestUnit } from './money.js';

export async function addWarehouse(orgId, { name, location }) {
  if (!name) throw new Error("اسم المستودع مطلوب");
  
  const whRef = collection(db, `orgs/${orgId}/warehouses`);
  const docRef = await addDoc(whRef, {
    name: name.trim(),
    location: location ? location.trim() : "",
    createdAt: serverTimestamp()
  });
  
  return docRef.id;
}

export async function getWarehouses(orgId) {
  const whRef = collection(db, `orgs/${orgId}/warehouses`);
  const snapshot = await getDocs(whRef);
  const warehouses = [];
  snapshot.forEach(doc => warehouses.push({ id: doc.id, ...doc.data() }));
  return warehouses;
}

export async function addItem(orgId, { name, sku, unit, salePrice, purchasePrice, warehouseId }) {
  if (!name) throw new Error("اسم الصنف مطلوب");

  const itemsRef = collection(db, `orgs/${orgId}/items`);
  const docRef = await addDoc(itemsRef, {
    name: name.trim(),
    sku: sku ? sku.trim() : "",
    unit: unit || "قطعة",
    salePrice: toSmallestUnit(salePrice || 0),
    purchasePrice: toSmallestUnit(purchasePrice || 0),
    warehouseId: warehouseId || "",
    stockQty: 0,
    createdAt: serverTimestamp()
  });

  return docRef.id;
}

export async function getItems(orgId) {
  const itemsRef = collection(db, `orgs/${orgId}/items`);
  const snapshot = await getDocs(itemsRef);
  const items = [];
  snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
  return items;
}
