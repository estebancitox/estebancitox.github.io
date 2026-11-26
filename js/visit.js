/* The visit line in the colophon of the lab and the two notes: the requests
   this visit made and the compressed bytes that crossed the network. Taken
   from paintVisit in the previous design's script. The home page shows the
   same reading on its gauge, from js/site.js. */
(() => {
  "use strict";

  const paintVisit = () => {
    const line = document.getElementById("visit");
    const outN = document.getElementById("visit-n");
    const outKb = document.getElementById("visit-kb");
    const nav = performance.getEntriesByType("navigation")[0];
    if (!line || !outN || !outKb || !nav) return;
    const res = performance.getEntriesByType("resource");
    /* payload convention: compressed body bytes of entries that actually
       crossed the network; headers excluded (HPACK makes them unstable) */
    const bytes = [nav]
      .concat(res)
      .reduce(
        (sum, r) =>
          sum + ((r.transferSize || 0) > 0 ? r.encodedBodySize || 0 : 0),
        0
      );
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
})();
