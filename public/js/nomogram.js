// Parallel-scale nomogram engine for Index Line.
//
// Two outer scales, A on the left and C on the right, carry the inputs.
// Each middle scale carries a relation of the form
//   g(u) = alpha * fA(a) + beta * fC(c) + gamma
// and sits where a straight line through (a, c) crosses it at u.
// Outer scale A is drawn at height m1 * (fA(a) - fA(minA)), C likewise.
// A middle scale at fraction d of the way from A to C then reads
//   y = (1 - d) * yA + d * yC,
// which is proportional to alpha * fA + beta * fC when
//   (1 - d) * m1 / (d * m2) = alpha / beta.

const NS = "http://www.w3.org/2000/svg";

function el(name, attrs, parent) {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

// Inverts a monotonic function on [lo, hi] by bisection.
export function invert(fn, target, lo, hi) {
  const rising = fn(hi) > fn(lo);
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if ((fn(mid) < target) === rising) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Values from `from` to `to` in steps of `step`, without float drift.
export function range(from, to, step) {
  const out = [];
  const n = Math.round((to - from) / step);
  for (let i = 0; i <= n; i++) out.push(+(from + i * step).toFixed(6));
  return out;
}

export function nomogram(svg, cfg, onChange) {
  const W = cfg.width || 640;
  const H = cfg.height || 760;
  const top = cfg.top ?? 48;
  const bottom = H - (cfg.bottomPad ?? 48);
  const xA = cfg.xA ?? 96;
  const xC = cfg.xC ?? W - 96;
  const { A, C } = cfg;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.classList.add("nomo");

  // An outer scale may span more paper than its ring can reach (lo, hi),
  // so that two scales share one ruler.
  const a0 = A.f(A.lo ?? A.min);
  const c0 = C.f(C.lo ?? C.min);
  const m1 = (bottom - top) / (A.f(A.hi ?? A.max) - a0);
  const m2 = (bottom - top) / (C.f(C.hi ?? C.max) - c0);

  const yA = (v) => bottom - m1 * (A.f(v) - a0);
  const yC = (v) => bottom - m2 * (C.f(v) - c0);

  const mids = cfg.mids.map((m) => {
    const d = (m.beta * m1) / (m.alpha * m2 + m.beta * m1);
    const k = ((1 - d) * m1) / m.alpha;
    const offset = m.gamma + m.alpha * a0 + m.beta * c0;
    return {
      ...m,
      d,
      x: xA + d * (xC - xA),
      y: (u) => bottom - k * (m.g(u) - offset),
      read: (a, c) =>
        invert(m.g, m.alpha * A.f(a) + m.beta * C.f(c) + m.gamma, m.min, m.max),
    };
  });

  // Scales.
  const scales = el("g", { class: "scales" }, svg);

  function drawScale(x, yOf, s, side) {
    const g = el("g", { class: "scale" }, scales);
    const dir = side === "left" ? -1 : 1;
    const inside = (y) => y >= top - 0.5 && y <= bottom + 0.5;
    const ys = [...s.ticks.major, ...s.ticks.minor].map(yOf).filter(inside);
    el("line", { x1: x, x2: x, y1: Math.min(...ys), y2: Math.max(...ys), class: "axis" }, g);
    for (const v of s.ticks.minor) {
      const y = yOf(v);
      if (!inside(y)) continue;
      el("line", { x1: x, x2: x + dir * 6, y1: y, y2: y, class: "tick minor" }, g);
    }
    for (const v of s.ticks.major) {
      const y = yOf(v);
      if (!inside(y)) continue;
      el("line", { x1: x, x2: x + dir * 12, y1: y, y2: y, class: "tick major" }, g);
      const t = el("text", {
        x: x + dir * 16, y: y + 4.5, class: "tick-label",
        "text-anchor": side === "left" ? "end" : "start",
      }, g);
      t.textContent = (s.fmt || String)(v);
    }
    // A scale may carry a second graduation on its other side (s.inner),
    // for another quantity that is a function of this one: inner.to maps
    // an inner value to this scale's value.
    if (s.inner) {
      const t = s.inner;
      for (const [vals, len, cls] of [[t.ticks.minor, 5, "minor"], [t.ticks.major, 10, "major"]]) {
        for (const v of vals) {
          const y = yOf(t.to(v));
          if (!inside(y)) continue;
          el("line", { x1: x, x2: x - dir * len, y1: y, y2: y, class: `tick inner ${cls}` }, g);
          if (cls === "minor") continue;
          const lab = el("text", {
            x: x - dir * 14, y: y + 4, class: "tick-label inner",
            "text-anchor": side === "left" ? "start" : "end",
          }, g);
          lab.textContent = (t.fmt || String)(v);
        }
      }
      if (t.label) {
        const sub = el("text", {
          x: x - dir * 6, y: bottom + 54, class: "scale-unit inner",
          "text-anchor": side === "left" ? "start" : "end",
        }, g);
        sub.textContent = t.label;
      }
    }
    // Paired middle scales set their names to one side so they do not collide.
    const anchor = s.nameAnchor || "middle";
    const nx = x + (anchor === "end" ? 4 : anchor === "start" ? -4 : 0);
    const head = el("text", { x: nx, y: top - 22 + (s.nameDy || 0), class: "scale-name", "text-anchor": anchor }, g);
    head.textContent = s.label;
    if (s.unit) {
      const unit = el("text", { x: nx, y: bottom + 30, class: "scale-unit", "text-anchor": anchor }, g);
      unit.textContent = s.unit;
    }
    return g;
  }

  drawScale(xA, yA, A, "left");
  drawScale(xC, yC, C, "right");
  for (const m of mids) drawScale(m.x, m.y, m, m.side || "right");

  // Index line, crossing marks and handles.
  // The line may run a little past the outer scales, but never off the
  // drawing into the names and units.
  const clipId = `clip-${Math.random().toString(36).slice(2)}`;
  const clip = el("clipPath", { id: clipId }, el("defs", {}, svg));
  el("rect", { x: 0, y: top - 12, width: W, height: bottom - top + 24 }, clip);
  const line = el("line", { class: "index-line", "clip-path": `url(#${clipId})` }, svg);
  const marks = mids.map(() => el("circle", { r: 4.5, class: "cross" }, svg));

  const state = { a: A.value, c: C.value };

  function handle(s, x, yOf, key) {
    const g = el("g", {
      class: "handle", tabindex: "0", role: "slider",
      "aria-label": s.label, "aria-valuemin": s.min, "aria-valuemax": s.max,
    }, svg);
    // A wide transparent strip makes the whole scale a target.
    const hit = el("rect", {
      x: x - 28, y: top - 8, width: 56, height: bottom - top + 16, class: "hit",
    }, svg);
    svg.insertBefore(hit, line);
    const ring = el("circle", { r: 11, class: "handle-ring" }, g);
    const dot = el("circle", { r: 3.5, class: "handle-dot" }, g);

    // A scale may round its values its own way (s.snap); the ring still
    // stays within min and max.
    const clamp = (v) => Math.min(s.max, Math.max(s.min, v));
    const snap = (v) => {
      if (s.snap) return clamp(s.snap(clamp(v)));
      const n = Math.round((v - s.min) / s.step);
      return clamp(+(s.min + n * s.step).toFixed(6));
    };
    const fromY = (y) => {
      const yc = Math.min(bottom, Math.max(top, y));
      const fv = (bottom - yc) / (key === "a" ? m1 : m2) + (key === "a" ? a0 : c0);
      return snap(invert(s.f, fv, s.min, s.max));
    };
    const toSvgY = (evt) => {
      const pt = svg.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse()).y;
    };

    let dragging = false;
    const start = (evt) => {
      dragging = true;
      g.focus({ preventScroll: true });
      (evt.currentTarget).setPointerCapture(evt.pointerId);
      state[key] = fromY(toSvgY(evt));
      update();
      evt.preventDefault();
    };
    const move = (evt) => {
      if (!dragging) return;
      state[key] = fromY(toSvgY(evt));
      update();
    };
    const end = () => { dragging = false; };
    for (const target of [g, hit]) {
      target.addEventListener("pointerdown", start);
      target.addEventListener("pointermove", move);
      target.addEventListener("pointerup", end);
      target.addEventListener("pointercancel", end);
    }
    g.addEventListener("keydown", (evt) => {
      const big = evt.shiftKey ? 10 : 1;
      let dir = 0;
      let v = state[key];
      if (evt.key === "ArrowUp" || evt.key === "ArrowRight") dir = 1;
      else if (evt.key === "ArrowDown" || evt.key === "ArrowLeft") dir = -1;
      else if (evt.key === "Home") v = s.min;
      else if (evt.key === "End") v = s.max;
      else return;
      // Step until the rounded value moves, so a coarse snap cannot stall.
      const here = snap(state[key]);
      let next = snap(v);
      for (let i = 0; dir && i < 200 && next === here; i++) {
        v += dir * s.step * big;
        next = snap(v);
      }
      state[key] = next;
      update();
      evt.preventDefault();
    });

    return (v) => {
      const y = yOf(v);
      ring.setAttribute("cx", x); ring.setAttribute("cy", y);
      dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      g.setAttribute("aria-valuenow", v);
      g.setAttribute("aria-valuetext", `${(s.fmt || String)(v)} ${s.unit || ""}`.trim());
    };
  }

  const placeA = handle(A, xA, yA, "a");
  const placeC = handle(C, xC, yC, "c");

  function update() {
    const ya = yA(state.a);
    const yc = yC(state.c);
    const slope = (yc - ya) / (xC - xA);
    const ext = 22;
    line.setAttribute("x1", xA - ext);
    line.setAttribute("y1", ya - slope * ext);
    line.setAttribute("x2", xC + ext);
    line.setAttribute("y2", yc + slope * ext);
    const results = mids.map((m, i) => {
      const u = m.read(state.a, state.c);
      marks[i].setAttribute("cx", m.x);
      marks[i].setAttribute("cy", ya + slope * (m.x - xA));
      return u;
    });
    placeA(state.a);
    placeC(state.c);
    if (onChange) onChange(state.a, state.c, results);
  }

  update();
  return { set(a, c) { state.a = a; state.c = c; update(); } };
}
