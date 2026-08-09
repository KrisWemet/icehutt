/* Flavour board admin — staff set each flavour's stock status here.

   No secrets live in this file. The Supabase publishable key is public by
   design; what protects the data is the row-level security policy on
   flavour_status (see ADMIN-SETUP.md): anyone may read the board, only a
   signed-in staff account may write to it.

   Deliberately no SDK. The rest of this site ships zero dependencies and
   loads nothing from a CDN, and the handful of REST calls below are small
   enough that pulling in a library would cost more than it saves.

   Shape of the data: the flavour list itself stays in the website's HTML and
   is mirrored to flavours-data.json, so the site remains the source of truth
   for names. The database holds one row per flavour that is NOT in stock —
   absence means available, so a fresh season needs no seeding. */

(function () {
  'use strict';

  var cfg = window.ICEHUT_SUPABASE;
  var bootNote = document.getElementById('bootNote');

  if (!cfg || !cfg.url || cfg.url.indexOf('REPLACE_ME') !== -1) {
    bootNote.textContent =
      'Not set up yet — supabase-config.js still has placeholder values. See ADMIN-SETUP.md.';
    return;
  }

  var REST = cfg.url + '/rest/v1/flavour_status';
  var AUTH = cfg.url + '/auth/v1';
  var SESSION_KEY = 'icehut.session';

  var STATUSES = [
    { value: 'in_stock',     label: 'In stock' },
    { value: 'getting_low',  label: 'Getting low' },
    { value: 'out_of_stock', label: 'Out of stock' }
  ];

  var loginView = document.getElementById('loginView');
  var boardView = document.getElementById('boardView');
  var rowsEl    = document.getElementById('rows');
  var searchEl  = document.getElementById('search');
  var saveState = document.getElementById('saveState');
  var emptyNote = document.getElementById('emptyNote');
  var whoEl     = document.getElementById('who');

  var catalogue = [];   // [{slug, name}] from flavours-data.json, alphabetical
  var statuses  = {};   // {slug: status} — only the ones that aren't in stock
  var filter    = 'all';
  var saveTimer;
  var session   = null;

  /* ---------- Session ---------- */

  function loadSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveSession(s) {
    session = s;
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* private mode — session just won't persist */ }
  }

  function expired(s) {
    // Refresh a minute early rather than racing the expiry.
    return !s || !s.expires_at || (s.expires_at * 1000) - 60000 < Date.now();
  }

  function refresh() {
    if (!session || !session.refresh_token) return Promise.reject('no session');
    return fetch(AUTH + '/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { apikey: cfg.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (s) { saveSession(s); return s; });
  }

  // Every authenticated call goes through here so a stale token refreshes
  // itself instead of surfacing as a mysterious save failure mid-shift.
  function authed(url, opts) {
    var run = function () {
      var o = opts || {};
      o.headers = Object.assign({
        apikey: cfg.publishableKey,
        Authorization: 'Bearer ' + session.access_token,
        'Content-Type': 'application/json'
      }, o.headers || {});
      return fetch(url, o);
    };
    return (expired(session) ? refresh() : Promise.resolve())
      .then(run)
      .then(function (r) {
        if (r.status !== 401) return r;
        return refresh().then(run);   // one retry, then let it fail honestly
      });
  }

  /* ---------- Auth ---------- */

  function show(view) {
    loginView.hidden = view !== 'login';
    boardView.hidden = view !== 'board';
    whoEl.hidden     = view !== 'board';
    bootNote.hidden  = true;
  }

  function onSignedIn(email) {
    document.getElementById('whoEmail').textContent = email;
    show('board');
    load();
  }

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = document.getElementById('loginBtn');
    var err = document.getElementById('loginError');
    var email = document.getElementById('email').value.trim();

    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Signing in…';

    fetch(AUTH + '/token?grant_type=password', {
      method: 'POST',
      headers: { apikey: cfg.publishableKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: document.getElementById('password').value
      })
    })
      .then(function (r) {
        return r.json().then(function (body) {
          return r.ok ? body : Promise.reject(r.status);
        });
      })
      .then(function (s) {
        saveSession(s);
        document.getElementById('password').value = '';
        onSignedIn((s.user && s.user.email) || email);
      })
      .catch(function (status) {
        err.textContent = status === 429
          ? 'Too many tries. Wait a minute and try again.'
          : 'That email and password didn’t match. Try again.';
        err.hidden = false;
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = 'Sign in';
      });
  });

  document.getElementById('signOut').addEventListener('click', function () {
    var s = session;
    saveSession(null);
    show('login');
    if (s) {
      fetch(AUTH + '/logout', {
        method: 'POST',
        headers: {
          apikey: cfg.publishableKey,
          Authorization: 'Bearer ' + s.access_token
        }
      }).catch(function () { /* local session is already gone; that's what matters */ });
    }
  });

  /* ---------- Data ---------- */

  function load() {
    var needCatalogue = catalogue.length
      ? Promise.resolve(catalogue)
      : fetch('flavours-data.json')
          .then(function (r) { return r.json(); })
          .then(function (list) { catalogue = list; return list; });

    return needCatalogue
      .then(function () {
        return authed(REST + '?select=slug,status');
      })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (rows) {
        statuses = {};
        rows.forEach(function (row) { statuses[row.slug] = row.status; });
        render();
      })
      .catch(function () {
        setSaveState('Couldn’t load the flavour list. Check your connection and reload.', 'error');
      });
  }

  function setStatus(slug, status) {
    if ((statuses[slug] || 'in_stock') === status) return;

    var previous = statuses[slug];
    if (status === 'in_stock') delete statuses[slug];
    else statuses[slug] = status;
    render();                    // optimistic — the tap feels instant
    setSaveState('Saving…', 'pending');

    // "In stock" is the absence of a row, so it's a delete rather than a write.
    var req = status === 'in_stock'
      ? authed(REST + '?slug=eq.' + encodeURIComponent(slug), { method: 'DELETE' })
      : authed(REST, {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates' },
          body: JSON.stringify({ slug: slug, status: status })
        });

    req
      .then(function (r) { return r.ok ? r : Promise.reject(r.status); })
      .then(function () { setSaveState('Saved', 'ok'); })
      .catch(function () {
        if (previous === undefined) delete statuses[slug];
        else statuses[slug] = previous;   // put it back; nothing was saved
        render();
        setSaveState('Couldn’t save that change — check your connection.', 'error');
      });
  }

  document.getElementById('resetAll').addEventListener('click', function () {
    var flagged = Object.keys(statuses);
    if (!flagged.length) return setSaveState('Everything is already in stock.', 'ok');

    if (!window.confirm('Set all ' + flagged.length + ' flagged flavour' +
        (flagged.length === 1 ? '' : 's') + ' back to “In stock”?')) return;

    var previous = statuses;
    statuses = {};
    render();
    setSaveState('Saving…', 'pending');

    // Clearing the board is deleting every exception row.
    authed(REST + '?slug=neq.__none__', { method: 'DELETE' })
      .then(function (r) { return r.ok ? r : Promise.reject(r.status); })
      .then(function () { setSaveState('Everything is back in stock.', 'ok'); })
      .catch(function () {
        statuses = previous;
        render();
        setSaveState('Couldn’t save that — check your connection.', 'error');
      });
  });

  function setSaveState(msg, kind) {
    clearTimeout(saveTimer);
    saveState.textContent = msg;
    saveState.className = 'save-state is-' + kind;
    if (kind === 'ok') saveTimer = setTimeout(function () { saveState.textContent = ''; }, 2500);
  }

  /* ---------- Rendering ---------- */

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      filter = chip.dataset.filter;
      document.querySelectorAll('.chip').forEach(function (c) {
        c.classList.toggle('is-active', c === chip);
      });
      render();
    });
  });

  searchEl.addEventListener('input', render);

  function statusOf(slug) { return statuses[slug] || 'in_stock'; }

  function render() {
    var q = searchEl.value.trim().toLowerCase();
    var visible = catalogue.filter(function (f) {
      return (filter === 'all' || statusOf(f.slug) === filter) &&
             (!q || f.name.toLowerCase().indexOf(q) !== -1);
    });

    document.getElementById('countAll').textContent = catalogue.length;
    document.getElementById('countLow').textContent =
      catalogue.filter(function (f) { return statusOf(f.slug) === 'getting_low'; }).length;
    document.getElementById('countOut').textContent =
      catalogue.filter(function (f) { return statusOf(f.slug) === 'out_of_stock'; }).length;

    rowsEl.textContent = '';
    visible.forEach(function (f) { rowsEl.appendChild(rowFor(f)); });
    emptyNote.hidden = visible.length > 0;
  }

  function rowFor(f) {
    var current = statusOf(f.slug);
    var li = document.createElement('li');
    li.className = 'flavour-row status-' + current;

    var name = document.createElement('span');
    name.className = 'flavour-row-name';
    name.textContent = f.name;
    li.appendChild(name);

    var group = document.createElement('div');
    group.className = 'status-toggle';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Status for ' + f.name);

    STATUSES.forEach(function (s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'status-btn status-btn--' + s.value;
      btn.textContent = s.label;
      btn.setAttribute('aria-pressed', String(current === s.value));
      if (current === s.value) btn.classList.add('is-on');
      btn.addEventListener('click', function () { setStatus(f.slug, s.value); });
      group.appendChild(btn);
    });

    li.appendChild(group);
    return li;
  }

  /* ---------- Boot ---------- */

  session = loadSession();
  if (session && session.refresh_token) {
    // Resume the shift without a re-login if the stored session is still good.
    (expired(session) ? refresh() : Promise.resolve(session))
      .then(function (s) { onSignedIn((s.user && s.user.email) || 'staff'); })
      .catch(function () { saveSession(null); show('login'); });
  } else {
    show('login');
  }
})();
