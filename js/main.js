(() => {
  "use strict";

  const html = document.documentElement;
  const GROUND = { light: "#F3F5F6", dark: "#14171B" };

  const stored = () => {
    try {
      const t = localStorage.getItem("theme");
      return t === "dark" || t === "light" ? t : null;
    } catch (e) {
      return null;
    }
  };
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const current = () =>
    html.dataset.theme || (systemDark.matches ? "dark" : "light");

  const toggle = document.getElementById("theme-toggle");

  const syncMeta = () => {
    let meta = document.querySelector('meta[name="theme-color"]:not([media])');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
      document
        .querySelectorAll('meta[name="theme-color"][media]')
        .forEach((m) => m.remove());
    }
    meta.content = GROUND[current()];
  };

  const syncLabel = () => {
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        current() === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  };

  if (toggle) {
    toggle.hidden = false;
    syncLabel();
    if (stored()) syncMeta();
    toggle.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      html.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* private mode: theme still applies for this page view */
      }
      syncMeta();
      syncLabel();
    });
    systemDark.addEventListener("change", () => {
      if (!stored()) syncLabel();
    });
  }

  addEventListener("load", () => {
    requestAnimationFrame(() => {
      const nav = performance.getEntriesByType("navigation")[0];
      const out = document.getElementById("visit-ms");
      const line = document.getElementById("visit");
      if (nav && nav.domContentLoadedEventEnd > 0 && out && line) {
        out.textContent = Math.round(nav.domContentLoadedEventEnd);
        line.hidden = false;
      }
    });
  });

  console.log(
    "%chand-built · no framework · no build step · source: https://github.com/estebancitox/estebancitox.github.io",
    "font-family:monospace"
  );
})();
