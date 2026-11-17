/* =====================================================================
   VANSH SETH — SPIDER-COMIC PORTFOLIO
   main.js  ·  navigation, reveals, typewriter, skills, filters, form
   ===================================================================== */

import { initCursor, initWebCanvas, initTilt, spawnFxWord, webBlast } from "./webfx.js";

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ------------------------------------------------------------------
   1. PRELOADER
   ------------------------------------------------------------------ */
function initPreloader() {
  const pre = $("#preloader");
  const bar = $("#preloadBar");
  if (!pre) return;

  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.random() * 18 + 6);
    if (bar) bar.style.width = p + "%";
    if (p >= 100) clearInterval(tick);
  }, 130);

  const hide = () => {
    if (bar) bar.style.width = "100%";
    setTimeout(() => {
      pre.classList.add("is-gone");
      document.body.classList.remove("is-locked");
      startTypewriter();
    }, 380);
  };

  document.body.classList.add("is-locked");
  window.addEventListener("load", () => setTimeout(hide, 550));
  setTimeout(hide, 3200); // safety net
}

/* ------------------------------------------------------------------
   2. NAVIGATION
   ------------------------------------------------------------------ */
function initNav() {
  const nav = $("#nav");
  const burger = $("#burger");
  const links = $("#navLinks");
  if (!nav || !burger || !links) return;

  const closeMenu = () => {
    links.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  $$(".nav__link", links).forEach((a) => a.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });

  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("is-solid", y > 40);
    if (y > lastY && y > 320 && !links.classList.contains("is-open")) {
      nav.classList.add("is-hidden");
    } else {
      nav.classList.remove("is-hidden");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------------
   3. SCROLL PROGRESS + BACK TO TOP
   ------------------------------------------------------------------ */
function initScrollUi() {
  const bar = $("#scrollWeb");
  const top = $("#toTop");

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + "%";
    if (top) top.classList.toggle("is-on", window.scrollY > 620);
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  if (top) {
    top.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      spawnFxWord(window.innerWidth - 60, window.innerHeight - 110, "ZIP!");
    });
  }
}

/* ------------------------------------------------------------------
   4. SCROLL REVEAL + ACTIVE SECTION
   ------------------------------------------------------------------ */
function initReveals() {
  const items = $$(".reveal, .section-title");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

function initScrollSpy() {
  const sections = $$("main section[id]");
  const links = $$(".nav__link");
  if (!sections.length) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        links.forEach((l) =>
          l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`)
        );
      });
    },
    { threshold: 0, rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
}

/* ------------------------------------------------------------------
   5. TYPEWRITER
   ------------------------------------------------------------------ */
const PHRASES = [
  "AI that actually ships.",
  "websites with comic-book energy.",
  "LLM agents & RAG pipelines.",
  "experiments from trending papers.",
  "interfaces worth clicking.",
];

let typerStarted = false;
function startTypewriter() {
  if (typerStarted) return;
  typerStarted = true;

  const out = $("#typed");
  if (!out) return;

  let pi = 0;
  let ci = 0;
  let deleting = false;

  const step = () => {
    const phrase = PHRASES[pi];
    ci += deleting ? -1 : 1;
    out.textContent = phrase.slice(0, ci);

    let delay = deleting ? 38 : 68;
    if (!deleting && ci === phrase.length) {
      delay = 1500;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % PHRASES.length;
      delay = 320;
    }
    setTimeout(step, delay);
  };
  step();
}

/* ------------------------------------------------------------------
   6. STAT COUNTERS
   ------------------------------------------------------------------ */
function initCounters() {
  const nums = $$("[data-count]");
  if (!nums.length) return;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const dur = 1400;
    const start = performance.now();
    const frame = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toString();
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          run(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  nums.forEach((n) => io.observe(n));
}

/* ------------------------------------------------------------------
   7. SKILL TABS + POWER METERS
   ------------------------------------------------------------------ */
function fillBars(panel) {
  $$(".skill", panel).forEach((skill, i) => {
    const bar = $("i", skill);
    const level = skill.dataset.level || "0";
    if (!bar) return;
    bar.style.width = "0%";
    setTimeout(() => { bar.style.width = level + "%"; }, 90 * i + 60);
  });
}

function initSkills() {
  const tabs = $$(".tab");
  const panels = $$(".skills__panel");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      panels.forEach((p) => {
        const on = p.dataset.panel === key;
        p.classList.toggle("is-active", on);
        if (on) fillBars(p);
      });
      spawnFxWord(
        tab.getBoundingClientRect().left + tab.offsetWidth / 2,
        tab.getBoundingClientRect().top,
        "ZAP!"
      );
    });
  });

  const first = $(".skills__panel.is-active");
  if (first) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            fillBars(first);
            io.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(first);
  }
}

/* ------------------------------------------------------------------
   8. MISSION FILTERS
   ------------------------------------------------------------------ */
function initFilters() {
  const btns = $$("#filters .chip-btn");
  const cards = $$("#missionGrid .mission");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.dataset.filter;
      btns.forEach((b) => b.classList.toggle("is-active", b === btn));

      cards.forEach((card) => {
        const cats = (card.dataset.cat || "").split(" ");
        const show = f === "all" || cats.includes(f);
        card.classList.toggle("is-hidden", !show);
        if (show) {
          card.classList.remove("is-in");
          void card.offsetWidth;
          card.classList.add("is-in");
        }
      });

      const r = btn.getBoundingClientRect();
      spawnFxWord(r.left + r.width / 2, r.top, "SNAP!");
    });
  });
}

/* ------------------------------------------------------------------
   9. CONTACT FORM
   ------------------------------------------------------------------ */
function initForm() {
  const form = $("#contactForm");
  if (!form) return;
  const note = $("#formNote");

  const setErr = (input, msg) => {
    const slot = $(`.err[data-for="${input.id}"]`, form);
    if (slot) slot.textContent = msg || "";
    if (msg) {
      input.classList.add("is-shaking");
      setTimeout(() => input.classList.remove("is-shaking"), 550);
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cName");
    const email = $("#cEmail");
    const msg = $("#cMsg");
    let ok = true;

    if (!name.value.trim()) { setErr(name, "Even heroes have names!"); ok = false; } else setErr(name, "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setErr(email, "That email looks like a Mysterio illusion.");
      ok = false;
    } else setErr(email, "");
    if (msg.value.trim().length < 10) {
      setErr(msg, "Give me at least 10 characters of intel.");
      ok = false;
    } else setErr(msg, "");

    if (!ok) {
      if (note) { note.textContent = "⚠️ Spider-sense tingling — check the fields above."; note.classList.remove("ok"); }
      return;
    }

    const btn = $("#sendBtn");
    if (btn) { btn.textContent = "SLINGING..."; btn.disabled = true; }

    setTimeout(() => {
      webBlast("THWIP!");
      if (note) {
        note.textContent = `🕸️ Message web-slung, ${name.value.trim().split(" ")[0]}! I'll swing back within 24 hours.`;
        note.classList.add("ok");
      }
      form.reset();
      if (btn) { btn.textContent = "THWIP IT!"; btn.disabled = false; }
    }, 900);
  });
}

/* ------------------------------------------------------------------
   10. TICKER LOOP
   ------------------------------------------------------------------ */
function initTicker() {
  const track = $("#tickerTrack");
  if (track) track.innerHTML += track.innerHTML;
}

/* ------------------------------------------------------------------
   10b. RESUME GENERATOR (client-side download)
   ------------------------------------------------------------------ */
const RESUME = `================================================================
 VANSH SETH  —  BCA STUDENT | AI EXPLORER | WEB DEVELOPER
================================================================
 Email    : vansh.seth@example.com
 GitHub   : github.com/vanshseth
 LinkedIn : linkedin.com/in/vanshseth
 Location : India

----------------------------------------------------------------
PROFILE
----------------------------------------------------------------
BCA student with a strong focus on Artificial Intelligence and
creative front-end engineering. I build machine-learning and
generative-AI projects, track trending AI research every week,
and turn those ideas into fast, highly interactive websites.

----------------------------------------------------------------
CORE SKILLS
----------------------------------------------------------------
AI / ML    : Machine Learning, Deep Learning, Generative AI & LLMs,
             RAG + Vector Databases, Computer Vision, Prompt &
             Agent Engineering
Web        : HTML5, CSS3, JavaScript (ES6+), React, Tailwind,
             Node.js, REST APIs, UI/UX & Motion Design
Languages  : Python, Java, C/C++, SQL, MongoDB
Tools      : TensorFlow, PyTorch, Hugging Face, LangChain,
             OpenAI API, Pandas, NumPy, scikit-learn, Git, Docker

----------------------------------------------------------------
SELECTED PROJECTS
----------------------------------------------------------------
1. SpiderSense Chatbot — RAG assistant that answers from your own
   PDFs with citations. (Python, LangChain, Streamlit)
2. Web-Shooter Vision — real-time object & gesture detection
   running fully in the browser. (TensorFlow, OpenCV, TF.js)
3. Multiverse Portfolio Kit — open-source comic-book UI component
   pack. (HTML, CSS, Vanilla JS)
4. AI Trend Radar — clusters arXiv + HN posts with embeddings and
   publishes a weekly AI digest. (NLP, Embeddings, Flask)
5. Bugle Voice Notes — lecture to summary, flashcards and audio
   recap. (Whisper, OpenAI API, React)
6. Neural Web Explorer — interactive canvas visualising how a
   neural network learns. (Canvas API, JavaScript)

----------------------------------------------------------------
EDUCATION
----------------------------------------------------------------
Bachelor of Computer Applications (BCA) — in progress
Coursework: Data Structures, DBMS, OS, Web Technologies,
Python Programming, Artificial Intelligence & Machine Learning.

----------------------------------------------------------------
INTERESTS
----------------------------------------------------------------
Agentic AI - Small language models - Retrieval quality research -
Creative front-end - Comic book design - Hackathons

                "With great code comes great responsibility."
================================================================`;

function initResume() {
  const btn = $("#resumeBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const blob = new Blob([RESUME], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Vansh-Seth-Resume.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
    webBlast("THWIP!");
  });
}

/* ------------------------------------------------------------------
   11. EASTER EGGS & MICRO-INTERACTIONS
   ------------------------------------------------------------------ */
function initEggs() {
  const logo = $("#logoBtn");
  if (logo) {
    logo.addEventListener("click", (e) => {
      e.preventDefault();
      webBlast("THWIP!");
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  $("#webShotBtn")?.addEventListener("click", (e) => {
    webBlast("KA-POW!");
    const r = e.currentTarget.getBoundingClientRect();
    for (let i = 0; i < 4; i++) {
      setTimeout(
        () => spawnFxWord(r.left + Math.random() * r.width, r.top - Math.random() * 90),
        i * 140
      );
    }
  });

  $$(".btn, .chip-btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      if (e.currentTarget.id === "webShotBtn") return;
      spawnFxWord(e.clientX || window.innerWidth / 2, (e.clientY || 200) - 20);
    });
  });

  // Konami code → multiverse mode
  const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let idx = 0;
  window.addEventListener("keydown", (e) => {
    idx = e.key.toLowerCase() === code[idx].toLowerCase() ? idx + 1 : 0;
    if (idx === code.length) {
      idx = 0;
      webBlast("MULTIVERSE!");
      document.documentElement.style.setProperty("--red", "#8a2be2");
      document.documentElement.style.setProperty("--yellow", "#00e5ff");
      for (let i = 0; i < 8; i++) {
        setTimeout(
          () => spawnFxWord(Math.random() * window.innerWidth, Math.random() * window.innerHeight),
          i * 160
        );
      }
    }
  });

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear().toString();
}

/* ------------------------------------------------------------------
   BOOT
   ------------------------------------------------------------------ */
function boot() {
  initPreloader();
  initNav();
  initScrollUi();
  initReveals();
  initScrollSpy();
  initCounters();
  initSkills();
  initFilters();
  initForm();
  initTicker();
  initResume();
  initEggs();
  initCursor();
  initWebCanvas();
  initTilt();
  setTimeout(startTypewriter, 2600); // fallback if load fires late
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
