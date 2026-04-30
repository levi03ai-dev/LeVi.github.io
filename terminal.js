/* ─────────────────────────────────────────────
   terminal.js — command parser & output
───────────────────────────────────────────── */
const termInput = document.getElementById("input");
const output    = document.getElementById("output");

const MAX_LINES = 200;
let cmdHistory  = [];
let histIdx     = 0;

function s(cls, text) {
  return `<span class="${cls}">${text}</span>`;
}

function addLine(html, cls = "") {
  const div = document.createElement("div");
  if (cls) div.className = cls;
  div.innerHTML = html;
  output.appendChild(div);
  while (output.children.length > MAX_LINES) {
    output.removeChild(output.firstChild);
  }
  output.scrollTop = output.scrollHeight;
}

function blank() {
  const d = document.createElement("div");
  d.className = "out-blank";
  output.appendChild(d);
}

const commands = {
  help() {
    blank();
    addLine(s("out-accent", "commands"), "out-indent");
    blank();
    [
      ["about",     "who i am"],
      ["projects",  "what i've built"],
      ["skills",    "tech i use"],
      ["contact",   "get in touch"],
      ["github",    "open github profile"],
      ["resume",    "open resume"],
      ["clear",     "clear the terminal"],
      ["portfolio", "switch to portfolio view"],
    ].forEach(([cmd, desc]) => {
      addLine(
        `${s("out-green", cmd.padEnd(14))}${s("out-dim", "— " + desc)}`,
        "out-indent"
      );
    });
    blank();
    addLine(s("out-dim", "tip: ↑↓ for history · tab for autocomplete"), "out-indent");
    blank();
  },
  about() {
    blank();
    addLine(s("out-accent", "// about"), "out-indent");
    blank();
    addLine(s("out-bright", "Developer focused on clean systems and efficient code."), "out-indent");
    addLine(s("out-dim", "Working at the intersection of low-level performance and UI."), "out-indent");
    blank();
    addLine(`${s("out-dim", "status    ")}${s("out-green", "✓ open to work")}`, "out-indent");
    addLine(`${s("out-dim", "location  ")}${s("out-cyan",   "Earth")}`, "out-indent");
    blank();
  },
  projects() {
    blank();
    addLine(s("out-accent", "// projects"), "out-indent");
    blank();
    [
      ["01", "Terminal Portfolio", "JS · CSS · HTML"],
      ["02", "ML Pipeline",        "Python · Sklearn · Pandas"],
      ["03", "OpenCV Tools",       "Python · OpenCV · NumPy"],
    ].forEach(([num, name, tech]) => {
      addLine(
        `${s("out-dim", `[${num}]`)} ${s("out-bright", name.padEnd(24))}${s("out-cyan", tech)}`,
        "out-indent"
      );
    });
    blank();
    addLine(s("out-dim", `type "open 1" to open a project`), "out-indent");
    blank();
  },
  skills() {
    blank();
    addLine(s("out-accent", "// skills"), "out-indent");
    blank();
    [
      ["Languages", "C · Python · JavaScript · Bash"],
      ["Tools",     "Git · Docker · Linux · VS Code"],
      ["ML/Data",   "PyTorch · Sklearn · Pandas · OpenCV"],
    ].forEach(([group, items]) => {
      addLine(
        `${s("out-dim", group.padEnd(12))}${s("out-green", items)}`,
        "out-indent"
      );
    });
    blank();
  },
  contact() {
    blank();
    addLine(s("out-accent", "// contact"), "out-indent");
    blank();
    addLine(`${s("out-dim", "email   ")}${s("out-cyan", "email@example.com")}`, "out-indent");
    addLine(`${s("out-dim", "github  ")}${s("out-cyan", "github.com/astro")}`, "out-indent");
    blank();
    addLine(s("out-dim", `type "github" to open · "resume" to download`), "out-indent");
    blank();
  },
  github() {
    window.open("https://github.com/", "_blank");
    addLine(s("out-green", "↗ opening github..."), "out-indent");
  },
  resume() {
    window.open("#", "_blank");
    addLine(s("out-green", "↗ opening resume..."), "out-indent");
  },
  clear() {
    output.innerHTML = "";
    welcome();
  },
  portfolio() {
    const pf = document.getElementById("portfolio");
    const tv = document.getElementById("terminalView");
    const tb = document.getElementById("toggleTerminal");
    const fm = document.getElementById("footerMode");
    pf.classList.remove("hidden");
    tv.classList.add("hidden");
    if (tb) {
      tb.classList.remove("active");
      const txt = tb.querySelector(".btn-text");
      if (txt) txt.textContent = "Terminal";
    }
    if (fm) fm.textContent = "portfolio mode";
  },
};

function openProject(id) {
  const map = { "1": "https://github.com/", "2": "https://github.com/", "3": "https://github.com/" };
  if (map[id]) {
    window.open(map[id], "_blank");
    addLine(s("out-green", `↗ opening project ${id}...`), "out-indent");
  } else {
    addLine(`${s("out-red", "not found:")} ${s("out-dim", `project ${id} — type "projects" to list`)}`, "out-indent");
  }
}

function handle(raw) {
  const parts = raw.trim().toLowerCase().split(/\s+/);
  const cmd   = parts[0];
  const arg   = parts[1];
  if (cmd === "open") { openProject(arg); return; }
  if (commands[cmd])  { commands[cmd](); return; }
  addLine(
    `${s("out-red", "not found:")} ${s("out-dim", cmd)} ${s("out-dim", '— try "help"')}`,
    "out-indent"
  );
}

function runCommand(cmd) {
  addLine(`${s("out-accent", "astro@dev:~$")} ${s("out-cmd", cmd)}`);
  handle(cmd);
}

function complete(partial) {
  const all = [...Object.keys(commands), "open"];
  const hit = all.find(c => c.startsWith(partial) && c !== partial);
  return hit ?? partial;
}

termInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = termInput.value.trim();
    if (!cmd) return;
    cmdHistory.push(cmd);
    histIdx = cmdHistory.length;
    runCommand(cmd);
    termInput.value = "";
    return;
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    histIdx = Math.max(0, histIdx - 1);
    termInput.value = cmdHistory[histIdx] ?? "";
  }
  if (e.key === "ArrowDown") {
    e.preventDefault();
    histIdx = Math.min(cmdHistory.length, histIdx + 1);
    termInput.value = cmdHistory[histIdx] ?? "";
  }
  if (e.key === "Tab") {
    e.preventDefault();
    const partial = termInput.value.trim();
    if (partial) termInput.value = complete(partial);
  }
});

function welcome() {
  addLine(`${s("out-accent", "astro")}${s("out-dim", ".dev")}  ${s("out-dim", "terminal v1.0")}`);
  addLine(s("out-dim", "─".repeat(38)));
  addLine(`${s("out-dim", "type")} ${s("out-green", "help")} ${s("out-dim", "for available commands")}`);
  blank();
}

welcome();