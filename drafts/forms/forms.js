// The forms page: small live charts drawn directly, without an engine.
// One lens in three drawings that share one setting, and one quadratic
// in two. Every chart is three points on a line; only the placing differs.
const NS = "http://www.w3.org/2000/svg";
function el(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
  if (parent) parent.appendChild(n);
  return n;
}
function text(parent, x, y, s, cls, anchor = "middle") {
  const t = el("text", { x, y, class: cls, "text-anchor": anchor }, parent);
  t.textContent = s;
  return t;
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const fmt = (v, d = 1) => (Math.abs(v) === Infinity ? "∞" : (+v.toFixed(d)).toString().replace("-", "−"));

function svgPoint(svg, e) {
  const p = svg.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}
// A red ring that can be dragged with a pointer or moved with the keys.
function ring(svg, layer, label, onDrag, onKey) {
  const g = el("g", { class: "handle", tabindex: 0, role: "slider", "aria-label": label }, layer);
  el("circle", { r: 16, class: "hit" }, g);
  el("circle", { r: 10, class: "handle-ring" }, g);
  el("circle", { r: 2.5, class: "handle-dot" }, g);
  g.addEventListener("pointerdown", (e) => {
    g.setPointerCapture(e.pointerId); e.preventDefault(); g.focus();
    const move = (ev) => onDrag(svgPoint(svg, ev));
    const up = () => { g.removeEventListener("pointermove", move); g.removeEventListener("pointerup", up); };
    g.addEventListener("pointermove", move); g.addEventListener("pointerup", up);
  });
  g.addEventListener("keydown", (e) => {
    const k = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1 }[e.key];
    if (!k) return;
    e.preventDefault(); onKey(k * (e.shiftKey ? 10 : 1), e.key);
  });
  return { g, at(x, y, value) { g.setAttribute("transform", `translate(${x},${y})`); g.setAttribute("aria-valuetext", value); } };
}
function tick(parent, x1, y1, x2, y2, minor) { el("line", { x1, y1, x2, y2, class: minor ? "tick minor" : "tick" }, parent); }

/* ---------- One lens, three drawings ---------- */
const lens = { u: 30, v: 15 };
const LO = 5, HI = 60, STEP = 0.5;
const snap = (x) => clamp(Math.round(x / STEP) * STEP, LO, HI);
const views = [];
function setLens(u, v) { lens.u = snap(u); lens.v = snap(v); views.forEach((f) => f()); }
const focal = () => (lens.u * lens.v) / (lens.u + lens.v);
const keyStep = (x, k) => snap(x + k * STEP);

// 1. Three parallel scales, reciprocal: the ruler is 100/x.
(function parallel() {
  const svg = document.getElementById("lens-parallel");
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 360 420");
  const xA = 60, xM = 180, xC = 300, top = 46, bot = 372;
  const yOut = (x) => bot - (bot - top) * (100 / x) / 20;
  const yMid = (f) => bot - (bot - top) * (100 / f) / 40;
  const s = el("g", { class: "scales" }, svg);
  const outer = [5, 6, 7, 8, 10, 15, 20, 30, 60];
  const outerMinor = [5.5, 6.5, 7.5, 9, 12, 25, 40];
  for (const [x, side, name] of [[xA, -1, "Object u"], [xC, 1, "Image v"]]) {
    el("line", { x1: x, y1: top, x2: x, y2: bot, class: "axis" }, s);
    for (const d of outer) { tick(s, x, yOut(d), x + 9 * side, yOut(d)); text(s, x + 14 * side, yOut(d) + 5, d, "tick-label", side < 0 ? "end" : "start"); }
    for (const d of outerMinor) tick(s, x, yOut(d), x + 5 * side, yOut(d), true);
    tick(s, x, bot, x + 9 * side, bot); text(s, x + 14 * side, bot + 5, "∞", "tick-label", side < 0 ? "end" : "start");
    text(s, x, top - 22, name, "scale-name");
  }
  el("line", { x1: xM, y1: top, x2: xM, y2: bot, class: "axis" }, s);
  for (const f of [2.5, 3, 4, 5, 6, 8, 10, 15, 20, 30]) { tick(s, xM, yMid(f), xM + 9, yMid(f)); text(s, xM + 14, yMid(f) + 5, f, "tick-label", "start"); }
  for (const f of [3.5, 4.5, 7, 9, 12, 25]) tick(s, xM, yMid(f), xM + 5, yMid(f), true);
  tick(s, xM, bot, xM + 9, bot); text(s, xM + 14, bot + 5, "∞", "tick-label", "start");
  text(s, xM, top - 22, "Focal f", "scale-name");
  text(s, 180, 408, "cm on every scale", "scale-unit");
  const line = el("line", { class: "index-line" }, svg);
  svg.insertBefore(line, s);
  const cross = el("circle", { r: 4.5, class: "cross" }, svg);
  const h = el("g", {}, svg);
  const toX = (y) => 100 / (((bot - y) / (bot - top)) * 20);
  const a = ring(svg, h, "Object distance", (p) => setLens(toX(Math.min(p.y, bot - 1)), lens.v), (k) => setLens(keyStep(lens.u, -k), lens.v));
  const c = ring(svg, h, "Image distance", (p) => setLens(lens.u, toX(Math.min(p.y, bot - 1))), (k) => setLens(lens.u, keyStep(lens.v, -k)));
  views.push(() => {
    const ya = yOut(lens.u), yc = yOut(lens.v);
    line.setAttribute("x1", xA - 30); line.setAttribute("x2", xC + 30);
    const slope = (yc - ya) / (xC - xA);
    line.setAttribute("y1", ya - 30 * slope); line.setAttribute("y2", yc + 30 * slope);
    cross.setAttribute("cx", xM); cross.setAttribute("cy", (ya + yc) / 2);
    a.at(xA, ya, `${lens.u} cm`); c.at(xC, yc, `${lens.v} cm`);
  });
})();

// Shared frame for the two drawings on Cartesian axes.
const O = { x: 56, y: 370 }, K = 5; // 5 px per cm, 0 to 60 cm
const X = (u) => O.x + K * u, Y = (v) => O.y - K * v;
function axes(s, uName, vName) {
  el("line", { x1: O.x, y1: O.y, x2: X(62), y2: O.y, class: "axis" }, s);
  el("line", { x1: O.x, y1: O.y, x2: O.x, y2: Y(62), class: "axis" }, s);
  for (let d = 0; d <= 60; d += 5) {
    const major = d % 10 === 0;
    tick(s, X(d), O.y, X(d), O.y + (major ? 9 : 5), !major);
    tick(s, O.x, Y(d), O.x - (major ? 9 : 5), Y(d), !major);
    if (major) { text(s, X(d), O.y + 25, d, "tick-label"); if (d) text(s, O.x - 13, Y(d) + 5, d, "tick-label", "end"); }
  }
  text(s, X(60), O.y + 44, uName, "scale-name", "end");
  const t = text(s, O.x - 40, Y(60), vName, "scale-name", "end");
  t.setAttribute("transform", `rotate(-90 ${O.x - 40} ${Y(60)})`);
}

// 2. Concurrent scales at a right angle: u across, v up, f on the diagonal.
(function corner() {
  const svg = document.getElementById("lens-corner");
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 380 420");
  const s = el("g", { class: "scales" }, svg);
  axes(s, "Object u, cm", "Image v, cm");
  el("line", { x1: O.x, y1: O.y, x2: X(32), y2: Y(32), class: "axis" }, s);
  const n = Math.SQRT1_2;
  for (let f = 1; f <= 30; f++) {
    const major = f % 5 === 0, L = major ? 9 : 5;
    tick(s, X(f), Y(f), X(f) + L * n, Y(f) + L * n, !major);
    if (major) text(s, X(f) + 14 * n + 3, Y(f) + 14 * n + 8, f, "tick-label", "start");
  }
  text(s, X(32) + 6, Y(32) - 6, "Focal f", "scale-name", "start");
  const line = el("line", { class: "index-line" }, svg);
  svg.insertBefore(line, s);
  const cross = el("circle", { r: 4.5, class: "cross" }, svg);
  const h = el("g", {}, svg);
  const a = ring(svg, h, "Object distance", (p) => setLens((p.x - O.x) / K, lens.v), (k) => setLens(keyStep(lens.u, k), lens.v));
  const c = ring(svg, h, "Image distance", (p) => setLens(lens.u, (O.y - p.y) / K), (k) => setLens(lens.u, keyStep(lens.v, k)));
  views.push(() => {
    const f = focal();
    line.setAttribute("x1", X(lens.u)); line.setAttribute("y1", O.y);
    line.setAttribute("x2", O.x); line.setAttribute("y2", Y(lens.v));
    cross.setAttribute("cx", X(f)); cross.setAttribute("cy", Y(f));
    a.at(X(lens.u), O.y, `${lens.u} cm`); c.at(O.x, Y(lens.v), `${lens.v} cm`);
  });
})();

// 3. A contour chart: the same axes, one point, a family of curves.
const contours = [5, 10, 15, 20, 25];
(function contour() {
  const svg = document.getElementById("lens-contour");
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 380 420");
  const s = el("g", { class: "scales" }, svg);
  for (let d = 10; d <= 60; d += 10) {
    el("line", { x1: X(d), y1: O.y, x2: X(d), y2: Y(60), class: "guide" }, s);
    el("line", { x1: O.x, y1: Y(d), x2: X(60), y2: Y(d), class: "guide" }, s);
  }
  axes(s, "Object u, cm", "Image v, cm");
  for (const f of contours) {
    const u0 = (60 * f) / (60 - f), pts = [];
    for (let i = 0; i <= 80; i++) {
      const u = u0 + ((60 - u0) * i) / 80;
      pts.push(`${X(u).toFixed(1)},${Y((f * u) / (u - f)).toFixed(1)}`);
    }
    el("polyline", { points: pts.join(" "), class: "contour" }, s);
    const t = text(s, X(2 * f) + 4, Y(2 * f) - 6, `f = ${f}`, "tick-label contour-label", "start");
    if (f === 5) t.textContent = "5";
  }
  const guides = el("path", { class: "drop" }, svg);
  const h = el("g", {}, svg);
  const p = ring(svg, h, "Object and image distances",
    (q) => setLens((q.x - O.x) / K, (O.y - q.y) / K),
    (k, key) => (key === "ArrowUp" || key === "ArrowDown" ? setLens(lens.u, keyStep(lens.v, k)) : setLens(keyStep(lens.u, k), lens.v)));
  views.push(() => {
    guides.setAttribute("d", `M${X(lens.u)},${O.y}V${Y(lens.v)}H${O.x}`);
    p.at(X(lens.u), Y(lens.v), `${lens.u} and ${lens.v} cm`);
  });
})();

views.push(() => {
  const f = focal();
  const set = (id, s) => { const n = document.getElementById(id); if (n) n.textContent = s; };
  set("l-u", `${fmt(lens.u)} cm`); set("l-v", `${fmt(lens.v)} cm`); set("l-f", `${fmt(f, 2)} cm`);
  let lo = null, hi = null;
  for (const c of contours) { if (c <= f + 1e-9) lo = c; if (c >= f - 1e-9 && hi === null) hi = c; }
  let read;
  if (lo === hi && lo !== null) read = `on the ${lo}`;
  else if (lo === null) read = "below 5";
  else if (hi === null) read = "above 25";
  else read = `${lo} to ${hi}`;
  set("l-k", read);
});
setLens(lens.u, lens.v);

/* ---------- One quadratic, two drawings: w² + uw + v = 0 ---------- */
const quad = { u: -4, v: 3 };
const qviews = [];
function setQuad(u, v) {
  quad.u = clamp(Math.round(u * 4) / 4, -6, 6);
  quad.v = clamp(Math.round(v * 4) / 4, -10, 4);
  qviews.forEach((f) => f());
}
const roots = () => {
  const D = quad.u * quad.u - 4 * quad.v;
  if (D < 0) return [];
  const r = Math.sqrt(D);
  return D === 0 ? [-quad.u / 2] : [(-quad.u + r) / 2, (-quad.u - r) / 2];
};

// 4. A curved scale. u on the left line at height u, v on the right at
// height v; the w point at x = 1/(1+w), y = −w²/(1+w) on the unit square.
(function curved() {
  const svg = document.getElementById("quad-curved");
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 360 460");
  const x0 = 70, wd = 220, y0 = 178, sc = 24; // y = 0 at y0; 24 px per unit
  const PX = (x) => x0 + wd * x, PY = (y) => y0 - sc * y;
  const W = (w) => [PX(1 / (1 + w)), PY((-w * w) / (1 + w))];
  const s = el("g", { class: "scales" }, svg);
  el("line", { x1: PX(0), y1: PY(6), x2: PX(0), y2: PY(-6), class: "axis" }, s);
  el("line", { x1: PX(1), y1: PY(4), x2: PX(1), y2: PY(-10), class: "axis" }, s);
  for (let u = -6; u <= 6; u++) { const m = u % 2 === 0; tick(s, PX(0), PY(u), PX(0) - (m ? 9 : 5), PY(u), !m); if (m) text(s, PX(0) - 14, PY(u) + 5, fmt(u), "tick-label", "end"); }
  for (let v = -10; v <= 4; v++) { const m = v % 2 === 0; tick(s, PX(1), PY(v), PX(1) + (m ? 9 : 5), PY(v), !m); if (m) text(s, PX(1) + 14, PY(v) + 5, fmt(v), "tick-label", "start"); }
  text(s, PX(0), PY(6) - 18, "u", "scale-name");
  text(s, PX(1), PY(4) - 18, "v", "scale-name");
  const pts = [];
  for (let i = 0; i <= 120; i++) { const w = (8 * i) / 120; pts.push(W(w).map((q) => q.toFixed(1)).join(",")); }
  el("polyline", { points: pts.join(" "), class: "axis curve-scale" }, s);
  for (let w = 0; w <= 8; w += 0.5) {
    const [x, y] = W(w), [x2, y2] = W(w + 0.01);
    let nx = y2 - y, ny = -(x2 - x); const L = Math.hypot(nx, ny); nx /= L; ny /= L;
    if (nx < 0) { nx = -nx; ny = -ny; }
    const major = Number.isInteger(w), len = major ? 9 : 5;
    tick(s, x, y, x + nx * len, y + ny * len, !major);
    if (major && w > 0) text(s, x + nx * 20, y + ny * 20 + 5, w, "tick-label");
  }
  text(s, PX(0.62), PY(-0.95) + 34, "w", "scale-name");
  const line = el("line", { class: "index-line" }, svg);
  svg.insertBefore(line, s);
  const crosses = [0, 1].map(() => el("circle", { r: 4.5, class: "cross" }, svg));
  const h = el("g", {}, svg);
  const a = ring(svg, h, "u", (p) => setQuad((y0 - p.y) / sc, quad.v), (k) => setQuad(quad.u + k * 0.25, quad.v));
  const c = ring(svg, h, "v", (p) => setQuad(quad.u, (y0 - p.y) / sc), (k) => setQuad(quad.u, quad.v + k * 0.25));
  qviews.push(() => {
    const ya = PY(quad.u), yc = PY(quad.v), slope = (yc - ya) / wd;
    line.setAttribute("x1", PX(0) - 20); line.setAttribute("y1", ya - 20 * slope);
    line.setAttribute("x2", PX(1) + 20); line.setAttribute("y2", yc + 20 * slope);
    // Every root that is not negative lies on the curve; a negative one is off it.
    const r = roots().filter((w) => w >= 0);
    crosses.forEach((n, i) => {
      if (r[i] === undefined) { n.style.display = "none"; return; }
      const [x, y] = W(r[i]); n.style.display = ""; n.setAttribute("cx", x); n.setAttribute("cy", y);
    });
    a.at(PX(0), ya, fmt(quad.u, 2)); c.at(PX(1), yc, fmt(quad.v, 2));
  });
})();

// 5. A circular scale. Write w = 3t, so t² + (u/3)t + v/9 = 0, and put t
// at (2t, 2t²)/(1+t²) on the circle x² + (y−1)² = 1. The chord through
// the two roots is then −(u/3)x + (v/9 − 1)y = 2v/9. For every v it
// passes through (−6/u, 2), on the tangent at the top, and for every u
// through (0, 2v/(v − 9)), on the vertical diameter. So u goes on the
// tangent and v on the diameter, and w on the circle.
(function circular() {
  const svg = document.getElementById("quad-circle");
  if (!svg) return;
  svg.setAttribute("viewBox", "0 0 360 400");
  const cx = 180, sc = 80, base = 230; // circle from y = 0 to 2
  const PX = (x) => cx + sc * x, PY = (y) => base - sc * y;
  const Wc = (w) => { const t = w / 3; return [(2 * t) / (1 + t * t), (2 * t * t) / (1 + t * t)]; };
  const yv = (v) => (2 * v) / (v - 9), xu = (u) => -6 / u;
  const s = el("g", { class: "scales" }, svg);
  el("circle", { cx: PX(0), cy: PY(1), r: sc, class: "axis curve-scale" }, s);
  const majors = [0, 1, 2, 3, 4, 6, 9, 15, -1, -2, -3, -4, -6, -9, -15];
  const named = [1, 2, 3, 4, 6, -1, -2, -3, -4, -6];
  for (const w of [...majors, 0.5, 1.5, 2.5, 5, -0.5, -1.5, -2.5, -5]) {
    const [x, y] = Wc(w), nx = x, ny = y - 1; // outward normal
    const major = majors.includes(w), len = major ? 9 : 5;
    tick(s, PX(x), PY(y), PX(x + (nx * len) / sc), PY(y + (ny * len) / sc), !major);
    if (named.includes(w)) text(s, PX(x + (nx * 21) / sc), PY(y + (ny * 21) / sc) + 5, fmt(w), "tick-label");
  }
  text(s, PX(0) - 8, PY(2) + 20, "±∞", "tick-label inner", "end");
  text(s, PX(0) - 24, PY(0) + 10, "0", "tick-label", "end");
  text(s, PX(-1) - 30, PY(1.55), "w", "scale-name");
  el("line", { x1: PX(-2.1), y1: PY(2), x2: PX(2.1), y2: PY(2), class: "axis" }, s);
  for (const u of [-6, -5, -4, -3, 3, 4, 5, 6]) {
    tick(s, PX(xu(u)), PY(2), PX(xu(u)), PY(2) - 9);
    text(s, PX(xu(u)), PY(2) - 15, fmt(u), "tick-label");
  }
  for (const u of [-5.5, -4.5, -3.5, 3.5, 4.5, 5.5]) tick(s, PX(xu(u)), PY(2), PX(xu(u)), PY(2) - 5, true);
  text(s, PX(0), PY(2) - 36, "u", "scale-name");
  el("line", { x1: PX(0), y1: PY(2), x2: PX(0), y2: PY(yv(4)) + 6, class: "axis" }, s);
  for (let v = -10; v <= 4; v++) {
    const y = PY(yv(v)), m = v % 2 === 0;
    tick(s, PX(0), y, PX(0) + (m ? 9 : 5), y, !m);
    if ([-10, -4, -2, 2, 4].includes(v)) text(s, PX(0) + 13, y + 5, fmt(v), "tick-label inner", "start");
    if (v === 0) text(s, PX(0) + 13, y + 16, "0", "tick-label inner", "start");
  }
  text(s, PX(0), PY(yv(4)) + 30, "v", "scale-name");
  const line = el("line", { class: "index-line" }, svg);
  svg.insertBefore(line, s);
  const crossA = el("circle", { r: 4.5, class: "cross" }, svg);
  const crossB = el("circle", { r: 4.5, class: "cross" }, svg);
  const h = el("g", {}, svg);
  const toU = (x) => { const X0 = (x - cx) / sc; const m = clamp(Math.abs(X0), 1, 2); return -6 / (X0 < 0 ? -m : m); };
  const toV = (y) => { const Y0 = clamp((base - y) / sc, yv(4), yv(-10)); return (9 * Y0) / (Y0 - 2); };
  const a = ring(svg, h, "u", (p) => setQuad(toU(p.x), quad.v), (k) => setQuad(quad.u + k * 0.25, quad.v));
  const c = ring(svg, h, "v", (p) => setQuad(quad.u, toV(p.y)), (k) => setQuad(quad.u, quad.v + k * 0.25));
  qviews.push(() => {
    // The line through B(v) toward A(u); A is off the tangent when |u| < 3.
    const by = yv(quad.v), dx = -6, dy = quad.u * (2 - by), L = Math.hypot(dx, dy);
    line.setAttribute("x1", PX((dx / L) * 3)); line.setAttribute("y1", PY(by + (dy / L) * 3));
    line.setAttribute("x2", PX(-(dx / L) * 3)); line.setAttribute("y2", PY(by - (dy / L) * 3));
    const on = Math.abs(quad.u) >= 3;
    a.g.style.display = on ? "" : "none";
    if (on) a.at(PX(xu(quad.u)), PY(2), fmt(quad.u, 2));
    c.at(PX(0), PY(by), fmt(quad.v, 2));
    const r = roots();
    [crossA, crossB].forEach((n, i) => {
      if (r[i] === undefined) { n.style.display = "none"; return; }
      const [x, y] = Wc(r[i]); n.style.display = ""; n.setAttribute("cx", PX(x)); n.setAttribute("cy", PY(y));
    });
  });
})();

qviews.push(() => {
  const set = (id, s) => { const n = document.getElementById(id); if (n) n.textContent = s; };
  set("q-u", fmt(quad.u, 2)); set("q-v", fmt(quad.v, 2));
  const r = roots();
  set("q-r", r.length === 0 ? "none" : r.map((w) => fmt(w, 2)).join(" and "));
  const D = quad.u * quad.u - 4 * quad.v;
  set("q-o", quad.u === 0 ? "" : "");
  set("q-d", D > 0 ? "line crosses the circle twice" : D === 0 ? "line touches the circle" : "line misses the circle");
});
setQuad(quad.u, quad.v);
