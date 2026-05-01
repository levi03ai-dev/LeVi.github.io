/* ─────────────────────────────────────────────
   ui.js — view switching, nav, mobile
───────────────────────────────────────────── */
const portfolio    = document.getElementById("portfolio");
const terminalView = document.getElementById("terminalView");
const toggleBtn    = document.getElementById("toggleTerminal");
const hamburger    = document.getElementById("hamburger");
const nav          = document.getElementById("nav");
const footerMode   = document.getElementById("footerMode");

let isTerminalMode = false;

toggleBtn.addEventListener("click", () => {
  isTerminalMode = !isTerminalMode;
  portfolio.classList.toggle("hidden", isTerminalMode);
  terminalView.classList.toggle("hidden", !isTerminalMode);
  toggleBtn.classList.toggle("active", isTerminalMode);
  const label = toggleBtn.querySelector(".btn-text");
  if (label) label.textContent = isTerminalMode ? "Portfolio" : "Terminal";
  if (footerMode) {
    footerMode.textContent = isTerminalMode ? "terminal mode" : "portfolio mode";
  }
  if (isTerminalMode) {
    const input = document.getElementById("input");
    if (input) setTimeout(() => input.focus(), 60);
  }
  nav.classList.remove("active");
  hamburger.classList.remove("open");
});

hamburger.addEventListener("click", () => {
  nav.classList.toggle("active");
  hamburger.classList.toggle("open");
});

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    hamburger.classList.remove("open");
  });
});

document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
    nav.classList.remove("active");
    hamburger.classList.remove("open");
  }
});

(function () {
  const inp = document.getElementById("input");
  if (!inp) return;
  inp.addEventListener("focus", () => {
    setTimeout(() => inp.scrollIntoView({ block: "nearest", behavior: "smooth" }), 320);
  });
  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener("resize", () => {
      const inputLine = document.querySelector(".input-line");
      if (inputLine && isTerminalMode) inputLine.scrollIntoView({ block: "end" });
    });
  }
}());
