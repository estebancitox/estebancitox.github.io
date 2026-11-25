(() => {
  "use strict";

  /* ── Gauge: this visit's weight ──────────────────────── */

  const dial = document.querySelector(".gauge svg");
  const needles = document.querySelectorAll(".needle");
  const digits = document.querySelectorAll(".digit");
  const outN = document.getElementById("visit-n");
  const outKb = document.getElementById("visit-kb");

  /* 0 to 120 KB over 270 degrees. From wherever the needle is now, so a
     reading that lands mid-sweep bends the sweep instead of restarting it. */
  const point = (kb) => {
    const to = "rotate(" + (Math.min(kb, 120) * 2.25 - 135) + ")";
    needles.forEach((n) => {
      if (n.getAttribute("transform") === to) return;
      const m = new DOMMatrix(getComputedStyle(n).transform);
      const now = (Math.atan2(m.b, m.a) * 180) / Math.PI;
      n.setAttribute("transform", "rotate(" + now + ")");
      n.classList.add("live");
      n.getBoundingClientRect();
      n.setAttribute("transform", to);
    });
  };

  /* A reading from the network keeps growing until the last request lands
     (the favicon comes after load), so it waits for the needle's sweep to
     finish. A visit served from cache reads 0 and shows at once. */
  let settled = false;

  const paintVisit = () => {
    const nav = performance.getEntriesByType("navigation")[0];
    if (!dial || !outN || !outKb || !nav) return;
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
    if (bytes > 0 && !settled) return;
    const kb = bytes > 0 ? Math.max(1, Math.round(bytes / 1024)) : 0;
    const cached = kb ? "" : " (your cache)";
    String(Math.min(kb, 999))
      .padStart(3, "0")
      .split("")
      .forEach((d, i) => {
        if (digits[i]) digits[i].textContent = d;
      });
    point(kb);
    dial.setAttribute(
      "aria-label",
      "Gauge: this page weighs " +
        kb +
        " kilobytes compressed" +
        cached +
        (kb > 100 ? ", over" : ", under") +
        " a limit of 100"
    );
    outN.textContent = 1 + res.length;
    outKb.textContent = kb + "\u00a0KB" + cached;
  };

  addEventListener("load", () => {
    requestAnimationFrame(paintVisit);
    const sweep =
      needles[0] && needles[0].getAnimations ? needles[0].getAnimations() : [];
    Promise.all(
      sweep
        .map((a) => a.finished)
        .concat(new Promise((done) => setTimeout(done, 1000)))
    )
      .catch(() => {})
      .then(() => {
        settled = true;
        paintVisit();
      });
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

  /* ── Ruler: marks where the sections are ─────────────── */

  const tape = document.querySelector(".tape");
  const marks = tape ? Array.from(tape.querySelectorAll("li")) : [];
  const BUG = 15; /* the marker's width in css/site.css */

  const place = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const span = tape.offsetWidth - BUG;
    if (max <= 0 || span <= 0) return;
    /* a mark sits where the marker is when its section is at the top */
    const at = marks.map((li) => {
      const a = li.firstElementChild;
      const sec = document.getElementById(a.hash.slice(1));
      const top =
        sec.getBoundingClientRect().top +
        scrollY -
        parseFloat(getComputedStyle(sec).scrollMarginTop);
      return {
        li,
        p: Math.min(1, Math.max(0, top / max)),
        half: a.offsetWidth / 2,
      };
    });
    /* right to left: a label that would touch its neighbour steps aside,
       its mark stays true */
    let edge = Infinity;
    for (let i = at.length - 1; i >= 0; i--) {
      const { li, p, half } = at[i];
      const x = BUG / 2 + p * span;
      const cx = Math.min(x, edge - half - 8);
      li.style.setProperty("--p", p.toFixed(4));
      li.style.setProperty("--dx", (cx - x).toFixed(1) + "px");
      edge = cx - half;
    }
  };

  if (tape && "ResizeObserver" in window) {
    new ResizeObserver(place).observe(document.body);
    addEventListener("resize", place);
  }
})();
