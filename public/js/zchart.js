// Z chart engine for Index Line: k = fA(a) / fC(c).
//
// Scale A stands on the left and rises from the bottom-left corner;
// scale C stands on the right and falls from the top-right corner. Both
// are drawn from zero at their corner: A at height m1 * fA(a) above the
// bottom, C at depth m2 * fC(c) below the top. The diagonal joins the
// two corners. A and C are parallel, so the line through a and c cuts
// two similar triangles off them, and it crosses the diagonal at the
// fraction
//   t = m1 fA / (m1 fA + m2 fC) = k / (k + s),   s = m2 / m1,
// of the way from the bottom-left corner: 0 at that corner, infinity at
// the other. The diagonal is graduated by that fraction.

const NS = "http://www.w3.org/2000/svg";

function el(name, attrs, parent) {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs || {})) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

export function zchart(svg, cfg, onChange) {
  const W = cfg.width || 600;
  const H = cfg.height || 860;
  const top = cfg.top ?? 60;
  const bottom = H - (cfg.bottomPad ?? 80);
  const xA = cfg.xA ?? 110;
  const xC = cfg.xC ?? W - 110;
  const { A, C, D } = cfg;
  const L = bottom - top;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.classList.add("nomo");

  const m1 = L / A.f(A.hi ?? A.max);
  const m2 = L / C.f(C.hi ?? C.max);
  const s = m2 / m1;
  const yA = (v) => bottom - m1 * A.f(v);
  const yC = (v) => top + m2 * C.f(v);

  // The diagonal, from (xA, bottom) at k = 0 to (xC, top) at k = infinity.
  const dx = xC - xA, dy = top - bottom, len = Math.hypot(dx, dy);
  const nx = dy / len, ny = -dx / len;     // unit normal, pointing up and left
  const tOf = (k) => k / (k + s);
  const pt = (k) => { const t = tOf(k); return [xA + t * dx, bottom + t * dy]; };

  const scales = el("g", { class: "scales" }, svg);

  // Outer scales: a faint ruler from zero at the corner, the working part
  // in ink with its ticks.
  function drawOuter(x, yOf, sc, side) {
    const g = el("g", { class: "scale" }, scales);
    const dir = side === "left" ? -1 : 1;
    const ys = [...sc.ticks.major, ...sc.ticks.minor].map(yOf);
    const y0 = yOf(0);
    const yNear = side === "left" ? Math.max(...ys) : Math.min(...ys);
    el("line", { x1: x, x2: x, y1: y0, y2: yNear, class: "axis faint" }, g);
    el("line", { x1: x, x2: x, y1: Math.min(...ys), y2: Math.max(...ys), class: "axis" }, g);
    el("line", { x1: x, x2: x + dir * 12, y1: y0, y2: y0, class: "tick major" }, g);
    const z = el("text", { x: x + dir * 16, y: y0 + 4.5, class: "tick-label faint", "text-anchor": side === "left" ? "end" : "start" }, g);
    z.textContent = "0";
    for (const v of sc.ticks.minor) {
      const y = yOf(v);
      el("line", { x1: x, x2: x + dir * 6, y1: y, y2: y, class: "tick minor" }, g);
    }
    for (const v of sc.ticks.major) {
      const y = yOf(v);
      el("line", { x1: x, x2: x + dir * 12, y1: y, y2: y, class: "tick major" }, g);
      const t = el("text", { x: x + dir * 16, y: y + 4.5, class: "tick-label", "text-anchor": side === "left" ? "end" : "start" }, g);
      t.textContent = (sc.fmt || String)(v);
    }
    // Names go at the far end from the zero corner.
    const ny0 = side === "left" ? top - 30 : bottom + 34;
    const head = el("text", { x, y: ny0, class: "scale-name", "text-anchor": "middle" }, g);
    head.textContent = sc.label;
    if (sc.unit) {
      const u = el("text", { x, y: ny0 + 18, class: "scale-unit", "text-anchor": "middle" }, g);
      u.textContent = sc.unit;
    }
  }
  drawOuter(xA, yA, A, "left");
  drawOuter(xC, yC, C, "right");

  // The diagonal: faint from corner to corner, ink over its working range,
  // ratio ticks on its upper-left side and a second graduation (D.inner)
  // on its lower-right side.
  {
    const g = el("g", { class: "scale diagonal" }, scales);
    el("line", { x1: xA, y1: bottom, x2: xC, y2: top, class: "axis faint" }, g);
    const all = [...D.ticks.major, ...D.ticks.minor];
    const [x1, y1] = pt(Math.min(...all));
    const [x2, y2] = pt(Math.max(...all));
    el("line", { x1, y1, x2, y2, class: "axis" }, g);
    const tick = (k, sign, size, cls, label, fmt) => {
      const [px, py] = pt(k);
      el("line", { x1: px, y1: py, x2: px + sign * nx * size, y2: py + sign * ny * size, class: `tick ${cls}` }, g);
      if (!label) return;
      const t = el("text", {
        x: px + sign * nx * (size + 6), y: py + sign * ny * (size + 6) + 4.5,
        class: `tick-label ${cls.includes("inner") ? "inner" : ""}`,
        "text-anchor": sign > 0 ? "end" : "start",
      }, g);
      t.textContent = fmt(k);
    };
    for (const k of D.ticks.minor) tick(k, 1, 6, "minor");
    for (const k of D.ticks.major) tick(k, 1, 12, "major", true, D.fmt || String);
    if (D.inner) {
      const I = D.inner;
      for (const v of I.ticks.minor) tick(I.to(v), -1, 5, "inner minor");
      for (const v of I.ticks.major) tick(I.to(v), -1, 10, "inner major", true, () => (I.fmt || String)(v));
    }
    // Zero and infinity at the corners.
    const c0 = el("text", { x: xA + 14, y: bottom + 22, class: "tick-label faint", "text-anchor": "start" }, g);
    c0.textContent = "0";
    const c1 = el("text", { x: xC - 14, y: top - 10, class: "tick-label faint", "text-anchor": "end" }, g);
    c1.textContent = "∞";
    // Names run along the empty lower stretch of the diagonal.
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const name = (k, sign, text, cls) => {
      const [px, py] = pt(k);
      const x = px + sign * nx * 14, y = py + sign * ny * 14;
      const t = el("text", { x, y, class: cls, "text-anchor": "middle", transform: `rotate(${angle} ${x} ${y})`, "dominant-baseline": sign > 0 ? "auto" : "hanging" }, g);
      t.textContent = text;
    };
    name(D.nameAt, 1, D.label, "scale-name");
    if (D.inner?.label) name(D.nameAt, -1, D.inner.label, "scale-unit");
  }

  // Index line, a fan of other lines through the same point, the crossing
  // mark and the two rings.
  const clipId = `clip-${Math.random().toString(36).slice(2)}`;
  const clip = el("clipPath", { id: clipId }, el("defs", {}, svg));
  el("rect", { x: xA - 24, y: top - 14, width: xC - xA + 48, height: L + 28 }, clip);
  const fan = el("g", { class: "fan", "clip-path": `url(#${clipId})` }, svg);
  const line = el("line", { class: "index-line", "clip-path": `url(#${clipId})` }, svg);
  const mark = el("circle", { r: 4.5, class: "cross" }, svg);

  const state = { a: A.value, c: C.value };

  function handle(sc, x, yOf, key, f, m, fromTop) {
    const g = el("g", {
      class: "handle", tabindex: "0", role: "slider",
      "aria-label": sc.label, "aria-valuemin": sc.min, "aria-valuemax": sc.max,
    }, svg);
    const ys = [yOf(sc.min), yOf(sc.max)];
    const hit = el("rect", { x: x - 28, y: Math.min(...ys) - 10, width: 56, height: Math.abs(ys[1] - ys[0]) + 20, class: "hit" }, svg);
    svg.insertBefore(hit, fan);
    const ring = el("circle", { r: 11, class: "handle-ring" }, g);
    const dot = el("circle", { r: 3.5, class: "handle-dot" }, g);
    const clamp = (v) => Math.min(sc.max, Math.max(sc.min, v));
    const snap = (v) => clamp(Math.round(v / sc.step) * sc.step);
    // Outer scales here are linear in f, so f's inverse is a division.
    const fromY = (y) => snap(sc.inv((fromTop ? y - top : bottom - y) / m));
    const svgY = (evt) => {
      const p = svg.createSVGPoint();
      p.x = evt.clientX; p.y = evt.clientY;
      return p.matrixTransform(svg.getScreenCTM().inverse()).y;
    };
    let dragging = false;
    const start = (evt) => {
      dragging = true;
      g.focus({ preventScroll: true });
      evt.currentTarget.setPointerCapture(evt.pointerId);
      state[key] = fromY(svgY(evt)); update(); evt.preventDefault();
    };
    const move = (evt) => { if (dragging) { state[key] = fromY(svgY(evt)); update(); } };
    const end = () => { dragging = false; };
    for (const t of [g, hit]) {
      t.addEventListener("pointerdown", start);
      t.addEventListener("pointermove", move);
      t.addEventListener("pointerup", end);
      t.addEventListener("pointercancel", end);
    }
    g.addEventListener("keydown", (evt) => {
      const big = evt.shiftKey ? 5 : 1;
      // Up means up the page on both scales.
      const up = fromTop ? -1 : 1;
      let v = state[key];
      if (evt.key === "ArrowUp" || evt.key === "ArrowRight") v += up * sc.step * big;
      else if (evt.key === "ArrowDown" || evt.key === "ArrowLeft") v -= up * sc.step * big;
      else if (evt.key === "Home") v = sc.min;
      else if (evt.key === "End") v = sc.max;
      else return;
      state[key] = snap(v); update(); evt.preventDefault();
    });
    return (v) => {
      const y = yOf(v);
      for (const c of [ring, dot]) { c.setAttribute("cx", x); c.setAttribute("cy", y); }
      g.setAttribute("aria-valuenow", v);
      g.setAttribute("aria-valuetext", `${(sc.fmt || String)(v)} ${sc.unit || ""}`.trim());
    };
  }
  const placeA = handle(A, xA, yA, "a", A.f, m1, false);
  const placeC = handle(C, xC, yC, "c", C.f, m2, true);

  const ext = 18;
  function setLine(node, a, c) {
    const ya = yA(a), yc = yC(c), slope = (yc - ya) / (xC - xA);
    node.setAttribute("x1", xA - ext); node.setAttribute("y1", ya - slope * ext);
    node.setAttribute("x2", xC + ext); node.setAttribute("y2", yc + slope * ext);
  }

  function update() {
    const { a, c } = state;
    const k = A.f(a) / C.f(c);
    setLine(line, a, c);
    const [px, py] = pt(k);
    mark.setAttribute("cx", px); mark.setAttribute("cy", py);
    // Other pairs in range that give exactly the same k.
    fan.replaceChildren();
    const pairs = cfg.same ? cfg.same(a, c) : [];
    for (const [a2, c2] of pairs) setLine(el("line", { class: "fan-line" }, fan), a2, c2);
    placeA(a); placeC(c);
    if (onChange) onChange(a, c, k, pairs);
  }
  update();
  return { set(a, c) { state.a = a; state.c = c; update(); } };
}
