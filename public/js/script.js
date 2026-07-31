// nav toggle
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle) toggle.addEventListener('click', () => nav.classList.toggle('open'));

// year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

// case study filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.case-card').forEach(c => {
      c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f);
    });
  });
});

// scroll: shrink nav slightly
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 40 ? '0 4px 24px rgba(0,0,0,0.4)' : '';
});

// ── RainBrain particle-sphere reveal ──
// A particle "brain" sphere assembles from scattered points, rotates,
// then fades to reveal the card content. Plays once, on scroll-into-view.
(function () {
  const canvas = document.getElementById('rbBrainCanvas');
  const card = document.getElementById('rbCard');
  const inner = document.getElementById('rbCardInner');
  if (!canvas || !card || !inner) return;

  function reveal() {
    canvas.classList.add('rb-brain-done');
    inner.classList.add('rb-content-in');
  }

  // hard safety net — content must never stay hidden, no matter what
  const safetyTimer = setTimeout(reveal, 6000);

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    clearTimeout(safetyTimer);
    reveal();
    return;
  }

  let ctx;
  try {
    ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
  } catch (e) {
    clearTimeout(safetyTimer);
    reveal();
    return;
  }

  const POINT_COUNT = 950;

  // timeline — assemble into a torus, morph to a spiral galaxy, morph to a brain, hold, fade
  const T_ASSEMBLE = 1600;
  const T_HOLD1 = 500;
  const T_MORPH1 = 1400;
  const T_HOLD2 = 500;
  const T_MORPH2 = 1400;
  const T_HOLD3 = 950;
  const T_FADE = 1000;

  const M1 = T_ASSEMBLE;
  const M2 = M1 + T_HOLD1;
  const M3 = M2 + T_MORPH1;
  const M4 = M3 + T_HOLD2;
  const M5 = M4 + T_MORPH2;
  const M6 = M5 + T_HOLD3;
  const M7 = M6 + T_FADE;

  const TILT = { torus: 0.30, spiral: 1.05, brain: 0.10 };

  // teal → cyan-blue → indigo/purple, matching the reference palette
  const COLOR_TOP = { r: 86, g: 214, b: 171 };
  const COLOR_MID = { r: 64, g: 168, b: 222 };
  const COLOR_BOT = { r: 122, g: 92, b: 231 };

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let points = [];
  let startTime = null;
  let rafId = null;
  let stopped = false;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function mixColor(t) {
    t = Math.max(0, Math.min(1, t));
    if (t < 0.5) {
      const k = t / 0.5;
      return {
        r: lerp(COLOR_TOP.r, COLOR_MID.r, k),
        g: lerp(COLOR_TOP.g, COLOR_MID.g, k),
        b: lerp(COLOR_TOP.b, COLOR_MID.b, k)
      };
    }
    const k = (t - 0.5) / 0.5;
    return {
      r: lerp(COLOR_MID.r, COLOR_BOT.r, k),
      g: lerp(COLOR_MID.g, COLOR_BOT.g, k),
      b: lerp(COLOR_MID.b, COLOR_BOT.b, k)
    };
  }

  function fibonacciSphere(n) {
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      pts.push({ x, y, z });
    }
    return pts;
  }

  // ── shape generators, each returns n points roughly within [-1,1] ──
  function torusShape(n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const u = 2 * Math.PI * ((i * 0.6180339887) % 1);
      const v = 2 * Math.PI * ((i * 0.3819660113) % 1);
      const Rm = 0.72, rm = 0.30;
      pts.push({
        x: (Rm + rm * Math.cos(v)) * Math.cos(u),
        y: (Rm + rm * Math.cos(v)) * Math.sin(u),
        z: rm * Math.sin(v)
      });
    }
    return pts;
  }

  function spiralShape(n) {
    const pts = [];
    const arms = 2;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const radius = Math.pow(t, 0.55) * 0.98;
      const armOffset = (i % arms) * (Math.PI * 2 / arms);
      const angle = radius * 7.4 + armOffset + (Math.random() - 0.5) * 0.22;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = (Math.random() - 0.5) * 0.05 * (1 - t * 0.5);
      pts.push({ x, y, z });
    }
    return pts;
  }

  function brainShape(n) {
    const base = fibonacciSphere(n);
    return base.map((p) => {
      const bump = 1 + 0.06 * Math.sin(p.x * 9 + p.z * 5) + 0.04 * Math.cos(p.y * 11 + p.x * 4);
      let x = p.x * 1.18 * bump;
      let y = p.y * 0.82 * bump - 0.05;
      let z = p.z * 0.82 * bump;

      // longitudinal fissure — split the two hemispheres near the top
      if (y > 0.05) {
        const t = Math.min(1, (y - 0.05) / 0.55);
        const push = Math.exp(-(x * x) / 0.05) * 0.22 * t;
        x += (x >= 0 ? 1 : -1) * push;
      }
      // brainstem taper at the bottom
      if (y < -0.35) {
        const t = Math.max(0, Math.min(1, (y + 0.9) / 0.55));
        const shrink = 0.25 + 0.75 * t;
        x *= shrink;
        z *= shrink;
      }
      return { x, y, z };
    });
  }

  function buildPoints() {
    const torus = torusShape(POINT_COUNT);
    const spiral = spiralShape(POINT_COUNT);
    const brain = brainShape(POINT_COUNT);

    points = torus.map((p, i) => {
      const startDist = 2.6 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return {
        scatter: {
          x: Math.sin(phi) * Math.cos(theta) * startDist,
          y: Math.sin(phi) * Math.sin(theta) * startDist,
          z: Math.cos(phi) * startDist
        },
        torus: p,
        spiral: spiral[i],
        brain: brain[i],
        delay: Math.random() * 0.4,
        size: 1.0 + Math.random() * 1.6
      };
    });
  }

  function resize() {
    const rect = card.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // figure out which two shapes to blend between, and the tilt, for a given elapsed time
  function timelineState(elapsed) {
    if (elapsed < M1) {
      const t = easeOutCubic(Math.min(elapsed / M1, 1));
      return { from: 'scatter', to: 'torus', t, tilt: TILT.torus, perPointDelay: true };
    }
    if (elapsed < M2) {
      return { from: 'torus', to: 'torus', t: 1, tilt: TILT.torus, perPointDelay: false };
    }
    if (elapsed < M3) {
      const t = easeInOutCubic((elapsed - M2) / (M3 - M2));
      return { from: 'torus', to: 'spiral', t, tilt: lerp(TILT.torus, TILT.spiral, t), perPointDelay: false };
    }
    if (elapsed < M4) {
      return { from: 'spiral', to: 'spiral', t: 1, tilt: TILT.spiral, perPointDelay: false };
    }
    if (elapsed < M5) {
      const t = easeInOutCubic((elapsed - M4) / (M5 - M4));
      return { from: 'spiral', to: 'brain', t, tilt: lerp(TILT.spiral, TILT.brain, t), perPointDelay: false };
    }
    return { from: 'brain', to: 'brain', t: 1, tilt: TILT.brain, perPointDelay: false };
  }

  function render(now) {
    if (stopped) return;
    if (startTime === null) startTime = now;
    const elapsed = now - startTime;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const R = Math.min(width, height) * 0.30;
    const spin = elapsed * 0.00035;
    const cosSpin = Math.cos(spin);
    const sinSpin = Math.sin(spin);
    const perspective = R * 3.4;

    const state = timelineState(elapsed);
    const cosTilt = Math.cos(state.tilt);
    const sinTilt = Math.sin(state.tilt);

    const drawList = points.map((p) => {
      let t = state.t;
      if (state.perPointDelay) {
        let prog = (state.t - p.delay) / (1 - p.delay);
        t = Math.max(0, Math.min(1, prog));
      }

      const from = p[state.from];
      const to = p[state.to];
      const x0 = lerp(from.x, to.x, t);
      const y0 = lerp(from.y, to.y, t);
      const z0 = lerp(from.z, to.z, t);

      // tilt (rotate around X axis) so each shape presents at its natural viewing angle
      const y1 = y0 * cosTilt - z0 * sinTilt;
      const z1 = y0 * sinTilt + z0 * cosTilt;

      // continuous spin (rotate around Y axis)
      const rx = x0 * cosSpin + z1 * sinSpin;
      const rz = -x0 * sinSpin + z1 * cosSpin;

      const scale = perspective / (perspective + rz * R);
      const screenX = cx + rx * R * scale;
      const screenY = cy + y1 * R * scale;
      const alpha = Math.max(0.15, Math.min(1, (rz + 1.6) / 2.4)) * (0.35 + 0.65 * t);
      const color = mixColor((y0 + 1) / 2);

      return { screenX, screenY, size: p.size * scale, color, alpha, depth: rz };
    }).sort((a, b) => a.depth - b.depth);

    for (const d of drawList) {
      ctx.beginPath();
      ctx.arc(d.screenX, d.screenY, Math.max(0.4, d.size), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.color.r | 0}, ${d.color.g | 0}, ${d.color.b | 0}, ${d.alpha.toFixed(3)})`;
      ctx.fill();
    }

    // soft glow highlight once the brain has formed, like a bloom of insight
    if (elapsed >= M5) {
      const glowT = Math.min(1, (elapsed - M5) / 500);
      const pulse = 0.55 + 0.35 * Math.sin(elapsed * 0.004);
      const gx = cx - R * 0.28;
      const gy = cy - R * 0.12;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, R * 0.5);
      grad.addColorStop(0, `rgba(230, 250, 255, ${(0.35 * glowT * pulse).toFixed(3)})`);
      grad.addColorStop(1, 'rgba(230, 250, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    if (elapsed < M7 + 200) {
      rafId = requestAnimationFrame(render);
    } else {
      stopped = true;
    }

    if (elapsed >= M6 && !canvas.classList.contains('rb-brain-done')) {
      clearTimeout(safetyTimer);
      reveal();
    }
  }

  function start() {
    if (rafId !== null) return;
    buildPoints();
    resize();
    rafId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    if (width) resize();
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          start();
          io.unobserve(card);
        }
      });
    }, { threshold: 0.25 });
    io.observe(card);
  } else {
    start();
  }
})();

// ── Team cards — spear in one at a time on scroll ──
(() => {
  const people = document.querySelectorAll('.person');
  if (!people.length) return;

  if (!('IntersectionObserver' in window)) {
    people.forEach((p) => p.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = Array.from(people).indexOf(entry.target) % 3 * 120;
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  people.forEach((p) => io.observe(p));
})();

// ── Services split blocks — alternating slide-in from left/right on scroll ──
(() => {
  const splits = document.querySelectorAll('.split');
  if (!splits.length) return;

  if (!('IntersectionObserver' in window)) {
    splits.forEach((s) => s.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

  splits.forEach((s) => io.observe(s));
})();

// ── Methodology list — alternating slide-in from left/right on scroll ──
(() => {
  const items = document.querySelectorAll('.method-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((it) => it.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -80px 0px' });

  items.forEach((it) => io.observe(it));
})();
