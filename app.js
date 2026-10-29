/* Hollow Launcher — site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var D = window.HOLLOW || { releases: [] };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.getAttribute("data-page");

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="icon ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }
  function fmtDate(d) {
    if (!d) return "Unreleased";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  }
  function detectOS() {
    var ua = navigator.userAgent || "";
    if (/Mac OS X|Macintosh/i.test(ua)) return "macos";
    if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "linux";
    return "windows";
  }
  var OS_LABEL = { windows: "Windows", macos: "macOS", linux: "Linux" };
  var latest = D.releases.filter(function (r) { return r.is_latest; })[0] || D.releases[0] || null;

  /* ---------- header ---------- */
  var header = $(".site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuBtn = $(".menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      var open = header.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- home ---------- */
  function initHome() {
    var os = detectOS();
    var dl = $("#hero-download-label");
    if (dl) dl.textContent = "Download for " + OS_LABEL[os];

    if (latest) {
      $$("[data-latest-version]").forEach(function (el) { el.textContent = latest.version; });
      var badge = $("#hero-badge-text");
      if (badge) badge.textContent = latest.version + " · " + (latest.channel || "stable") + " · 26.3";
    }

    var box = $("#latest-build");
    if (box && latest) {
      var notes = (latest.notes || []).map(function (n) { return "<li><span>" + esc(n) + "</span></li>"; }).join("");
      var mc = (latest.minecraft_versions || []).length ? " · MC " + latest.minecraft_versions.join(", ") : "";
      box.innerHTML =
        '<div class="latest-grid"><div>' +
        '<div class="eyebrow"><span class="idx">03</span><span class="rule"></span><span class="lbl">Latest build</span></div>' +
        '<div class="version-row"><h2>' + esc(latest.version) + '</h2><span class="tag ' + (latest.channel === "beta" ? "tag-beta" : "") + '">' + esc(latest.channel || "stable") + "</span></div>" +
        '<p class="sum">' + esc(latest.summary || "") + "</p>" +
        '<p class="meta">' + esc(fmtDate(latest.release_date)) + esc(mc) + "</p>" +
        '<div class="latest-actions"><a class="btn btn-solid btn-md" href="downloads.html">' + icon("download", "icon-sm") + 'Download</a>' +
        '<a class="link-arrow" href="changelog.html">All releases ' + icon("arrow-right", "arrow icon-sm") + "</a></div></div>" +
        '<div class="latest-notes"><h3>In this build</h3><ul class="dot-list">' + notes + "</ul></div></div>";
    }
  }

  /* ---------- downloads ---------- */
  var PLATFORMS = [
    { id: "windows", label: "Windows", detail: "Windows 10 / 11 · 64-bit", icon: "monitor", ext: ".exe" },
    { id: "macos", label: "macOS", detail: "macOS 12+ · Apple silicon & Intel", icon: "laptop", ext: ".dmg" },
    { id: "linux", label: "Linux", detail: "Ubuntu 20.04+ · Arch · Fedora", icon: "terminal", ext: ".AppImage" }
  ];

  function initDownloads() {
    var sel = $("#build-select");
    var wrap = $("#build-field");
    var grid = $("#platforms");
    var active = detectOS();
    var current = latest;

    if (!D.releases.length) { wrap.hidden = true; } else {
      sel.innerHTML = D.releases.map(function (r) {
        return '<option value="' + esc(r.id) + '"' + (current && r.id === current.id ? " selected" : "") + ">v" + esc(r.version) + " · " + esc(r.channel || "stable") + "</option>";
      }).join("");
      sel.addEventListener("change", function () {
        current = D.releases.filter(function (r) { return r.id === sel.value; })[0] || null;
        draw();
      });
    }

    function draw() {
      grid.innerHTML = PLATFORMS.map(function (p) {
        var url = current && current.downloads && current.downloads[p.id];
        var meta = [current ? "v" + current.version : null, current && current.size_mb ? current.size_mb + " MB" : null].filter(Boolean).join(" · ");
        var btn = url
          ? '<a class="btn btn-solid" href="' + esc(url) + '" target="_blank" rel="noreferrer">' + icon("download", "icon-sm") + "Download " + p.ext + "</a>"
          : '<button class="btn" type="button" disabled>Coming soon</button>';
        return '<div class="platform' + (p.id === active ? " is-active" : "") + '" data-os="' + p.id + '">' +
          '<div class="platform-top"><div class="ico">' + icon(p.icon) + '</div><span class="tick">' + icon("check") + "</span></div>" +
          "<h3>" + p.label + '</h3><p class="detail">' + p.detail + '</p><p class="build">' + esc(meta || "Awaiting build") + "</p>" + btn + "</div>";
      }).join("");
      $$(".platform", grid).forEach(function (el) {
        function on() { active = el.getAttribute("data-os"); $$(".platform", grid).forEach(function (o) { o.classList.toggle("is-active", o === el); }); }
        el.addEventListener("mouseenter", on);
        el.addEventListener("focusin", on);
      });
    }
    draw();
  }

  /* ---------- changelog ---------- */
  function initChangelog() {
    var list = $("#release-list");
    if (!D.releases.length) { list.innerHTML = '<p class="empty">No releases published yet.</p>'; return; }
    var sorted = D.releases.slice().sort(function (a, b) { return String(b.release_date).localeCompare(String(a.release_date)); });
    list.innerHTML = sorted.map(function (r) {
      var notes = (r.notes || []).length ? "<ul>" + r.notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("") + "</ul>" : "";
      return '<article class="release"><div>' +
        '<p class="when">' + esc(fmtDate(r.release_date)) + "</p>" +
        '<span class="tag ' + (r.channel === "beta" ? "tag-beta" : "") + '">' + esc(r.channel || "stable") + "</span>" +
        ((r.minecraft_versions || []).length ? '<p class="mc">MC ' + esc(r.minecraft_versions.join(" · ")) + "</p>" : "") +
        '</div><div><div class="head"><h2>' + esc(r.version) + "</h2>" + (r.size_mb ? '<span class="size">' + esc(r.size_mb) + " MB</span>" : "") + "</div>" +
        (r.summary ? '<p class="sum">' + esc(r.summary) + "</p>" : "") + notes + "</div></article>";
    }).join("");
  }

  if (page === "home") initHome();
  if (page === "downloads") initDownloads();
  if (page === "changelog") initChangelog();
})();
