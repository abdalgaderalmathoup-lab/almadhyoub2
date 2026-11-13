import { login, logout, watchAuth } from './auth.js';
import { getMembership, createOrg } from './db.js';
import { postJournalEntry } from './accounting.js';
import { addParty, getParties } from './parties.js';
import { addWarehouse, getWarehouses, addItem, getItems } from './inventory.js';
import { formatMoney } from './money.js';

let currentOrgId = null;

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginView = document.getElementById('login-view');
  const appView = document.getElementById('app-view');
  const logoutBtn = document.getElementById('logout-btn');
  const authError = document.getElementById('auth-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.textContent = '';
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    try {
      await login(email, pass);
    } catch (err) {
      authError.textContent = "خطأ في تسجيل الدخول: " + err.message;
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await logout();
  });

  watchAuth(async (user) => {
    if (user) {
      loginView.classList.add('hidden');
      appView.classList.remove('hidden');
      
      let membership = await getMembership(user.uid);
      if (!membership) {
        currentOrgId = await createOrg(user.uid, user.email);
        document.getElementById('org-name').textContent = "شركة جديدة";
      } else {
        currentOrgId = membership.orgId;
        document.getElementById('org-name').textContent = membership.orgData.name || "المضيوب";
      }
      
      renderDashboard();
    } else {
      loginView.classList.remove('hidden');
      appView.classList.add('hidden');
      currentOrgId = null;
    }
  });

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const page = e.target.getAttribute('data-page');
      if (page === 'dashboard') renderDashboard();
      else if (page === 'parties') renderPartiesPage();
      else if (page === 'inventory') renderInventoryPage();
      else if (page === 'journal') renderJournalPage();
      else renderPlaceholder(page);
    });
  });
});

function renderDashboard() {
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="card">
      <h3>مرحباً بك في نظام المضيوب</h3>
      <p style="margin-top: 8px; color: #64748b;">النظام المحاسبي يعمل بقيد مزدوج آمن ومتصل سحابياً.</p>
      <button id="test-entry-btn" class="btn-primary" style="margin-top: 15px;">ترحيل قيد تجريبي (افتتاحي)</button>
    </div>
  `;
  
  document.getElementById('test-entry-btn').addEventListener('click', async () => {
    try {
      await postJournalEntry(currentOrgId, {
        date: new Date().toISOString().split('T')[0],
        description: "قيد افتتاحي تجريبي",
        lines: [
          { accountId: "1100", debit: 1000, credit: 0, description: "صندوق" },
          { accountId: "3100", debit: 0, credit: 1000, description: "رأس المال" }
        ],
        uid: "system"
      });
      alert("تم ترحيل القيد التجريبي بنجاح!");
    } catch (e) {
      alert("خطأ: " + e.message);
    }
  });
}

// --- شاشة الجهات (العملاء والموردين) ---
async function renderPartiesPage() {
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="card">
      <h3>إدارة العملاء والموردين</h3>
      <form id="party-form" style="margin-top: 12px;">
        <input type="text" id="party-name" placeholder="اسم الجهة (عميل / مورد)" required style="width:150px; padding:8px; margin:4px;">
        <select id="party-type" style="padding:8px; margin:4px;">
          <option value="customer">عميل</option>
          <option value="supplier">مورد</option>
          <option value="both">عميل ومورد</option>
        </select>
        <input type="text" id="party-phone" placeholder="رقم الهاتف" style="width:120px; padding:8px; margin:4px;">
        <button type="submit" class="btn-primary" style="margin-top:8px;">إضافة الجهة</button>
      </form>
    </div>
    <div class="card">
      <h4>قائمة الجهات المسجلة</h4>
      <div id="parties-list" style="margin-top: 10px;">جاري التحميل...</div>
    </div>
  `;

  document.getElementById('party-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('party-name').value;
    const type = document.getElementById('party-type').value;
    const phone = document.getElementById('party-phone').value;
    try {
      await addParty(currentOrgId, { name, type, phone });
      alert("تمت إضافة الجهة بنجاح");
      renderPartiesPage();
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  });

  try {
    const parties = await getParties(currentOrgId);
    const listDiv = document.getElementById('parties-list');
    if (parties.length === 0) {
      listDiv.innerHTML = `<p style="color:#64748b; font-size:14px;">لا توجد جهات مضافة بعد.</p>`;
    } else {
      listDiv.innerHTML = parties.map(p => `
        <div style="padding:8px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${p.name}</strong> <span style="font-size:12px; color:#64748b;">(${p.type === 'customer' ? 'عميل' : p.type === 'supplier' ? 'مورد' : 'عميل ومورد'})</span>
            <div style="font-size:12px; color:#475569;">الهاتف: ${p.phone || 'غير متوفر'}</div>
          </div>
          <div>الرصيد: ${formatMoney(p.balance || 0)}</div>
        </div>
      `).join('');
    }
  } catch (err) {
    document.getElementById('parties-list').innerHTML = `<p style="color:red;">خطأ في جلب البيانات</p>`;
  }
}

// --- شاشة المخزون والأصناف ---
async function renderInventoryPage() {
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="card">
      <h3>إدارة المخزون والأصناف</h3>
      <form id="item-form" style="margin-top: 12px;">
        <input type="text" id="item-name" placeholder="اسم الصنف" required style="width:150px; padding:8px; margin:4px;">
        <input type="text" id="item-sku" placeholder="رمز الصنف (SKU)" style="width:100px; padding:8px; margin:4px;">
        <input type="number" id="item-sale" placeholder="سعر البيع" step="0.01" style="width:100px; padding:8px; margin:4px;">
        <input type="number" id="item-buy" placeholder="سعر الشراء" step="0.01" style="width:100px; padding:8px; margin:4px;">
        <button type="submit" class="btn-primary" style="margin-top:8px;">إضافة صنف جديد</button>
      </form>
    </div>
    <div class="card">
      <h4>قائمة الأصناف والمخزون</h4>
      <div id="items-list" style="margin-top: 10px;">جاري التحميل...</div>
    </div>
  `;

  document.getElementById('item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const sku = document.getElementById('item-sku').value;
    const salePrice = parseFloat(document.getElementById('item-sale').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('item-buy').value) || 0;
    try {
      await addItem(currentOrgId, { name, sku, salePrice, purchasePrice });
      alert("تمت إضافة الصنف بنجاح");
      renderInventoryPage();
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  });

  try {
    const items = await getItems(currentOrgId);
    const listDiv = document.getElementById('items-list');
    if (items.length === 0) {
      listDiv.innerHTML = `<p style="color:#64748b; font-size:14px;">لا توجد أصناف مضافة بعد.</p>`;
    } else {
      listDiv.innerHTML = items.map(i => `
        <div style="padding:8px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${i.name}</strong> <span style="font-size:12px; color:#64748b;">(الرمز: ${i.sku || 'N/A'})</span>
            <div style="font-size:12px; color:#475569;">سعر البيع: ${formatMoney(i.salePrice)} | سعر الشراء: ${formatMoney(i.purchasePrice)}</div>
          </div>
          <div>الكمية: ${i.stockQty || 0}</div>
        </div>
      `).join('');
    }
  } catch (err) {
    document.getElementById('items-list').innerHTML = `<p style="color:red;">خطأ في جلب أصناف المخزون</p>`;
  }
}

function renderJournalPage() {
  document.getElementById('page-content').innerHTML = `
    <div class="card">
      <h3>دفتر القيود اليومية</h3>
      <p style="color: #64748b; margin-top: 8px;">استعراض القيود المحاسبية المرحلة بدقة مزدوجة.</p>
    </div>
  `;
}

function renderPlaceholder(page) {
  document.getElementById('page-content').innerHTML = `
    <div class="card">
      <h3>صفحة ${page}</h3>
      <p style="color: #64748b; margin-top: 8px;">هذه الشاشة قيد التطوير.</p>
    </div>
  `;
}
