/* AJEENTY — homepage behaviour: words in both languages, the live headline, the oven video, map,
   floating "Order online". Hours, opening status, WhatsApp number and the menu transition live in common.js. */
(() => {
  'use strict';

  const MAP = { lat: 33.8799516, lng: 35.5068473 };
  const $ = s => document.querySelector(s);

  /* ---------- words ---------- */
  const T = {
    en: {
      skip: 'Skip to content', navMenu: 'Menu', navVisit: 'Visit us', orderOnline: 'Order online',
      hlOpen: ['Beirut,', 'we’re open.'], hlToday: o => ['Beirut,', `see you at ${o}.`], hlTomorrow: ['Beirut,', 'see you tomorrow.'], hlDay: d => ['Beirut,', `see you ${d}.`],
      heroP: 'Man’oushe and mo3ajanat from our oven in Ras El Nabeh. Order online for pickup or delivery, or grab it hot from the counter.',
      findUs: 'Find us', hoursShort: 'Daily, 7 AM – 8 PM · Sun to 7 PM', deliveryShort: 'Pickup and delivery',
      videoAlt: 'Our oven: a man’oushe is spread by hand, slid in on the peel and baked', pause: 'Pause the video', play: 'Play the video',
      freshAlt: 'A cheese akawi man’oushe, fresh out of the oven', dAkawi: 'Cheese akawi', from: 'from', lbp: 'LBP',
      picksTitle: 'Out of the oven.', picksP: 'A few favourites from the counter. Tap one to see it on the menu and add it to your order.', fullMenu: 'See the full menu',
      pZaatar: 'Zaatar man’oushe', pLahme: 'Lahme baajin', pSpinach: 'Spinach fatayer', pSfiha: 'Sfiha', pPizza: 'Mini pizzas', pMixed: 'Mixed dozen', perDozen: 'a dozen',
      altZaatar: 'Zaatar man’oushe baking on the oven floor', altLahme: 'A whole lahme baajin, just baked', altSpinach: 'Trays of spinach fatayer', altSfiha: 'Open meat sfiha on a tray',
      altPizza: 'Mini pizzas with melted cheese and an olive', altMixed: 'Our counter, full of mo3ajanat', altPeel: 'Two cheese man’oushe on a wooden peel, ready for the oven', altOven: 'The AJEENTY brick oven, lit, with mini pizzas inside',
      storyMeans: 'means “my dough”.', storyP: 'Fresh dough, a hot oven, and every topping spread by hand. That’s the whole idea.',
      jrTitle: 'Jreesh dough for manakish', jrP: 'Whole-wheat dough, for', crowdLink: 'Order by the dozen',
      gatherTitle: 'For your next gathering.', gatherP: 'A mixed dozen for the family, pastries for the office, or a spread for the weekend. Tell us what you have in mind and we’ll help you choose.', gatherCta: 'Plan a group order', altGather: 'A tray of spinach and pizza shakhtoura',
      visitTitle: 'Real taste has an address.', addrA: 'Haraty Street, Moazzen Building', addrB: 'Bchara al Khoury, Ras El Nabeh, Beirut',
      hoursLabel: 'Opening hours', monSat: 'Monday to Saturday', monSatH: '7:00 AM – 8:00 PM', sun: 'Sunday', sunH: '7:00 AM – 7:00 PM', closed: 'Closed', today: 'Today',
      directions: 'Get directions', callUs: 'Call us', lblMobile: 'Mobile and WhatsApp', lblLand: 'Landline', lblEmail: 'Email',
      mapAria: 'Open AJEENTY’s location in Google Maps', mapHint: 'Open in Google Maps',
      footTag: 'Fresh dough. Hot oven.', fVisit: 'Visit', fAddr: 'Haraty Street, Moazzen Building<br>Bchara al Khoury, Beirut',
      fHours: 'Hours', fHoursP: 'Monday to Saturday<br>7:00 AM – 8:00 PM<br>Sunday 7:00 AM – 7:00 PM', fOrder: 'Call us', fMobile: 'Mobile and WhatsApp', fLand: 'Landline', gmaps: 'Google Maps',
      title: 'AJEENTY | Man’oushe & mo3ajanat in Ras El Nabeh, Beirut'
    },
    ar: {
      skip: 'انتقل للمحتوى', navMenu: 'المنيو', navVisit: 'زورونا', orderOnline: 'اطلب أونلاين',
      hlOpen: ['بيروت،', 'فتحنا.'], hlToday: o => ['بيروت،', `منشوفكن الساعة ${o}.`], hlTomorrow: ['بيروت،', 'منشوفكن بكرا.'], hlDay: d => ['بيروت،', `منشوفكن ${d}.`],
      heroP: 'مناقيش ومعجنات طالعين من فرننا براس النبع. اطلب أونلاين استلام أو دليفري، أو مرّ خدهن سخنين من المحل.',
      findUs: 'كيف توصلنا', hoursShort: 'كل يوم، 7 الصبح – 8 المسا · الأحد لـ 7 المسا', deliveryShort: 'استلام ودليفري',
      videoAlt: 'فرننا: منقوشة عم تنفرد بالإيد، بتفوت عالمطرحة وبتنخبز', pause: 'وقّف الفيديو', play: 'شغّل الفيديو',
      freshAlt: 'منقوشة جبنة عكاوي طالعة سخنة من الفرن', dAkawi: 'جبنة عكاوي', from: 'من', lbp: 'ل.ل.',
      picksTitle: 'طالع من الفرن.', picksP: 'شوية من الأصناف يلي بتحبوها. اكبس على أي صنف لتشوفه بالمنيو وتزيده عطلبك.', fullMenu: 'شوف المنيو كلّه',
      pZaatar: 'منقوشة زعتر', pLahme: 'لحم بعجين', pSpinach: 'فطاير سبانخ', pSfiha: 'صفيحة', pPizza: 'بيتزا صغار', pMixed: 'دزينة مشكّل', perDozen: 'الدزينة',
      altZaatar: 'مناقيش زعتر عم تنخبز بأرض الفرن', altLahme: 'لحم بعجين طالع هلّق من الفرن', altSpinach: 'صواني فطاير سبانخ', altSfiha: 'صفيحة لحمة بالصينية',
      altPizza: 'بيتزا صغار بجبنة دايبة وحبة زيتون', altMixed: 'البرّاد عنّا مليان معجنات', altPeel: 'منقوشتين جبنة عالمطرحة، جاهزين للفرن', altOven: 'فرن عجينتي الحجر، والع وفيه بيتزا صغار',
      storyMeans: 'عجينة طازة، فرن حامي، وإيد بتعرف شغلها.', storyP: 'كل منقوشة بتنفرد بالإيد وبتنخبز وحدة وحدة. وهيدا كل شي.',
      jrTitle: 'عجينة جريش للمناقيش', jrP: 'عجينة قمحة كاملة، بزيادة', crowdLink: 'اطلب بالدزينة',
      gatherTitle: 'للّمة الجاية.', gatherP: 'دزينة مشكّل للعيلة، معجنات للشغل، أو سفرة لويكند. قلّنا شو ببالك ومنساعدك تختار.', gatherCta: 'رتّب طلبية لجمعة', altGather: 'صينية شختورة سبانخ وبيتزا',
      visitTitle: 'الطعمة الأصلية إلها عنوان.', addrA: 'شارع حاراتي، بناية المؤذن', addrB: 'بشارة الخوري، راس النبع، بيروت',
      hoursLabel: 'أوقات الدوام', monSat: 'الإثنين – السبت', monSatH: '7:00 الصبح – 8:00 المسا', sun: 'الأحد', sunH: '7:00 الصبح – 7:00 المسا', closed: 'مسكّرين', today: 'اليوم',
      directions: 'دلّني عالطريق', callUs: 'اتصل فينا', lblMobile: 'خلوي وواتساب', lblLand: 'أرضي', lblEmail: 'إيميل',
      mapAria: 'افتح موقع عجينتي على Google Maps', mapHint: 'افتح على Google Maps',
      footTag: 'عجينة طازة. فرن حامي.', fVisit: 'العنوان', fAddr: 'شارع حاراتي، بناية المؤذن<br>بشارة الخوري، بيروت',
      fHours: 'الدوام', fHoursP: 'الإثنين – السبت<br>7:00 الصبح – 8:00 المسا<br>الأحد 7:00 الصبح – 7:00 المسا', fOrder: 'اتصل فينا', fMobile: 'خلوي وواتساب', fLand: 'أرضي', gmaps: 'Google Maps',
      title: 'عجينتي | مناقيش ومعجنات براس النبع، بيروت'
    }
  };
  const root = document.documentElement;
  let lang = 'en';

  /* ---------- the headline follows the oven: "we’re open" only when we are ---------- */
  function headline() {
    const W = T[lang], s = AJ.status(lang);
    const words = s.open ? W.hlOpen : s.inDays === 0 ? W.hlToday(s.opens) : s.inDays === 1 ? W.hlTomorrow : W.hlDay(AJ.dayName(s.nextDay, lang));
    document.querySelectorAll('[data-hl]').forEach(el => { el.textContent = words[el.dataset.hl === 'a' ? 0 : 1]; });
  }

  function apply(lg) {
    lang = lg;
    const W = T[lg], other = lg === 'en' ? 'ar' : 'en';
    root.lang = lg;
    root.dir = lg === 'ar' ? 'rtl' : 'ltr';
    document.title = W.title;
    document.querySelectorAll('[data-i18n]').forEach(el => { const v = W[el.dataset.i18n]; if (typeof v === 'string') el.textContent = v; });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { const v = W[el.dataset.i18nHtml]; if (typeof v === 'string') el.innerHTML = v; });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => { const [attr, k] = pair.split(':'); if (W[k]) el.setAttribute(attr, W[k]); });
    });
    document.querySelectorAll('[data-alt]').forEach(el => {
      el.textContent = T[other][el.dataset.alt];
      el.lang = other; el.dir = other === 'ar' ? 'rtl' : 'ltr';
    });
    AJ.waLinks(lg);
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lg)));
    AJ.paintStatus(lg);
    headline();
    syncVideoBtn();
    AJ.order.chip(lg);
  }
  function setLang(lg) { AJ.saveLang(lg); apply(lg); }

  /* ---------- the oven video: plays only on screen, never for reduced motion or data saver, always pausable ---------- */
  const vid = $('#ovenVideo'), vbtn = $('#videoBtn');
  let wanted = false;
  function syncVideoBtn() {
    if (!vid || !vbtn) return;
    const paused = vid.paused;
    vbtn.classList.toggle('paused', paused);
    vbtn.setAttribute('aria-label', paused ? T[lang].play : T[lang].pause);
  }
  function video() {
    if (!vid || !vbtn) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saver = !!(navigator.connection && navigator.connection.saveData);
    wanted = !reduce && !saver;
    let loaded = false;
    const load = () => {
      if (loaded) return; loaded = true;
      vid.querySelectorAll('source[data-src]').forEach(src => { src.src = src.dataset.src; });
      vid.load();
    };
    const play = () => { load(); const p = vid.play(); if (p && p.catch) p.catch(() => syncVideoBtn()); };
    vbtn.hidden = false;
    vbtn.addEventListener('click', () => { if (vid.paused) { wanted = true; play(); } else { wanted = false; vid.pause(); } });
    vid.addEventListener('play', syncVideoBtn);
    vid.addEventListener('pause', syncVideoBtn);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { if (wanted) play(); }
        else if (!vid.paused) vid.pause();
      }, { threshold: 0.15 }).observe(vid);
    } else if (wanted) play();
    syncVideoBtn();
  }

  /* ---------- floating "Order online": only once the hero buttons are off screen ---------- */
  function floater() {
    const btn = $('#orderFloat'), hero = $('#heroActions');
    if (!btn || !hero) return;
    if (!('IntersectionObserver' in window)) { btn.classList.add('show'); return; }
    new IntersectionObserver(([e]) => btn.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(hero);
  }

  /* ---------- map: load Leaflet only when the map comes near the screen ---------- */
  function map() {
    const wrap = $('#mapLink');
    if (!wrap) return;
    let started = false;
    const start = () => {
      if (started) return; started = true;
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'assets/vendor/leaflet/leaflet.css'; document.head.appendChild(css);
      const s = document.createElement('script'); s.src = 'assets/vendor/leaflet/leaflet.js'; s.onload = draw; document.head.appendChild(s);
    };
    const draw = () => {
      if (typeof L === 'undefined') return;
      const spot = [MAP.lat, MAP.lng];
      const m = L.map('map', { center: spot, zoom: 16, zoomControl: false, attributionControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, touchZoom: false, tap: false });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=cb1_43cm_1_007421556deccc8691ee448a', { subdomains: 'abcd', maxZoom: 19 }).addTo(m);
      const pin = L.divIcon({ className: '', iconSize: [46, 58], iconAnchor: [23, 56], html: '<div class="pin"><svg viewBox="0 0 46 58"><path d="M4 54 V22 A19 19 0 0 1 42 22 V54 Z" fill="#2E3A2F" stroke="#E7D6C0" stroke-width="2.5"/><path d="M23 40 C14 34 12 28 15.5 25 C18.5 22.5 22 24 23 27 C24 24 27.5 22.5 30.5 25 C34 28 32 34 23 40 Z" fill="#B8663E"/></svg></div>' });
      L.marker(spot, { icon: pin, interactive: false, keyboard: false }).addTo(m);
      wrap.classList.add('ready');
      const frame = () => { m.invalidateSize(); m.setView(spot, 16, { animate: false }); };
      frame(); addEventListener('resize', frame);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); start(); } }, { rootMargin: '600px 0px' });
      io.observe(wrap);
    } else start();
  }

  /* ---------- boot ---------- */
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) setLang(b.dataset.lang); }));
  apply(AJ.pickLang());
  video(); floater(); map();
  setInterval(() => { AJ.paintStatus(lang); headline(); }, 60 * 1000);
})();
