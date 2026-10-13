/* AJEENTY — shared by every page: business facts, live opening status, language, WhatsApp links,
   and the "into the furn" transition that plays when someone heads to the menu. */
window.AJ = (() => {
  'use strict';

  /* ---------- business facts: edit here, every page follows ---------- */
  const WA = '96176770026';
  // Opening hours by weekday (0 = Sunday … 6 = Saturday), 24h clock, Beirut time. null = closed.
  const HOURS = { 0: null, 1: [7, 20], 2: [7, 20], 3: [7, 20], 4: [7, 20], 5: [7, 20], 6: [7, 20] };
  const TZ = 'Asia/Beirut';
  const LANG_KEY = 'ajeenty-lang';

  const W = {
    en: {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      time: h => (h % 12 || 12) + (h < 12 ? ' AM' : ' PM'),
      open: c => `Open now · until ${c}`, soon: c => `Closing soon · ${c}`,
      later: o => `Opens today at ${o}`, tomorrow: o => `Closed · opens tomorrow ${o}`, day: (d, o) => `Closed · opens ${d} ${o}`,
      waHello: 'Marhaba AJEENTY!', waGroup: 'Marhaba AJEENTY! I’d like to plan a group order.',
      firing: 'Firing up the menu'
    },
    ar: {
      days: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
      time: h => (h % 12 || 12) + (h < 12 ? ' الصبح' : ' المسا'),
      open: c => `فاتحين هلّق · لـ ${c}`, soon: c => `منسكّر قريب · ${c}`,
      later: o => `منفتح اليوم ${o}`, tomorrow: o => `مسكّرين · منفتح بكرا ${o}`, day: (d, o) => `مسكّرين · منفتح ${d} ${o}`,
      waHello: 'مرحبا عجينتي!', waGroup: 'مرحبا عجينتي! بدي رتّب طلبية لجمعة.',
      firing: 'عم نحمّي الفرن'
    }
  };

  /* ---------- language ---------- */
  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'ar' || q === 'en') { try { localStorage.setItem(LANG_KEY, q); } catch (e) {} return q; }  // a shared ?lang= link sets the language for the whole visit
    try { const s = localStorage.getItem(LANG_KEY); if (s === 'ar' || s === 'en') return s; } catch (e) {}
    return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
  }
  function saveLang(lg) {
    try { localStorage.setItem(LANG_KEY, lg); } catch (e) {}
    const u = new URL(location.href);
    if (u.searchParams.has('lang')) { u.searchParams.set('lang', lg); history.replaceState(null, '', u); }
  }

  /* ---------- live opening status (Beirut time) ---------- */
  function beirutNow() {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), mins: (+get('hour') % 24) * 60 + (+get('minute')) };
  }
  function status(lang) {
    const t = W[lang] || W.en, { day, mins } = beirutNow(), h = HOURS[day];
    if (h && mins >= h[0] * 60 && mins < h[1] * 60) return { open: true, day, text: (h[1] * 60 - mins <= 30 ? t.soon : t.open)(t.time(h[1])) };
    if (h && mins < h[0] * 60) return { open: false, day, text: t.later(t.time(h[0])) };
    let d = 1; while (d < 8 && !HOURS[(day + d) % 7]) d++;
    const nd = (day + d) % 7, o = t.time(HOURS[nd][0]);
    return { open: false, day, text: d === 1 ? t.tomorrow(o) : t.day(t.days[nd], o) };
  }
  function paintStatus(lang) {
    const s = status(lang);
    document.querySelectorAll('[data-status]').forEach(el => {
      el.textContent = s.text; el.classList.toggle('open', s.open); el.classList.toggle('closed', !s.open);
    });
    document.querySelectorAll('.hours [data-days]').forEach(row => row.classList.toggle('today', row.dataset.days.split(',').map(Number).includes(s.day)));
    return s;
  }

  /* ---------- WhatsApp links with a greeting in the visitor's language ---------- */
  function waLinks(lang) {
    const t = W[lang] || W.en;
    document.querySelectorAll('[data-wa]').forEach(a => {
      a.href = `https://wa.me/${WA}?text=${encodeURIComponent(a.dataset.wa === 'group' ? t.waGroup : t.waHello)}`;
    });
  }

  /* ---------- "into the furn" transition ---------- */
  const OVEN = `<svg viewBox="0 0 240 300" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="intoGlow" cx="120" cy="270" r="120" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFD07A"/><stop offset=".3" stop-color="#F08A37"/><stop offset=".62" stop-color="#9A3A14" stop-opacity=".7"/><stop offset="1" stop-color="#1E261F" stop-opacity="0"/></radialGradient>
      <linearGradient id="intoFlame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF4C8"/><stop offset=".38" stop-color="#FFC247"/><stop offset=".78" stop-color="#F26A1B"/><stop offset="1" stop-color="#C2320F" stop-opacity=".1"/></linearGradient>
      <linearGradient id="intoWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3B57E"/><stop offset="1" stop-color="#A9743F"/></linearGradient>
      <clipPath id="intoMouth"><path d="M30 290 V120 A90 90 0 0 1 210 120 V290 Z"/></clipPath>
    </defs>
    <path d="M30 290 V120 A90 90 0 0 1 210 120 V290 Z" fill="#1A211B"/>
    <g clip-path="url(#intoMouth)">
      <ellipse class="into-glow" cx="120" cy="290" rx="130" ry="120" fill="url(#intoGlow)"/>
      <g>
        <path class="flame" d="M46 286 C38 262 52 246 50 226 C62 240 72 220 68 200 C86 224 92 256 86 286 Z" fill="url(#intoFlame)"/>
        <path class="flame" d="M154 286 C148 262 162 246 160 228 C172 242 186 222 182 204 C198 230 200 260 194 286 Z" fill="url(#intoFlame)"/>
        <path class="flame" d="M96 286 C92 270 102 260 102 246 C112 258 118 270 114 286 Z" fill="url(#intoFlame)"/>
      </g>
    </g>
    <path d="M30 292 V120 A90 90 0 0 1 210 120 V292" fill="none" stroke="#E7D6C0" stroke-width="3"/>
    <path d="M44 292 V122 A76 76 0 0 1 196 122 V292" fill="none" stroke="rgba(231,214,192,.3)" stroke-width="1.5"/>
    <path d="M120 86 C103 74 99 62 106 56 C112 51 118.6 53.6 120 60 C121.4 53.6 128 51 134 56 C141 62 137 74 120 86 Z" fill="#B8663E"/>
    <g class="into-steam" fill="none" stroke="#F4EBDD" stroke-width="2.6" stroke-linecap="round">
      <path d="M104 238 c-5 -7 5 -11 0 -18 c-5 -7 5 -11 0 -18"/><path d="M120 234 c-5 -7 5 -11 0 -18 c-5 -7 5 -11 0 -18"/><path d="M136 238 c-5 -7 5 -11 0 -18 c-5 -7 5 -11 0 -18"/>
    </g>
    <g class="into-peel">
      <path d="M160 272 L300 340" stroke="url(#intoWood)" stroke-width="8" stroke-linecap="round"/>
      <ellipse cx="120" cy="268" rx="50" ry="13" fill="url(#intoWood)"/>
      <ellipse cx="120" cy="265" rx="40" ry="10.5" fill="#A8552F"/>
      <ellipse cx="120" cy="262" rx="40" ry="10.5" fill="#D9A46A"/>
      <path d="M86 262 A34 8.4 0 0 1 120 253.6 V270.4 A34 8.4 0 0 1 86 262 Z" fill="#4F5533"/>
      <path d="M120 253.6 A34 8.4 0 0 1 154 262 A34 8.4 0 0 1 120 270.4 Z" fill="#F1E2C4"/>
      <g fill="#A9A36A"><circle cx="100" cy="260" r="1.1"/><circle cx="108" cy="264" r="1"/><circle cx="96" cy="264" r=".9"/><circle cx="112" cy="258" r="1"/></g>
      <g fill="#D9A46A" opacity=".8"><ellipse cx="132" cy="260" rx="3" ry="1.1"/><ellipse cx="142" cy="264" rx="3.4" ry="1.2"/><ellipse cx="128" cy="266" rx="2.6" ry="1"/></g>
    </g>
  </svg>`;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMenuUrl = u => /\/menu\/(index\.html)?$/.test(u.pathname);
  let busy = false, safety = 0;

  function overlay(lang) {
    const el = document.createElement('div');
    el.className = 'into';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<div class="into-arch"></div><div class="into-oven">${OVEN}<p class="into-txt">${(W[lang] || W.en).firing}</p></div>`;
    document.body.appendChild(el);
    return el;
  }
  function reset() {
    busy = false; clearTimeout(safety);
    document.querySelectorAll('.into.on').forEach(el => el.remove());
  }
  function goMenu(href, x, y) {
    if (busy) return; busy = true;
    const el = overlay(document.documentElement.lang || 'en');
    const w = innerWidth, h = innerHeight;
    const r = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y));
    el.style.setProperty('--x', x + 'px');
    el.style.setProperty('--y', y + 'px');
    el.style.setProperty('--d', Math.ceil(2 * r + 40) + 'px');
    void el.offsetWidth;
    el.classList.add('on');
    try { sessionStorage.setItem('aj-into', '1'); } catch (e) {}
    setTimeout(() => { location.href = href; }, 900);
    safety = setTimeout(reset, 8000);
  }
  // Leaving for the menu from any other page
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    let u; try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.origin !== location.origin || !isMenuUrl(u) || isMenuUrl(new URL(location.href)) || reduced()) return;
    e.preventDefault();
    let x = e.clientX, y = e.clientY;
    if (!x && !y) { const b = a.getBoundingClientRect(); x = b.left + b.width / 2; y = b.top + b.height / 2; }
    goMenu(u.href, x, y);
  });
  // Coming back with the browser's Back button must never show a frozen overlay
  addEventListener('pageshow', e => { if (e.persisted) reset(); });
  // Arriving on the menu: the overlay is already painted (see the menu's <head>); clear it after it plays
  if (document.documentElement.classList.contains('arriving')) {
    const done = () => document.documentElement.classList.remove('arriving');
    setTimeout(done, 900);
  }

  /* ---------- online orders (sent to the Google Sheet, tracked on the site) ---------- */
  // To switch online ordering on: paste the Google Apps Script web-app URL (it ends in /exec) between the quotes.
  const ORDER_URL = 'https://script.google.com/macros/s/AKfycbxXNES7iL_Avh0L0pqmjkdikGyg1xyRxmWr496c3ZjpQ-dkT7l26PIIvR423qdP4RW_/exec';
  // While true, every online order is ALSO opened in WhatsApp (with its order number), on top of the Sheet.
  // Set to false once you only want the Sheet.
  const ALSO_WHATSAPP = true;
  const LIVE_HOSTS = ['ajeenty.com', 'www.ajeenty.com'];
  const ORDER_KEY = 'ajeenty-order-v1';
  const FINAL = ['Picked up', 'Delivered', 'Cancelled'];
  const STEPS = {
    pickup: ['Received', 'Preparing', 'Ready for pickup', 'Picked up'],
    delivery: ['Received', 'Preparing', 'On the way', 'Delivered']
  };
  // Keys must match the Status dropdown in the Sheet exactly.
  const ST = {
    en: {
      'Received': ['Order received', 'We have your order.'],
      'Preparing': ['Preparing', 'It’s in the oven.'],
      'Ready for pickup': ['Ready for pickup', 'Come grab it while it’s hot.'],
      'On the way': ['On the way', 'Your order is heading to you.'],
      'Picked up': ['Picked up', 'Sahtein, and thank you!'],
      'Delivered': ['Delivered', 'Sahtein, and thank you!'],
      'Cancelled': ['Cancelled', 'This order was cancelled. Call us on 76 77 00 26 if that’s unexpected.']
    },
    ar: {
      'Received': ['وصل طلبك', 'طلبك عنّا.'],
      'Preparing': ['عم نحضّرو', 'عم ينخبز هلّق.'],
      'Ready for pickup': ['جاهز للاستلام', 'تعا خدو وهوّي سخن.'],
      'On the way': ['عالطريق', 'طلبك جايي لعندك.'],
      'Picked up': ['استلمتو', 'صحتين، ويسلمو!'],
      'Delivered': ['وصل', 'صحتين، ويسلمو!'],
      'Cancelled': ['انلغى', 'الطلب انلغى. اتصل فينا على 76 77 00 26 إذا في شي غلط.']
    }
  };
  // live:     orders go to the Sheet.
  // whatsapp: on ajeenty.com before the Sheet is connected, so a real order is never lost.
  // preview:  anywhere else (your computer, a test address): nothing is sent, statuses move on their own.
  const orderMode = () => ORDER_URL ? 'live' : (LIVE_HOSTS.includes(location.hostname) ? 'whatsapp' : 'preview');
  const alsoWa = () => ALSO_WHATSAPP && orderMode() === 'live';
  const isFinal = s => FINAL.includes(s);
  const label = (s, lang) => ((ST[lang] || ST.en)[s] || [s])[0];
  const chipLabel = (s, lang) => s === 'Received' ? (lang === 'ar' ? 'وصل' : 'Received') : label(s, lang);
  function getOrder() {
    try {
      const o = JSON.parse(localStorage.getItem(ORDER_KEY) || 'null');
      if (o && /^[A-Z0-9]{8}$/.test(o.id) && Date.now() - (o.at || 0) < 864e5) return o;  // forget orders after a day
    } catch (e) {}
    return null;
  }
  function setOrder(o) { try { o ? localStorage.setItem(ORDER_KEY, JSON.stringify(o)) : localStorage.removeItem(ORDER_KEY); } catch (e) {} }
  const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32]).join('');
  async function sendOrder(payload) {
    if (orderMode() !== 'live') { await new Promise(r => setTimeout(r, 700)); return { ok: true, id: newId(), preview: true }; }
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      // No Content-Type header on purpose: a plain-text POST skips the CORS check that Google Apps Script can't answer.
      const r = await fetch(ORDER_URL, { method: 'POST', body: JSON.stringify(payload), signal: ctrl.signal });
      const d = await r.json();
      if (!d || !d.ok || !/^[A-Z0-9]{8}$/.test(d.id || '')) throw new Error((d && d.error) || 'not saved');
      return d;
    } finally { clearTimeout(timer); }
  }
  async function fetchStatus(o) {
    if (o.preview || orderMode() !== 'live') {
      const steps = STEPS[o.type] || STEPS.pickup;
      return { ok: true, type: o.type, status: steps[Math.min(steps.length - 1, Math.floor((Date.now() - o.at) / 6000))] };
    }
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const r = await fetch(`${ORDER_URL}?id=${encodeURIComponent(o.id)}`, { cache: 'no-store', signal: ctrl.signal });
      return await r.json();
    } finally { clearTimeout(timer); }
  }
  async function refreshOrder() {
    const o = getOrder(); if (!o) return null;
    try {
      const d = await fetchStatus(o);
      if (d && d.ok) { o.status = String(d.status || 'Received'); if (d.type === 'pickup' || d.type === 'delivery') o.type = d.type; o.checked = Date.now(); o.offline = false; o.missing = false; }
      else { o.missing = true; o.offline = false; }
    } catch (e) { o.offline = true; }
    setOrder(o);
    return o;
  }
  const chipVisible = o => !!o && !(isFinal(o.status) && Date.now() - (o.checked || o.at) > 2 * 3600e3);

  // "Your order · Preparing" chip on pages other than the menu (the menu draws its own)
  let chipTimer = 0;
  function orderChip(lang) {
    if (document.body.dataset.page === 'menu') return;
    const o = getOrder();
    let a = document.getElementById('orderChip');
    if (!chipVisible(o)) { if (a) a.remove(); document.body.classList.remove('has-order'); return; }
    if (!a) { a = document.createElement('a'); a.id = 'orderChip'; a.className = 'order-chip'; document.body.appendChild(a); }
    a.href = `${document.body.dataset.root || ''}menu/index.html?order=${o.id}`;
    a.innerHTML = `<span class="dot" aria-hidden="true"></span><span>${lang === 'ar' ? 'طلبك' : 'Your order'} · ${chipLabel(o.status || 'Received', lang)}</span>`;
    a.classList.toggle('final', isFinal(o.status));
    document.body.classList.add('has-order');
    clearTimeout(chipTimer);
    if (!isFinal(o.status)) chipTimer = setTimeout(async () => { await refreshOrder(); orderChip(document.documentElement.lang || 'en'); }, o.preview ? 3000 : 30000);
  }

  return {
    WA, HOURS, pickLang, saveLang, status, paintStatus, waLinks, OVEN, now: beirutNow,
    order: { mode: orderMode, alsoWa, get: getOrder, set: setOrder, send: sendOrder, refresh: refreshOrder, isFinal, label, chipLabel, STEPS, ST, chipVisible, chip: orderChip }
  };
})();
