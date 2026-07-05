// ---- nav: switch panels ----
const btns = document.querySelectorAll('.nav-btn');
const panels = document.querySelectorAll('.panel');
btns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    btns.forEach(b => b.setAttribute('aria-current', b === btn ? 'true' : 'false'));
    panels.forEach(p => p.classList.toggle('active', p.id === target));
    const panel = document.getElementById(target);
    panel.focus({ preventScroll: true });
    document.querySelector('.content').scrollIntoView({ block: 'start', behavior: 'smooth' });
  });
});

// ---- signature: slow topology mesh ----
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('mesh');
  const ctx = canvas.getContext('2d');
  let w, h, nodes, edges, dpr;

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';

    const count = Math.max(14, Math.round((innerWidth * innerHeight) / 95000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18 * dpr,
      vy: (Math.random() - 0.5) * 0.18 * dpr
    }));

    // connect near neighbours into edges; assign a few traveling pulses
    edges = [];
    const maxD = 170 * dpr;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (Math.hypot(dx, dy) < maxD) {
          edges.push({ a: i, b: j, pulse: Math.random() < 0.18 ? Math.random() : -1 });
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);

    // drift nodes
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    // edges + recompute closeness for fade
    const maxD = 170 * dpr;
    for (const e of edges) {
      const a = nodes[e.a], b = nodes[e.b];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > maxD) continue;
      const fade = (1 - dist / maxD) * 0.5;
      ctx.strokeStyle = 'rgba(52,226,196,' + (fade * 0.4) + ')';
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // traveling pulse along the link (telemetry heartbeat)
      if (e.pulse >= 0) {
        e.pulse += 0.004;
        if (e.pulse > 1) e.pulse = 0;
        const px = a.x + (b.x - a.x) * e.pulse;
        const py = a.y + (b.y - a.y) * e.pulse;
        ctx.fillStyle = 'rgba(52,226,196,' + (fade + 0.25) + ')';
        ctx.beginPath();
        ctx.arc(px, py, 1.6 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // nodes
    for (const n of nodes) {
      ctx.fillStyle = 'rgba(126,146,166,0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.4 * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  function staticDraw() {
    ctx.clearRect(0, 0, w, h);
    const maxD = 170 * dpr;
    for (const e of edges) {
      const a = nodes[e.a], b = nodes[e.b];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > maxD) continue;
      const fade = (1 - dist / maxD) * 0.5;
      ctx.strokeStyle = 'rgba(52,226,196,' + (fade * 0.4) + ')';
      ctx.lineWidth = dpr; ctx.beginPath();
      ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (const n of nodes) {
      ctx.fillStyle = 'rgba(126,146,166,0.55)';
      ctx.beginPath(); ctx.arc(n.x, n.y, 1.4 * dpr, 0, Math.PI * 2); ctx.fill();
    }
  }

  build();
  if (reduce) {
    // draw a single static frame, no animation
    for (const e of edges) e.pulse = -1;
    staticDraw();
  } else {
    requestAnimationFrame(frame);
  }

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
})();
