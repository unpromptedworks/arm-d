// Four-variable nomogram with a pivot line (a turning axis), for Index Line.
//
// Five parallel lines: outer scale A, middle scale B, the turning axis P,
// middle scale C, outer scale D. The chart solves
//   p = qA + qB = qC + qD,
// where each q is a scale's additive quantity (on Sheet 08, stops).
// The first line runs from A through B to a point on P; the second runs
// from that point through C to D. Each half is a three-scale sum chart
// with P as one of its outer scales.
//
// Geometry. P is drawn at yP = Y0 - k p. With B at fraction d1 of the way
// from A to P, B reads yB = (1 - d1) yA + d1 yP; for that to depend only on
// qB, A must run the other way at k d1 / (1 - d1) per unit, and B then runs
// at k d1 per unit. The second half is the same with C at fraction d2 of
// the way from D to P.
//
// Values are kept as whole steps (cfg.unit steps per unit of q: three on
// Sheet 08, for thirds of a stop), so the arithmetic never drifts.

const NS = "http://www.w3.org/2000/svg";

function el(name, attrs, parent) {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

export function turning(svg, cfg, onChange) {
  const W = cfg.width, H = cfg.height;
  const top = cfg.top ?? 70, bottom = H - (cfg.bottomPad ?? 70);
  const per = cfg.unit || 1;
  const { A, B, C, D, P } = cfg;
  const k = (bottom - top) / ((P.max - P.min) / per);
  const d1 = (B.x - A.x) / (P.x - A.x);
  const d2 = (D.x - C.x) / (D.x - P.x);
  const kA = (k * d1) / (1 - d1), kB = k * d1;
  const kD = (k * d2) / (1 - d2), kC = k * d2;
  const mid = (top + bottom) / 2;
  const half = (s) => (s.min + s.max) / 2 / per;

  // P fills the drawing; A and D are centred on it.
  const Y0 = mid + k * half(P);
  const yP = (p) => Y0 - (k * p) / per;
  const A0 = mid - kA * half(A);
  const D0 = mid - kD * half(D);
  const yA = (q) => A0 + (kA * q) / per;
  const yD = (q) => D0 + (kD * q) / per;
  const yB = (q) => (1 - d1) * A0 + d1 * Y0 - (kB * q) / per;
  const yC = (q) => (1 - d2) * D0 + d2 * Y0 - (kC * q) / per;
  const geo = { A: yA, B: yB, C: yC, D: yD, P: yP };

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.classList.add("nomo", "turning");

  const scales = el("g", { class: "scales" }, svg);

  function drawScale(s, yOf) {
    const g = el("g", { class: `scale${s.className ? " " + s.className : ""}` }, scales);
    const x = s.x;
    const ends = [yOf(s.min), yOf(s.max)];
    el("line", { x1: x, x2: x, y1: Math.min(...ends), y2: Math.max(...ends), class: s.axisClass || "axis" }, g);
    // Each graduation is a list of { q, label?, cls? } on one side of the axis.
    for (const grad of s.grads || []) {
      const dir = grad.side === "left" ? -1 : 1;
      const gg = el("g", { class: grad.className || "" }, g);
      for (const t of grad.ticks) {
        const y = yOf(t.q);
        const len = t.label === undefined ? (grad.minor ?? 6) : (grad.major ?? 12);
        el("line", { x1: x, x2: x + dir * len, y1: y, y2: y, class: `tick ${t.label === undefined ? "minor" : "major"}` }, gg);
        if (t.label === undefined) continue;
        const lab = el("text", {
          x: x + dir * (len + 4), y: y + 4.5,
          class: `tick-label${t.cls ? " " + t.cls : ""}`,
          "text-anchor": dir < 0 ? "end" : "start",
        }, gg);
        lab.textContent = t.label;
      }
    }
    const lines = s.name || [s.label];
    const nx = x + (s.nameDx || 0);
    const head = el("text", { x: nx, y: Math.min(...ends) - 24, class: "scale-name", "text-anchor": s.nameAnchor || "middle" }, g);
    lines.forEach((text, i) => {
      const span = el("tspan", { x: nx, dy: i ? "1.15em" : `${-(lines.length - 1) * 1.15}em` }, head);
      span.textContent = text;
    });
    if (s.unit) {
      const unit = el("text", { x: nx, y: Math.max(...ends) + 30, class: "scale-unit", "text-anchor": s.nameAnchor || "middle" }, g);
      unit.textContent = s.unit;
    }
    return g;
  }

  const pivotG = drawScale(P, yP);
  for (const key of ["A", "B", "C", "D"]) drawScale(cfg[key], geo[key]);

  const clipId = `clip-${Math.random().toString(36).slice(2)}`;
  const clip = el("clipPath", { id: clipId }, el("defs", {}, svg));
  el("rect", { x: 0, y: top - 14, width: W, height: bottom - top + 28 }, clip);
  const line1 = el("line", { class: "index-line", "clip-path": `url(#${clipId})` }, svg);
  const line2 = el("line", { class: "index-line", "clip-path": `url(#${clipId})` }, svg);
  const pivot = el("circle", { r: 5, class: "cross pivot" }, svg);
  // The lines run under the scales, so that labels (with a paper-coloured
  // halo) stay legible where a line crosses them.
  svg.insertBefore(line2, scales);
  svg.insertBefore(line1, line2);

  const state = { A: A.value, B: B.value, C: C.value, D: D.value, held: cfg.held || "C" };
  const clampTo = (s, v) => Math.min(s.max, Math.max(s.min, v));

  function handle(key) {
    const s = cfg[key];
    const yOf = geo[key];
    const g = el("g", {
      class: "handle", tabindex: "0", role: "slider",
      "aria-label": s.label, "aria-valuemin": s.min, "aria-valuemax": s.max,
    }, svg);
    const ends = [yOf(s.min), yOf(s.max)];
    const hit = el("rect", {
      x: s.x - 26, y: Math.min(...ends) - 10, width: 52, height: Math.abs(ends[1] - ends[0]) + 20, class: "hit",
    }, svg);
    svg.insertBefore(hit, line1);
    const ring = el("circle", { r: 11, class: "handle-ring" }, g);
    const dot = el("circle", { r: 3.5, class: "handle-dot" }, g);
    // The scale's position is linear in q, so a height inverts directly.
    const fromY = (y) => {
      const q0 = s.min, q1 = s.max;
      const t = (y - yOf(q0)) / (yOf(q1) - yOf(q0));
      return clampTo(s, Math.round(q0 + t * (q1 - q0)));
    };
    const toSvgY = (evt) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse()).y;
    };
    let dragging = false;
    const set = (v) => {
      state[key] = v;
      if (key === "C" || key === "D") state.held = key;
      update();
    };
    const start = (evt) => {
      dragging = true;
      g.focus({ preventScroll: true });
      evt.currentTarget.setPointerCapture(evt.pointerId);
      set(fromY(toSvgY(evt)));
      evt.preventDefault();
    };
    const move = (evt) => { if (dragging) set(fromY(toSvgY(evt))); };
    const end = () => { dragging = false; };
    for (const target of [g, hit]) {
      target.addEventListener("pointerdown", start);
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerup", end);
      target.addEventListener("pointercancel", end);
    }
    // Arrow up always moves the ring up the drawing, whichever way the
    // scale runs.
    const upIsMore = yOf(s.max) < yOf(s.min);
    g.addEventListener("keydown", (evt) => {
      const big = evt.shiftKey ? per : 1;
      let v = state[key];
      if (evt.key === "ArrowUp" || evt.key === "ArrowRight") v += (upIsMore ? 1 : -1) * big;
      else if (evt.key === "ArrowDown" || evt.key === "ArrowLeft") v -= (upIsMore ? 1 : -1) * big;
      else if (evt.key === "Home") v = s.min;
      else if (evt.key === "End") v = s.max;
      else return;
      set(clampTo(s, v));
      evt.preventDefault();
    });
    return (v, off) => {
      const y = yOf(clampTo(s, v));
      for (const c of [ring, dot]) { c.setAttribute("cx", s.x); c.setAttribute("cy", y); }
      g.classList.toggle("off-scale", !!off);
      g.setAttribute("aria-valuenow", v);
      g.setAttribute("aria-valuetext", s.fmt ? s.fmt(clampTo(s, v)) : String(v));
    };
  }

  const place = { A: handle("A"), B: handle("B"), C: handle("C"), D: handle("D") };

  function stretch(line, x1, y1, x2, y2, ext) {
    const slope = (y2 - y1) / (x2 - x1);
    const lo = Math.min(x1, x2) - ext, hi = Math.max(x1, x2) + ext;
    line.setAttribute("x1", lo); line.setAttribute("y1", y1 + slope * (lo - x1));
    line.setAttribute("x2", hi); line.setAttribute("y2", y1 + slope * (hi - x1));
  }

  function update() {
    const p = state.A + state.B;
    // The ring the reader set last on the second half stays; the other is
    // solved. If the solution runs off its scale, the ring stops at the end
    // and the sheet is told by how much.
    const free = state.held === "C" ? "D" : "C";
    const want = p - state[state.held];
    const s = cfg[free];
    const got = clampTo(s, want);
    state[free] = got;
    const short = want - got;

    const xa = A.x, ya = yA(state.A);
    const xp = P.x, yp = yP(p);
    stretch(line1, xa, ya, xp, yp, 18);
    line1.setAttribute("x2", xp); line1.setAttribute("y2", yp);
    // The second line goes through the pivot and the held ring; when the
    // free ring is off its scale the line shows where it would need to be.
    const xh = cfg[state.held].x, yh = geo[state.held](state[state.held]);
    const slope = (yh - yp) / (xh - xp);
    const xEnd = D.x + 18;
    line2.setAttribute("x1", xp); line2.setAttribute("y1", yp);
    line2.setAttribute("x2", xEnd); line2.setAttribute("y2", yp + slope * (xEnd - xp));
    pivot.setAttribute("cx", xp); pivot.setAttribute("cy", yp);

    place.A(state.A); place.B(state.B);
    place.C(state.C, free === "C" && short !== 0);
    place.D(state.D, free === "D" && short !== 0);
    if (onChange) onChange({ ...state, p, free, short });
  }

  update();
  return {
    set(values) { Object.assign(state, values); update(); },
    pivotG, geo, k, d1, d2,
  };
}
