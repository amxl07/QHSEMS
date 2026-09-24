/* QHSEMS — site behaviour. No dependencies. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- mobile nav ---------- */
  var toggle = $('.nav-toggle');
  var nav = $('#primary-nav');
  if (toggle && nav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    };
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setNav(false);
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open') || !e.target.closest) return;
      if (!e.target.closest('.site-header')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); toggle.focus(); }
    });
  }

  /* ---------- one authored reveal ---------- */
  var targets = $$('.reveal');
  if (targets.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var group = entry.target.parentElement ? $$('.reveal', entry.target.parentElement) : [];
        var i = group.indexOf(entry.target);
        entry.target.style.setProperty('--d', (i > 0 ? Math.min(i, 5) * 70 : 0) + 'ms');
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* ---------- enquiry list (shared between catalogue and contact form) ---------- */
  var KEY = 'qhsems.enquiry.v1';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* private mode */ }
  }

  var basket = $('#enquiry-panel');
  var scrim = $('#enquiry-scrim');
  var basketBtn = $('#enquiry-btn');
  var basketList = $('#enquiry-list');
  var basketEmpty = $('#enquiry-empty');
  var lastFocus = null;

  function paintCount() {
    var n = read().length;
    if (!basketBtn) return;
    basketBtn.setAttribute('data-count', String(n));
    var slot = $('.n', basketBtn);
    if (slot) slot.textContent = String(n);
    basketBtn.setAttribute('aria-label', n === 1 ? '1 programme on your enquiry list' : n + ' programmes on your enquiry list');
    if (n === 0 && !basket) basketBtn.hidden = true;
    else basketBtn.hidden = false;
  }

  function paintPicked() {
    var codes = read().map(function (i) { return i.code; });
    $$('.prog').forEach(function (li) {
      var on = codes.indexOf(li.getAttribute('data-code')) > -1;
      li.classList.toggle('is-picked', on);
      var btn = $('.prog__add', li);
      if (btn) {
        btn.setAttribute('aria-pressed', String(on));
        // The glyph is decorative; the name has to live on the button itself.
        ($('span', btn) || btn).textContent = on ? '✓' : '+';
        btn.setAttribute('aria-label',
          (on ? 'Remove ' : 'Add ') + li.getAttribute('data-name') + (on ? ' from' : ' to') + ' your enquiry list');
      }
    });
  }

  function paintBasket() {
    if (!basketList) return;
    var list = read();
    basketList.innerHTML = '';
    if (basketEmpty) basketEmpty.hidden = list.length > 0;
    list.forEach(function (item) {
      var li = document.createElement('li');
      var code = document.createElement('span');
      code.className = 'code';
      code.textContent = item.code;
      var name = document.createElement('span');
      name.textContent = item.name;
      var rm = document.createElement('button');
      rm.type = 'button';
      rm.innerHTML = '&times;';
      rm.title = 'Remove ' + item.name;
      rm.setAttribute('aria-label', 'Remove ' + item.name);
      rm.addEventListener('click', function () { remove(item.code); });
      li.appendChild(code); li.appendChild(name); li.appendChild(rm);
      basketList.appendChild(li);
    });
  }

  function repaint() { paintCount(); paintPicked(); paintBasket(); }

  function add(code, name) {
    var list = read();
    if (list.some(function (i) { return i.code === code; })) return;
    list.push({ code: code, name: name });
    write(list); repaint();
  }
  function remove(code) {
    write(read().filter(function (i) { return i.code !== code; }));
    repaint();
  }

  function openBasket() {
    if (!basket) return;
    lastFocus = document.activeElement;
    basket.classList.add('is-open');
    if (scrim) scrim.classList.add('is-open');
    basket.setAttribute('aria-hidden', 'false');
    var close = $('.basket__close', basket);
    if (close) close.focus();
    document.addEventListener('keydown', onEsc);
  }
  function closeBasket() {
    if (!basket) return;
    basket.classList.remove('is-open');
    if (scrim) scrim.classList.remove('is-open');
    basket.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', onEsc);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onEsc(e) { if (e.key === 'Escape') closeBasket(); }

  if (basketBtn) {
    basketBtn.addEventListener('click', function () {
      // The panel only lives on the catalogue page; elsewhere the button takes you there.
      if (basket) openBasket();
      else window.location.href = 'training.html';
    });
  }
  if (scrim) scrim.addEventListener('click', closeBasket);
  if (basket) {
    var closeBtn = $('.basket__close', basket);
    if (closeBtn) closeBtn.addEventListener('click', closeBasket);
    var clearBtn = $('#enquiry-clear');
    if (clearBtn) clearBtn.addEventListener('click', function () { write([]); repaint(); });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.prog__add') : null;
    if (!btn) return;
    var li = btn.closest('.prog');
    var code = li.getAttribute('data-code');
    if (li.classList.contains('is-picked')) remove(code);
    else add(code, li.getAttribute('data-name'));
  });

  /* ---------- catalogue filter ---------- */
  var search = $('#catalogue-search');
  if (search) {
    var clear = $('#catalogue-clear');
    var count = $('#catalogue-count');
    var empty = $('#catalogue-empty');
    var chips = $$('.chip');
    var groups = $$('.cat-group');
    var track = 'all';
    var total = $$('.prog').length;

    var apply = function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      groups.forEach(function (group) {
        var inTrack = track === 'all' || group.getAttribute('data-track') === track;
        var visibleHere = 0;
        $$('.prog', group).forEach(function (li) {
          var hit = inTrack && (q === '' || li.getAttribute('data-search').indexOf(q) > -1);
          li.hidden = !hit;
          if (hit) visibleHere++;
        });
        group.hidden = visibleHere === 0;
        shown += visibleHere;
      });
      if (count) {
        count.innerHTML = shown === 0
          ? 'No programmes match that search.'
          : 'Showing <b>' + shown + '</b> of <b>' + total + '</b> programmes.';
      }
      if (empty) empty.hidden = shown !== 0;
      if (clear) clear.classList.toggle('is-on', search.value !== '');
    };

    search.addEventListener('input', apply);
    if (clear) clear.addEventListener('click', function () { search.value = ''; search.focus(); apply(); });
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        track = chip.getAttribute('data-track');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply();
      });
    });
    var resetBtn = $('#catalogue-reset');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      search.value = ''; track = 'all';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-track') === 'all')); });
      apply(); search.focus();
    });
    apply();
  }

  /* ---------- contact form ---------- */
  var form = $('#enquiry-form');
  if (form) {
    // ?type=wellness arrives from the Healthy Living page.
    var type = $('#f-type');
    if (type && /[?&]type=wellness/.test(window.location.search)) type.value = 'Heart of Healthy Living (wellness programme)';

    var programmes = $('#f-programmes');
    if (programmes) {
      var picked = read();
      if (picked.length) {
        programmes.value = picked.map(function (i) { return i.code + '  ' + i.name; }).join('\n');
        var note = $('#programmes-note');
        if (note) note.textContent = picked.length + ' programme' + (picked.length === 1 ? '' : 's') + ' carried over from the catalogue. Edit freely.';
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[data-required]', form).forEach(function (input) {
        var field = input.closest('.field');
        var bad = !input.value.trim() || (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
        field.classList.toggle('is-error', bad);
        input.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok) return;

      var get = function (id) { var el = $('#' + id); return el ? el.value.trim() : ''; };
      var body = [
        'Organisation: ' + (get('f-company') || 'Individual'),
        'Contact: ' + get('f-name'),
        'Role: ' + get('f-role'),
        'Email: ' + get('f-email'),
        'Phone: ' + get('f-phone'),
        'Country / site: ' + get('f-location'),
        'Enquiry type: ' + get('f-type'),
        'Industry: ' + get('f-industry'),
        'Approx. people: ' + get('f-headcount'),
        '',
        'Programmes of interest:',
        get('f-programmes') || '(none selected)',
        '',
        'Requirement:',
        get('f-message')
      ].join('\n');

      var to = form.getAttribute('data-mailto');
      var subject = 'Enquiry from ' + (get('f-company') || get('f-name') || 'website') + ' — ' + (get('f-type') || 'QHSE');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

      var status = $('#form-status');
      if (status) { status.classList.add('is-on'); status.focus(); }
    });

    $$('[data-required]', form).forEach(function (input) {
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field.classList.contains('is-error') && input.value.trim()) {
          field.classList.remove('is-error');
          input.setAttribute('aria-invalid', 'false');
        }
      });
    });
  }

  repaint();

  /* ---------- current year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
