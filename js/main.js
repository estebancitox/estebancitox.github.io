(() => {
  "use strict";

  const html = document.documentElement;

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
    meta.content = getComputedStyle(document.body).backgroundColor;
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

  const paintVisit = () => {
    const line = document.getElementById("visit");
    const outN = document.getElementById("visit-n");
    const outKb = document.getElementById("visit-kb");
    const nav = performance.getEntriesByType("navigation")[0];
    if (!line || !outN || !outKb || !nav) return;
    const res = performance.getEntriesByType("resource");
    const bytes =
      (nav.transferSize || 0) +
      res.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    outN.textContent = 1 + res.length;
    outKb.textContent =
      bytes > 0
        ? Math.max(1, Math.round(bytes / 1024)) + " KB"
        : "0 KB (your cache)";
    line.hidden = false;
  };

  addEventListener("load", () => {
    requestAnimationFrame(paintVisit);
    if ("PerformanceObserver" in window) {
      try {
        new PerformanceObserver(paintVisit).observe({
          type: "resource",
          buffered: true,
        });
      } catch (e) {
        /* observer unsupported: the load-time snapshot stands */
      }
    }
  });

  console.log(
    "%chand-built · no framework · no build step · source: https://github.com/estebancitox/estebancitox.github.io",
    "font-family:monospace"
  );
})();
