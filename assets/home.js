/* AJEENTY — homepage behaviour: words in both languages, map, floating WhatsApp, photos.
   Hours, opening status, WhatsApp number and the menu transition live in common.js. */
(() => {
  'use strict';

  const MAP = { lat: 33.8799516, lng: 35.5068473 };

  /* ---------- words ---------- */
  const T = {
    en: {
      skip: 'Skip to content', navMenu: 'Menu', navVisit: 'Visit us',
      h1a: 'Beirut,', h1b: 'we’re open.',
      heroP: 'Man’oushe, mo3ajanat and fresh dough, straight from the oven. Order online for pickup or delivery, or grab it hot from the counter.', orderOnline: 'Order online', findUs: 'Find us',
      hoursShort: 'Mon–Sat · 7 AM – 8 PM', deliveryShort: 'Pickup & delivery', whereShort: 'Ras El Nabeh, Beirut',
      artAlt: 'Illustration of a fresh zaatar and cheese man’oushe steaming under an arched window',
      artLabelA: 'Hot from the oven', artLabelB: 'Ras El Nabeh<br>Beirut',
      tk1: 'AJEENTY · Ras El Nabeh · Beirut', tk2: 'Man’oushe · Mo3ajanat · Fresh dough', tk3: 'Mon–Sat · 7 AM – 8 PM', tk4: 'Order online · pickup & delivery',
      ovenKicker: 'On the menu', ovenTitle: 'Out of the oven.',
      ovenP: 'A few favourites from the furn. Every man’oushe comes as a man’oushe or a mashrouha.',
      fullMenu: 'See the full menu', altOven: 'AJEENTY’s oven', altCounter: 'The AJEENTY counter in Ras El Nabeh', capOven: 'The oven', capCounter: 'The counter',
      from: 'from', lbp: 'LBP', view: 'View', tagHalf: 'Half & half', tagDozen: 'By the dozen',
      dThyme: 'Thyme', dAkawi: 'Cheese akawi', dDoublex: 'Doublex (cheese & thyme)', dKeshek: 'Keshek', dLahme: 'Lahme baajin', dMixed: 'Mixed dozen pastries',
      jreesh: 'Any item can be made on jreesh (whole-wheat) dough', group: 'Feeding a crowd? Mo3ajanat come by the dozen or boxed.', planIt: 'Order by the dozen',
      infoLabel: 'About and contact', infoKicker: 'The neighborhood oven', infoTitle: 'Fresh dough.<br>Hot oven.<br>That’s the point.',
      infoP: 'AJEENTY is in Ras El Nabeh, Beirut, near Bechara El Khoury and Al Amliyeh School. Order online and pick it up hot from the counter, or have it delivered.',
      contactKicker: 'Questions? Say marhaba', contactNote: 'WhatsApp or call us to ask what’s coming out of the oven, check on an order, or plan a group breakfast.',
      lblMobile: 'Mobile · WhatsApp', lblLand: 'Landline', lblEmail: 'Email', call: 'Call', write: 'Email',
      visitKicker: 'Find us', visitTitle: 'Come by the counter.', addrA: 'Ras El Nabeh, Beirut', addrB: 'Near Bechara El Khoury and Al Amliyeh School.',
      hoursLabel: 'Opening hours', monSat: 'Monday – Saturday', monSatH: '7:00 AM – 8:00 PM', sun: 'Sunday', closed: 'Closed', today: 'Today',
      directions: 'Get directions', callUs: 'Call us', mapAria: 'Open AJEENTY’s location in Google Maps', mapHint: 'Open in Google Maps ↗',
      footTag: 'Fresh dough. Hot oven.', fVisit: 'Visit', fAddr: 'Ras El Nabeh, Beirut<br>Near Bechara El Khoury &amp; Al Amliyeh School',
      fHours: 'Hours', fHoursP: 'Monday – Saturday<br>7:00 AM – 8:00 PM<br>Sunday closed', fOrder: 'Call us', fMobile: 'Mobile & WhatsApp', fLand: 'Landline', gmaps: 'Google Maps',
      title: 'AJEENTY | Man’oushe & mo3ajanat in Ras El Nabeh, Beirut'
    },
    ar: {
      skip: 'انتقل للمحتوى', navMenu: 'المنيو', navVisit: 'زورونا',
      h1a: 'بيروت،', h1b: 'فتحنا.',
      heroP: 'مناقيش ومعجنات وعجينة طازة، طالعين سخنين من الفرن. اطلب أونلاين استلام أو دليفري، أو مرّ خدهن سخنين من المحل.', orderOnline: 'اطلب أونلاين', findUs: 'كيف توصلنا',
      hoursShort: 'الإثنين – السبت · 7 الصبح – 8 المسا', deliveryShort: 'استلام ودليفري', whereShort: 'راس النبع، بيروت',
      artAlt: 'رسمة منقوشة زعتر وجبنة طالعة سخنة تحت قنطرة',
      artLabelA: 'طازة من الفرن', artLabelB: 'راس النبع<br>بيروت',
      tk1: 'عجينتي · راس النبع · بيروت', tk2: 'مناقيش · معجنات · عجينة طازة', tk3: 'الإثنين – السبت · 7 الصبح – 8 المسا', tk4: 'اطلب أونلاين · استلام ودليفري',
      ovenKicker: 'من المنيو', ovenTitle: 'طالع من الفرن.',
      ovenP: 'شوية من الأصناف يلي بتحبوها. كل منقوشة فيك تطلبها منقوشة أو مشروحة.',
      fullMenu: 'شوف المنيو كلّه', altOven: 'فرن عجينتي', altCounter: 'محل عجينتي براس النبع', capOven: 'الفرن', capCounter: 'المحل',
      from: 'من', lbp: 'ل.ل.', view: 'شوف', tagHalf: 'نص ونص', tagDozen: 'بالدزينة',
      dThyme: 'زعتر', dAkawi: 'جبنة عكاوي', dDoublex: 'دوبليكس (جبنة وزعتر)', dKeshek: 'كشك', dLahme: 'لحم بعجين', dMixed: 'معجنات دزينة مشكل',
      jreesh: 'أي صنف منحضّره على عجينة الجريش (قمحة كاملة)', group: 'عندك عزيمة أو ترويقة للشغل؟ المعجنات بالدزينة أو بالعلبة.', planIt: 'اطلب بالدزينة',
      infoLabel: 'عنّا وكيف تحكونا', infoKicker: 'فرن الحي', infoTitle: 'عجينة طازة.<br>فرن حامي.<br>وهيدا كل شي.',
      infoP: 'عجينتي براس النبع، بيروت، قرب ساحة البشارة الخوري ومدرسة العاملية. اطلب أونلاين وخدها سخنة من المحل، أو منوصّلك ياها.',
      contactKicker: 'عندك سؤال؟ قول مرحبا', contactNote: 'ابعتلنا واتساب أو اتصل فينا لتسأل شو طالع من الفرن، أو عن طلبك، أو لترتّب ترويقة للجمعة.',
      lblMobile: 'خلوي · واتساب', lblLand: 'أرضي', lblEmail: 'إيميل', call: 'اتصل', write: 'إيميل',
      visitKicker: 'زورونا', visitTitle: 'مرّوا عالمحل.', addrA: 'راس النبع، بيروت', addrB: 'قرب ساحة البشارة الخوري ومدرسة العاملية.',
      hoursLabel: 'أوقات الدوام', monSat: 'الإثنين – السبت', monSatH: '7:00 الصبح – 8:00 المسا', sun: 'الأحد', closed: 'مسكّرين', today: 'اليوم',
      directions: 'دلّني عالطريق', callUs: 'اتصل فينا', mapAria: 'افتح موقع عجينتي على Google Maps', mapHint: 'افتح على Google Maps ↗',
      footTag: 'عجينة طازة. فرن حامي.', fVisit: 'العنوان', fAddr: 'راس النبع، بيروت<br>قرب ساحة البشارة الخوري ومدرسة العاملية',
      fHours: 'الدوام', fHoursP: 'الإثنين – السبت<br>7:00 الصبح – 8:00 المسا<br>الأحد مسكّرين', fOrder: 'اتصل فينا', fMobile: 'خلوي وواتساب', fLand: 'أرضي', gmaps: 'Google Maps',
      title: 'عجينتي | مناقيش ومعجنات براس النبع، بيروت'
    }
  };
  const root = document.documentElement;
  let lang = 'en';

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
    document.querySelectorAll('[data-today]').forEach(el => el.setAttribute('data-today', W.today));
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lg)));
    AJ.paintStatus(lg);
    AJ.order.chip(lg);
  }

  function setLang(lg) { AJ.saveLang(lg); apply(lg); }

  /* ---------- photos (body data-photos="on") ---------- */
  function photos() {
    if (document.body.dataset.photos !== 'on') return;
    document.querySelectorAll('img[data-src]').forEach(img => {
      const holder = img.closest('.media') || img.closest('.photo-band');
      img.addEventListener('load', () => holder && holder.classList.add('has-img'), { once: true });
      img.addEventListener('error', () => (img.closest('figure') || img).remove(), { once: true });
      if (holder && holder.classList.contains('photo-band')) img.loading = 'eager'; // hidden until loaded, so lazy-loading would never fire
      img.src = img.dataset.src;
    });
  }

  /* ---------- floating WhatsApp: only once the hero buttons are off screen ---------- */
  function floater() {
    const btn = document.getElementById('waFloat'), hero = document.getElementById('heroActions');
    if (!btn || !hero) return;
    if (!('IntersectionObserver' in window)) { btn.classList.add('show'); return; }
    new IntersectionObserver(([e]) => btn.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0)).observe(hero);
  }

  /* ---------- map: load Leaflet only when the map comes near the screen ---------- */
  function map() {
    const wrap = document.getElementById('mapLink');
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
  photos(); floater(); map();
  setInterval(() => AJ.paintStatus(lang), 60 * 1000);
})();
