/* =====================================================================
   VANSH SETH — SPIDER-COMIC PORTFOLIO
   webfx.js  ·  custom spider-sense cursor, web canvas, tilt & FX words
   ===================================================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ------------------------------------------------------------------
   1. SPIDER-SENSE CURSOR
   ------------------------------------------------------------------ */
export function initCursor() {
  if (!finePointer) return;

  const ring = document.getElementById("cursorRing");
  const dot = document.getElementById("cursorDot");
  if (!ring || !dot) return;

  document.body.classList.add("custom-cursor");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });

  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  const hotSelector = "a, button, .tab, .chip-btn, input, textarea, [data-tilt]";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hotSelector)) ring.classList.add("is-hot");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hotSelector)) ring.classList.remove("is-hot");
  });

  document.addEventListener("mousedown", () => ring.classList.add("is-hot"));
  document.addEventListener("mouseup", () => ring.classList.remove("is-hot"));
}

/* ------------------------------------------------------------------
   2. LIVING WEB CANVAS
   ------------------------------------------------------------------ */
export function initWebCanvas() {
  const canvas = document.getElementById("webCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [];
  const mouse = { x: -9999, y: -9999 };

  const build = () => {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = Math.min(64, Math.max(22, Math.round((w * h) / 26000)));
    nodes = Array.from({ length: target }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.8 + 1.1,
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);

    for (const n of nodes) {
      if (!reduceMotion) {
        n.x += n.vx;
        n.y += n.vy;
      }
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(226, 54, 54, 0.45)";
      ctx.fill();
    }

    const linkDist = w < 700 ? 110 : 150;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < linkDist) {
          const alpha = (1 - d / linkDist) * 0.3;
          ctx.strokeStyle = `rgba(226, 54, 54, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // web strands shooting toward the cursor
      const dxm = nodes[i].x - mouse.x;
      const dym = nodes[i].y - mouse.y;
      const dm = Math.hypot(dxm, dym);
      if (dm < 190) {
        const alpha = (1 - dm / 190) * 0.55;
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.65})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();

        ctx.strokeStyle = `rgba(226, 54, 54, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });
  window.addEventListener("resize", build);

  build();
  draw();
}

/* ------------------------------------------------------------------
   3. COMIC PANEL TILT
   ------------------------------------------------------------------ */
export function initTilt() {
  if (!finePointer || reduceMotion) return;

  document.querySelectorAll("[data-tilt]").forEach((el) => {
    let raf = null;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) ` +
          `rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
      });
    };

    const leave = () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = "";
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
  });
}

/* ------------------------------------------------------------------
   4. COMIC SOUND-EFFECT WORDS
   ------------------------------------------------------------------ */
const FX_WORDS = ["POW!", "THWIP!", "BAM!", "ZAP!", "KAPOW!", "WHAM!", "SNIKT!", "BOOM!"];

export function spawnFxWord(x, y, text) {
  const el = document.createElement("span");
  el.className = "fx-word";
  el.textContent = text || FX_WORDS[Math.floor(Math.random() * FX_WORDS.length)];
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

/* ------------------------------------------------------------------
   5. FULL-SCREEN WEB BLAST
   ------------------------------------------------------------------ */
export function webBlast(word = "THWIP!") {
  const shot = document.getElementById("webshot");
  if (!shot) return;
  const burst = shot.querySelector(".webshot__burst");
  if (burst) burst.textContent = word;
  shot.classList.remove("is-on");
  void shot.offsetWidth; // restart animation
  shot.classList.add("is-on");
  setTimeout(() => shot.classList.remove("is-on"), 950);
}
