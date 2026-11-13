import { login, logout, watchAuth } from './auth.js';
import { getMembership, createOrg } from './db.js';
import { postJournalEntry } from './accounting.js';

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
      else renderPlaceholder(page);
    });
  });
});

function renderDashboard() {
  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="card">
      <h3>مرحباً بك في نظام المضيوب</h3>
      <p style="margin-top: 8px; color: #64748b;">النظام المحاسبي يعمل بكفاءة وبقيد مزدوج آمن.</p>
      <button id="test-entry-btn" class="btn-primary" style="margin-top: 15px;">ترحيل قيد تجريبي</button>
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

function renderPartiesPage() {
  document.getElementById('page-content').innerHTML = `
    <div class="card">
      <h3>إدارة العملاء والموردين</h3>
      <p style="color: #64748b; margin-top: 8px;">قريباً: إضافة وعرض العملاء والموردين والأرصدة.</p>
    </div>
  `;
}

function renderInventoryPage() {
  document.getElementById('page-content').innerHTML = `
    <div class="card">
      <h3>إدارة المخزون والأصناف</h3>
      <p style="color: #64748b; margin-top: 8px;">قريباً: إدارة المستودعات، الأصناف، والكميات.</p>
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
