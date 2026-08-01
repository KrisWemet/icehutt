/* Flavour board admin — staff set each flavour's stock status here.
   No secrets live in this file. Firebase web config is public by design; what
   protects the data is the Firestore security rules (see ADMIN-SETUP.md):
   anyone may read the board, only a signed-in staff account may write to it.

   Shape of the data: the flavour list itself stays in the website's HTML and
   is mirrored to flavours-data.json, so the site remains the source of truth
   for names. Firestore holds only board/flavours = { statuses: {slug: status} },
   which keeps this to one small read for visitors. */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore, doc, getDoc, setDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const cfg = window.ICEHUT_FIREBASE;
const bootNote = document.getElementById('bootNote');

if (!cfg || cfg.projectId.includes('REPLACE_ME')) {
  bootNote.textContent =
    'Not set up yet — firebase-config.js still has placeholder values. See ADMIN-SETUP.md.';
  throw new Error('Firebase not configured');
}

const app  = initializeApp(cfg);
const auth = getAuth(app);
const db   = getFirestore(app);
const boardRef = doc(db, 'board', 'flavours');

const STATUSES = [
  { value: 'in_stock',     label: 'In stock' },
  { value: 'getting_low',  label: 'Getting low' },
  { value: 'out_of_stock', label: 'Out of stock' }
];

const loginView = document.getElementById('loginView');
const boardView = document.getElementById('boardView');
const rowsEl    = document.getElementById('rows');
const searchEl  = document.getElementById('search');
const saveState = document.getElementById('saveState');
const emptyNote = document.getElementById('emptyNote');
const whoEl     = document.getElementById('who');

let catalogue = [];   // [{slug, name}] from flavours-data.json, alphabetical
let statuses  = {};   // {slug: status} — only the ones that aren't in stock
let filter    = 'all';
let saveTimer;

/* ---------- Auth ---------- */

function show(view) {
  loginView.hidden = view !== 'login';
  boardView.hidden = view !== 'board';
  whoEl.hidden     = view !== 'board';
  bootNote.hidden  = true;
}

onAuthStateChanged(auth, user => {
  if (!user) return show('login');
  document.getElementById('whoEmail').textContent = user.email;
  show('board');
  load();
});

document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginError');
  err.hidden = true;
  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {
    await signInWithEmailAndPassword(
      auth,
      document.getElementById('email').value.trim(),
      document.getElementById('password').value
    );
    document.getElementById('password').value = '';
    // onAuthStateChanged swaps the view
  } catch (e2) {
    err.textContent = e2.code === 'auth/too-many-requests'
      ? 'Too many tries. Wait a minute and try again.'
      : 'That email and password didn’t match. Try again.';
    err.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign in';
  }
});

document.getElementById('signOut').addEventListener('click', () => signOut(auth));

/* ---------- Data ---------- */

async function load() {
  try {
    if (!catalogue.length) {
      const res = await fetch('flavours-data.json');
      catalogue = await res.json();
    }
    const snap = await getDoc(boardRef);
    statuses = snap.exists() ? (snap.data().statuses || {}) : {};
    render();
  } catch {
    setSaveState('Couldn’t load the flavour list. Check your connection and reload.', 'error');
  }
}

async function setStatus(slug, status) {
  if ((statuses[slug] || 'in_stock') === status) return;

  const previous = statuses[slug];
  statuses[slug] = status;   // optimistic — the tap feels instant
  render();
  setSaveState('Saving…', 'pending');

  try {
    // merge writes only this one key, so two people editing different
    // flavours at the same time won't overwrite each other.
    await setDoc(boardRef, {
      statuses: { [slug]: status },
      updatedAt: serverTimestamp(),
      updatedBy: auth.currentUser.email
    }, { merge: true });
    setSaveState('Saved', 'ok');
  } catch {
    if (previous === undefined) delete statuses[slug];
    else statuses[slug] = previous;     // put it back; nothing was saved
    render();
    setSaveState('Couldn’t save that change — check your connection.', 'error');
  }
}

document.getElementById('resetAll').addEventListener('click', async () => {
  const flagged = Object.keys(statuses).filter(s => statuses[s] !== 'in_stock');
  if (!flagged.length) return setSaveState('Everything is already in stock.', 'ok');

  if (!window.confirm(`Set all ${flagged.length} flagged flavour` +
      `${flagged.length === 1 ? '' : 's'} back to “In stock”?`)) return;

  const previous = statuses;
  statuses = {};
  render();
  setSaveState('Saving…', 'pending');

  try {
    // Deliberately not a merge — this replaces the whole map with an empty one.
    await setDoc(boardRef, {
      statuses: {},
      updatedAt: serverTimestamp(),
      updatedBy: auth.currentUser.email
    });
    setSaveState('Everything is back in stock.', 'ok');
  } catch {
    statuses = previous;
    render();
    setSaveState('Couldn’t save that — check your connection.', 'error');
  }
});

function setSaveState(msg, kind) {
  clearTimeout(saveTimer);
  saveState.textContent = msg;
  saveState.className = 'save-state is-' + kind;
  if (kind === 'ok') saveTimer = setTimeout(() => { saveState.textContent = ''; }, 2500);
}

/* ---------- Rendering ---------- */

document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    filter = chip.dataset.filter;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('is-active', c === chip));
    render();
  });
});

searchEl.addEventListener('input', render);

const statusOf = slug => statuses[slug] || 'in_stock';

function render() {
  const q = searchEl.value.trim().toLowerCase();
  const visible = catalogue.filter(f =>
    (filter === 'all' || statusOf(f.slug) === filter) &&
    (!q || f.name.toLowerCase().includes(q))
  );

  document.getElementById('countAll').textContent = catalogue.length;
  document.getElementById('countLow').textContent =
    catalogue.filter(f => statusOf(f.slug) === 'getting_low').length;
  document.getElementById('countOut').textContent =
    catalogue.filter(f => statusOf(f.slug) === 'out_of_stock').length;

  rowsEl.textContent = '';
  visible.forEach(f => rowsEl.appendChild(rowFor(f)));
  emptyNote.hidden = visible.length > 0;
}

function rowFor(f) {
  const current = statusOf(f.slug);
  const li = document.createElement('li');
  li.className = 'flavour-row status-' + current;

  const name = document.createElement('span');
  name.className = 'flavour-row-name';
  name.textContent = f.name;
  li.appendChild(name);

  const group = document.createElement('div');
  group.className = 'status-toggle';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Status for ' + f.name);

  STATUSES.forEach(s => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'status-btn status-btn--' + s.value;
    btn.textContent = s.label;
    btn.setAttribute('aria-pressed', String(current === s.value));
    if (current === s.value) btn.classList.add('is-on');
    btn.addEventListener('click', () => setStatus(f.slug, s.value));
    group.appendChild(btn);
  });

  li.appendChild(group);
  return li;
}
