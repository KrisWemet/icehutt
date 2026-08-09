(function () {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state + back-to-top ---------- */
  var header = document.getElementById('header');
  var backTop = document.getElementById('backTop');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (backTop) backTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('menuToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Open/closed status (America/Edmonton, seasonal) ---------- */
  // May–Jun: M–F 3–9:30, S–S 12–9:30 · Jul–Aug: daily 12–9:30 · Sep: M–F 3–9, S–S 12–9 · Oct–Apr closed
  function hoursFor(month, day) {
    var wk = day >= 1 && day <= 5;
    if (month === 4 || month === 5) return wk ? [900, 1290] : [720, 1290];
    if (month === 6 || month === 7) return [720, 1290];
    if (month === 8) return wk ? [900, 1260] : [720, 1260];
    return null;
  }
  function seasonKey(month) {
    if (month === 4 || month === 5) return 'mj';
    if (month === 6 || month === 7) return 'ja';
    if (month === 8) return 'sep';
    return null;
  }
  function edmontonNow() {
    try {
      var parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Edmonton', weekday: 'short', month: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], month: parseInt(map.month, 10) - 1, mins: parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), month: d.getMonth(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  function fmt(mins) {
    var h = Math.floor(mins / 60), m = mins % 60;
    var ampm = h >= 12 ? 'pm' : 'am';
    var hr = h % 12 === 0 ? 12 : h % 12;
    return hr + ':' + (m < 10 ? '0' : '') + m + ampm;
  }
  function updateStatus() {
    var dot = document.getElementById('statusDot');
    var text = document.getElementById('statusText');
    if (!dot || !text) return;
    var now = edmontonNow();
    var todays = hoursFor(now.month, now.day);
    if (!todays) {
      dot.classList.add('closed');
      text.textContent = 'Closed for the season · back in May ❄️';
    } else if (now.mins >= todays[0] && now.mins < todays[1]) {
      dot.classList.remove('closed');
      text.textContent = 'Open now · until ' + fmt(todays[1]);
    } else {
      dot.classList.add('closed');
      if (now.mins < todays[0]) {
        text.textContent = 'Opens today at ' + fmt(todays[0]);
      } else {
        var tm = hoursFor(now.month, (now.day + 1) % 7);
        text.textContent = tm ? 'Opens tomorrow at ' + fmt(tm[0]) : 'Closed for the season · back in May ❄️';
      }
    }
    var season = seasonKey(now.month);
    document.querySelectorAll('#hoursTable tr').forEach(function (r) {
      r.classList.toggle('today', season !== null && r.getAttribute('data-season') === season && !r.classList.contains('season-row'));
    });
  }
  updateStatus();
  setInterval(updateStatus, 60000);

  /* ---------- Flavour of the week (rotates automatically every Monday) ---------- */
  var fotwEl = document.getElementById('fotw');
  var FOTW_FLAVOURS = [
    'Chocolate Peanut Butter', 'New York Cherry Cheesecake', 'Sea Salt Caramel Fudge',
    'Tiger', 'All Canadian Moose', 'Mint Chocolate Chip', 'Bubble Gum', 'Cotton Candy',
    'Saskatoon Pie', 'Haskap Prairie Berry', 'Cookie Beast', 'Birthday Cake',
    'Campfire Smores', 'Nanaimo Brownie', 'Moon Mist', 'Shark Attack'
  ];
  // Same rule the build script uses to turn a name into a data-flavour value.
  function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  // byStatus is optional: on first paint we don't know stock yet, so we just
  // take this week's pick. Once statuses load we run again and step past
  // anything that's sold out — promoting a flavour nobody can buy is worse
  // than promoting the next one along.
  function pickFotw(byStatus) {
    if (!fotwEl) return;
    var start = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    for (var i = 0; i < FOTW_FLAVOURS.length; i++) {
      var name = FOTW_FLAVOURS[(start + i) % FOTW_FLAVOURS.length];
      if (!byStatus || byStatus[slugify(name)] !== 'out_of_stock') {
        fotwEl.textContent = name;
        return;
      }
    }
    // Everything on the shortlist is out — leave this week's pick as-is.
  }
  pickFotw(null);

  /* ---------- Dynamic year + years-scooping ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  var yearsStatEl = document.getElementById('yearsStat');
  if (yearsStatEl) yearsStatEl.setAttribute('data-count', Math.max(1, new Date().getFullYear() - 1995));

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('in-view');
        if (el.classList.contains('reveal-stagger')) {
          Array.prototype.forEach.call(el.children, function (child, i) {
            child.style.transitionDelay = (i * 90) + 'ms';
          });
        }
        el.querySelectorAll('.count-up').forEach(startCount);
        io.unobserve(el);
      });
    }, { threshold: 0.18 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    document.querySelectorAll('.count-up').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  }

  /* ---------- Count-up ---------- */
  function startCount(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseInt(el.getAttribute('data-count'), 10);
    var dur = 1400, t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Flavour card 3D tilt (fine pointers only) ---------- */
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.flavour-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-6px)';
        card.style.boxShadow = '0 14px 0 rgba(58,35,24,0.9)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ---------- Hero photo 3D tilt (fine pointers only) ---------- */
  var heroPhoto = document.querySelector('.hero-photo');
  var heroSection = document.querySelector('.hero');
  if (heroPhoto && heroSection && !reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', function (e) {
      var r = heroSection.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      heroPhoto.style.setProperty('--tilt-y', (x * 9) + 'deg');
      heroPhoto.style.setProperty('--tilt-x', (-y * 7) + 'deg');
    });
    heroSection.addEventListener('mouseleave', function () {
      heroPhoto.style.setProperty('--tilt-y', '0deg');
      heroPhoto.style.setProperty('--tilt-x', '0deg');
    });
  }

  /* ---------- Sprinkles canvas (home hero only) ---------- */
  var canvas = document.getElementById('sprinkles');
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext('2d');
    var colors = ['#FF5D8F', '#4FC9B1', '#FFAE52', '#8C5BD8', '#8ED8F0', '#FFD93D'];
    var sprinkles = [];
    var W, H;
    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    var COUNT = Math.min(70, Math.floor(window.innerWidth / 18));
    for (var i = 0; i < COUNT; i++) {
      sprinkles.push({
        x: Math.random(), y: Math.random(),
        len: 8 + Math.random() * 10,
        w: 3 + Math.random() * 2.4,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        vy: 0.0002 + Math.random() * 0.00045,
        vx: (Math.random() - 0.5) * 0.00018,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.35 + Math.random() * 0.45
      });
    }
    var running = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
      }).observe(canvas);
    }
    function draw() {
      if (running) {
        ctx.clearRect(0, 0, W, H);
        sprinkles.forEach(function (s) {
          s.y += s.vy; s.x += s.vx; s.angle += s.spin;
          if (s.y > 1.05) { s.y = -0.05; s.x = Math.random(); }
          if (s.x > 1.05) s.x = -0.05;
          if (s.x < -0.05) s.x = 1.05;
          ctx.save();
          ctx.translate(s.x * W, s.y * H);
          ctx.rotate(s.angle);
          ctx.globalAlpha = s.alpha;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(-s.len / 2, -s.w / 2, s.len, s.w, s.w / 2);
          else ctx.rect(-s.len / 2, -s.w / 2, s.len, s.w);
          ctx.fill();
          ctx.restore();
        });
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- Live flavour availability ----------
     Staff set each flavour's status from admin.html. We only fetch the
     exceptions (anything not "in stock") and decorate those. If the request
     fails for any reason the page simply stays as it is — every flavour reads
     as available, exactly like it did before this feature existed. */
  var cfg = window.ICEHUT_SUPABASE;
  var stockTargets = document.querySelectorAll('[data-flavour]');
  if (cfg && cfg.url && cfg.url.indexOf('REPLACE_ME') === -1 && stockTargets.length) {
    var LABELS = { out_of_stock: 'Out of stock', getting_low: 'Almost out' };

    // Only the exceptions are stored, so this is one small request and no SDK —
    // visitors download nothing extra. An empty table means everything is in.
    fetch(cfg.url + '/rest/v1/flavour_status?select=slug,status', {
      headers: {
        apikey: cfg.publishableKey,
        Authorization: 'Bearer ' + cfg.publishableKey
      }
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (rows) {
        if (!rows || !rows.length) return;

        var byStatus = {};
        rows.forEach(function (row) { byStatus[row.slug] = row.status; });

        pickFotw(byStatus);   // don't spotlight a flavour that's sold out

        // Counted as a set of slugs, not of elements: a flavour can appear both
        // as a spotlight card and as an A–Z entry, and that's still one flavour.
        var outSlugs = {};
        Array.prototype.forEach.call(stockTargets, function (el) {
          var slug = el.getAttribute('data-flavour');
          var status = byStatus[slug];
          if (!LABELS[status]) return;
          if (status === 'out_of_stock') outSlugs[slug] = true;

          el.classList.add(status === 'out_of_stock' ? 'flavour-out' : 'flavour-low');

          var badge = document.createElement('span');
          badge.className = 'stock-badge stock-badge--' + (status === 'out_of_stock' ? 'out' : 'low');
          badge.textContent = LABELS[status];

          // Cards get the badge pinned in the corner; A–Z entries get it inline
          // after the name so the alphabetical rhythm isn't broken.
          var dt = el.querySelector('dt');
          if (dt) dt.appendChild(badge);
          else el.appendChild(badge);
        });

        // Only the full A–Z board gets the summary note; it'd be misleading on
        // the 8-card teaser, which isn't showing the whole board.
        var note = document.getElementById('stockNote');
        var outCount = Object.keys(outSlugs).length;
        if (note && outCount) {
          note.textContent = outCount === 1
            ? '1 flavour is off the board right now.'
            : outCount + ' flavours are off the board right now.';
          note.hidden = false;
        }
      })
      .catch(function () { /* silent: the board just shows everything as usual */ });
  }
})();
