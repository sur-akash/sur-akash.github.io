// Everything here is enhancement: without JS the page is complete, and both personas still show.
const root = document.documentElement;
root.classList.add("js");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

// ---------- Mobile nav ----------
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}
navToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") setMenu(false);
});

// ---------- Scroll-spy ----------
const linkFor = {};
navLinks.querySelectorAll("a[href^='#']").forEach((a) => {
  linkFor[a.getAttribute("href").slice(1)] = a;
});
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = linkFor[entry.target.id];
      if (!link || !entry.isIntersecting) return;
      Object.values(linkFor).forEach((a) => a.classList.toggle("active", a === link));
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

// ---------- Theme: alternating (default) or all dark ----------
const themeToggle = document.getElementById("themeToggle");

function setTheme(dark) {
  if (dark) root.dataset.theme = "dark";
  else delete root.dataset.theme;
  themeToggle.setAttribute("aria-pressed", String(dark));
}
setTheme(root.dataset.theme === "dark");
themeToggle.hidden = false;
themeToggle.addEventListener("click", () => {
  const dark = root.dataset.theme !== "dark";
  try {
    localStorage.setItem("as-theme", dark ? "dark" : "mixed");
  } catch (e) {
    // private mode: the choice just isn't remembered
  }
  if (!document.startViewTransition || reduced.matches) return setTheme(dark);
  // the new theme grows out of the button
  const box = themeToggle.getBoundingClientRect();
  const x = box.left + box.width / 2, y = box.top + box.height / 2;
  document.startViewTransition(() => setTheme(dark)).ready.then(() => {
    root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${Math.hypot(innerWidth, innerHeight)}px at ${x}px ${y}px)`] },
      { duration: 550, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }
    );
  }, () => {});
});

// ---------- The line: the dot walks the career ----------
function createCareerLine() {
  const track = document.querySelector(".career-track");
  const stages = [...track.querySelectorAll(".stage")];
  const last = stages.length - 1;
  let current = last, timer = 0, moving = false, visible = false;

  function select(index) {
    current = index;
    track.style.setProperty("--i", index);
    stages.forEach((stage, i) => {
      stage.classList.toggle("on", i === index);
      stage.classList.toggle("done", i < index);
      stage.setAttribute("aria-pressed", String(i === index));
    });
  }
  function schedule(delay) {
    clearTimeout(timer);
    if (!moving || !visible) return;
    timer = setTimeout(() => {
      select((current + 1) % stages.length);
      schedule(current === last ? 5000 : 1700); // rest longest on today
    }, delay);
  }
  stages.forEach((stage, i) => {
    stage.addEventListener("click", () => {
      select(i);
      schedule(6000);
    });
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    schedule(3500);
  }).observe(track);

  return {
    setMoving(value) {
      moving = value;
      schedule(2500);
    },
  };
}
const careerLine = createCareerLine();

// ---------- Persona lens: Both / Data / Product ----------
const lens = document.getElementById("lens");
const lensStatus = document.getElementById("lensStatus");

function setView(view) {
  root.dataset.view = view;
  lens.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setLens === view)));
  const count = (selector) => document.querySelectorAll(`${selector}[data-lens~="${view}"]`).length;
  lensStatus.textContent =
    view === "both"
      ? "Switch persona to highlight the matching work."
      : `${count(".tl-item")} roles and ${count(".project-card:not(.project-more)") + count(".project-hero")} projects highlighted below.`;
}
lens.hidden = false;
lens.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (button) setView(button.dataset.setLens);
});
setView("both");

// ---------- Motion control ----------
const motionToggle = document.getElementById("motionToggle");
let paused = false;

function applyMotion() {
  root.classList.toggle("paused", paused);
  motionToggle.hidden = reduced.matches;
  motionToggle.textContent = paused ? "Play motion" : "Pause motion";
  careerLine.setMoving(!paused && !reduced.matches);
}
motionToggle.addEventListener("click", () => {
  paused = !paused;
  applyMotion();
});
reduced.addEventListener("change", applyMotion);
applyMotion();

// ---------- Pointer lights up the dot grid ----------
document.querySelectorAll(".hero").forEach((region) => {
  region.addEventListener("pointermove", (e) => {
    if (paused || reduced.matches) return;
    const box = region.getBoundingClientRect();
    region.style.setProperty("--mx", `${e.clientX - box.left}px`);
    region.style.setProperty("--my", `${e.clientY - box.top}px`);
  });
});

// ---------- Scroll progress and timeline fill ----------
const progress = document.getElementById("scrollProgress");
const roles = [...document.querySelectorAll(".tl-item")];
let queued = false;

function onScroll() {
  queued = false;
  const max = root.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  const readLine = innerHeight * 0.62;
  const boxes = roles.map((r) => r.getBoundingClientRect()); // read everything, then write
  roles.forEach((role, i) => {
    const start = boxes[i].top + 14;
    role.style.setProperty("--p", Math.min(1, Math.max(0, (readLine - start) / boxes[i].height)));
    role.classList.toggle("reached", start <= readLine);
  });
}
function queueScroll() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(onScroll);
}
addEventListener("scroll", queueScroll, { passive: true });
addEventListener("resize", queueScroll);
onScroll();

// ---------- Count-up numbers (the HTML always holds the real value) ----------
const counter = new IntersectionObserver(
  (entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      counter.unobserve(target);
      if (paused || reduced.matches) return;
      const end = Number(target.dataset.count);
      let start;
      const step = (now) => {
        start ??= now;
        const t = paused ? 1 : Math.min(1, (now - start) / 1300);
        target.textContent = Math.round(end * (1 - (1 - t) ** 3)) + target.dataset.suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((n) => counter.observe(n));

// ---------- Experience: the "by May 2027" qualifier retires itself on 1 May 2027 ----------
if (new Date() >= new Date(2027, 4, 1)) {
  document.querySelectorAll("[data-until-decade]").forEach((el) => (el.hidden = true));
}

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
