/* Topping sprinkle: real photographed nut chips fall onto a product photo and the photographed topping
 * appears where they land, so the topping builds up rather than fading in.
 *
 * Markup (all three layers share one square box, so the topping stays registered to the base):
 *   <div class="sp">
 *     <img class="sp-base">              the plain product photo, never changes
 *     <img class="sp-top">               the topping-only layer (transparent), shown once settled
 *     <canvas class="sp-fx">             falling chips + progressive reveal, only while animating
 *   </div>
 *
 * AJSprinkle.create(el, { chips, rects }) → { set(on, animate), destroy() }
 *   chips: URL of a sprite sheet of chips cut from the same photo; rects: [x, y, w, h] per chip, in sheet pixels.
 *   src: the size (px) of the photo the chips were cut from, so they land at their real size.
 * The canvas runs requestAnimationFrame only during the ~1.2 s sprinkle and is cleared afterwards. */
(() => {
  'use strict';
  const DUR = 1180;          // whole sprinkle, ms
  const SPAWN = 640;         // chips leave the "hand" during the first SPAWN ms
  const FILL = 230;          // the last FILL ms settle any gaps between landings
  const EXT = 0.3;           // canvas reaches this far above the photo (fraction of its width) for the fall
  const COUNT = 170;         // chips per sprinkle
  const OUT = 240;           // remove: topping fades off over this many ms
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sheets = {};
  const loadSheet = src => sheets[src] || (sheets[src] = Object.assign(new Image(), { decoding: 'async', src }));
  const ready = im => (im.complete && im.naturalWidth) ? Promise.resolve()
    : new Promise((res, rej) => { im.addEventListener('load', res, { once: true }); im.addEventListener('error', rej, { once: true }); });
  const easeOut = k => 1 - Math.pow(1 - k, 3);

  // Where the photographed topping actually has nuts, as weighted cells (0..1 coords). Read once per image.
  // A page opened from disk (file://) can't read pixels back; it falls back to the round centre of the product.
  const maps = new WeakMap();
  function landingCells(img) {
    if (maps.has(img)) return maps.get(img);
    const N = 48, cells = [];
    try {
      const c = document.createElement('canvas'); c.width = c.height = N;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, 0, 0, N, N);
      const px = g.getImageData(0, 0, N, N).data;
      for (let i = 0; i < N * N; i++) { const a = px[i * 4 + 3]; if (a > 40) cells.push({ x: (i % N + .5) / N, y: ((i / N | 0) + .5) / N, w: a / 255 }); }
    } catch (e) { cells.length = 0; }
    if (!cells.length) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const dx = (x + .5) / N - .5, dy = (y + .5) / N - .5; if (dx * dx + dy * dy < .4 * .4) cells.push({ x: (x + .5) / N, y: (y + .5) / N, w: 1 });
    }
    maps.set(img, cells);
    return cells;
  }

  // Landing points spread evenly over the topping (dart throwing), then ordered along one pass of a hand
  // sweeping across, with some scatter, so the nuts accumulate the way a real sprinkle does.
  function plan(cells, rects) {
    const pts = [], cell = 1 / 48;
    let gap = .058, tries = 0;
    while (pts.length < COUNT && tries < COUNT * 60) {
      tries++;
      const c = cells[Math.random() * cells.length | 0];
      if (Math.random() > c.w) continue;
      const x = c.x + (Math.random() - .5) * cell, y = c.y + (Math.random() - .5) * cell;
      if (pts.some(p => (p.x - x) ** 2 + (p.y - y) ** 2 < gap * gap)) { if (tries % 400 === 0) gap *= .85; continue; }
      pts.push({ x, y });
    }
    const ang = (Math.random() < .5 ? -1 : 1) * (.35 + Math.random() * .4), ux = Math.cos(ang), uy = Math.sin(ang) * .6;
    pts.forEach(p => { p.k = p.x * ux + p.y * uy + (Math.random() - .5) * .38; });
    pts.sort((a, b) => a.k - b.k);
    return pts.map((p, i) => {
      const t0 = (i / pts.length) * SPAWN * (.85 + Math.random() * .15) + Math.random() * 60;
      const d = 360 + Math.random() * 190;                              // fall time
      const y0 = -EXT * (.6 + Math.random() * .4);                      // released above the photo
      const v0 = .1 + Math.random() * .25;                              // a small downward toss (widths per second)
      const dy = p.y - y0, ds = d / 1000;
      return {
        x: p.x, y: p.y, x0: p.x + (Math.random() - .5) * .14, y0, t0, d, v0,
        g: 2 * (dy - v0 * ds) / (ds * ds),                              // constant pull that lands it exactly at d
        r: rects[Math.random() * rects.length | 0],
        rot: Math.random() * 6.283, spin: (Math.random() - .5) * 14,     // radians per second
        s: .9 + Math.random() * .35, blob: .032 + Math.random() * .026, landed: false
      };
    });
  }

  function create(root, opts) {
    const top = root.querySelector('.sp-top'), cv = root.querySelector('.sp-fx');
    const sheet = loadSheet(opts.chips), rects = opts.rects, srcW = opts.src;
    let on = false, token = 0, raf = 0, timer = 0;

    const show = (vis, fade) => {
      top.style.transition = fade ? `opacity ${OUT}ms ease-out` : 'none';
      top.style.opacity = vis ? '1' : '0';
    };
    const stopFx = () => {
      cancelAnimationFrame(raf); raf = 0; clearTimeout(timer);
      const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height);
      cv.style.transition = 'none'; cv.style.opacity = '1';
    };

    async function sprinkle(my) {
      try { await Promise.all([ready(top), ready(sheet)]); } catch (e) { if (my === token) show(true, true); return; }
      if (my !== token) return;
      const W = root.getBoundingClientRect().width;
      if (!W) { show(true, false); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2), S = Math.round(W * dpr), OY = Math.round(EXT * S);
      cv.width = S; cv.height = S + OY;
      const g = cv.getContext('2d');
      // The topping, scaled once to device pixels; the reveal mask and the masked topping are only
      // redrawn on frames where a chip lands.
      const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
      const full = mk(S, S), mask = mk(S, S), shown = mk(S, S);
      full.getContext('2d').drawImage(top, 0, 0, S, S);
      const mg = mask.getContext('2d'), sg = shown.getContext('2d');
      const chips = plan(landingCells(top), rects), scale = S / srcW;
      let dirty = false;
      const t0 = performance.now();
      const frame = now => {
        if (my !== token) return;
        const t = now - t0;
        for (const p of chips) if (!p.landed && t >= p.t0 + p.d) {
          p.landed = true; dirty = true;
          const x = p.x * S, y = p.y * S, R = p.blob * S;
          const gr = mg.createRadialGradient(x, y, 0, x, y, R);
          gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.62, 'rgba(0,0,0,.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
          mg.fillStyle = gr; mg.fillRect(x - R, y - R, 2 * R, 2 * R);
        }
        if (dirty) {
          sg.globalCompositeOperation = 'copy'; sg.drawImage(full, 0, 0);
          sg.globalCompositeOperation = 'destination-in'; sg.drawImage(mask, 0, 0);
          dirty = false;
        }
        g.clearRect(0, 0, cv.width, cv.height);
        g.drawImage(shown, 0, OY);
        const k = (t - (DUR - FILL)) / FILL;
        if (k > 0) { g.globalAlpha = Math.min(1, easeOut(k)); g.drawImage(full, 0, OY); g.globalAlpha = 1; }
        for (const p of chips) {
          const u = t - p.t0;
          if (u < 0) continue;
          const after = u - p.d;
          if (after > 140) continue;                               // settled into the revealed topping
          const q = Math.min(1, u / p.d), sec = Math.min(u, p.d) / 1000;
          const y = (p.y0 + p.v0 * sec + .5 * p.g * sec * sec) * S + OY;
          const x = (p.x0 + (p.x - p.x0) * easeOut(q)) * S;
          const [sx, sy, sw, sh] = p.r, z = p.s * scale * (1 + .3 * (1 - q));   // a touch larger while nearer the camera
          // soft contact shadow growing under the chip as it comes down
          if (q > .35 && after < 0) {
            g.globalAlpha = .16 * (q - .35) / .65;
            g.fillStyle = '#2a160b'; g.beginPath();
            g.ellipse(p.x * S, p.y * S + OY + sh * z * .18, sw * z * .45, sh * z * .3, 0, 0, 6.283); g.fill();
          }
          g.globalAlpha = Math.min(1, u / 70) * (after > 0 ? 1 - after / 140 : 1);
          g.save(); g.translate(x, y); g.rotate(p.rot + p.spin * sec * (1 - .5 * q));
          g.drawImage(sheet, sx, sy, sw, sh, -sw * z / 2, -sh * z / 2, sw * z, sh * z);
          g.restore();
        }
        g.globalAlpha = 1;
        if (t < DUR) raf = requestAnimationFrame(frame);
        else { show(true, false); stopFx(); }                       // same pixels, now held by the plain <img>
      };
      raf = requestAnimationFrame(frame);
    }

    function set(next, animate = true) {
      next = !!next;
      const my = ++token;
      const wasAnimating = !!raf;
      if (next === on && !wasAnimating) { show(on, false); return; }
      on = next;
      if (on) {
        stopFx(); show(false, false);
        if (!animate || reduced()) { ready(top).then(() => { if (my === token) show(true, false); }, () => show(true, false)); return; }
        sprinkle(my);
      } else if (wasAnimating) {
        // removed mid-sprinkle: let what has landed fade off with the chips still in the air
        cancelAnimationFrame(raf); raf = 0;
        if (reduced()) { stopFx(); return; }
        cv.style.transition = `opacity ${OUT}ms ease-out`; cv.style.opacity = '0';
        timer = setTimeout(() => { if (my === token) stopFx(); }, OUT + 20);
      } else show(false, animate && !reduced());
    }

    return { set, destroy() { token++; stopFx(); } };
  }

  window.AJSprinkle = { create };
})();
