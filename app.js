/* Hollow Client — site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var D = window.HOLLOW || { releases: [], cosmetics: [] };
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

  /* ---------- shop ---------- */
  var STORE_KEY = "hollow_unlocked_cosmetics";
  var CAT_ICON = { cape: "shirt", wings: "feather", emote: "smile", hat: "crown", aura: "sparkle" };
  var FILTERS = [["all", "All"], ["cape", "Capes"], ["wings", "Wings"], ["emote", "Emotes"], ["hat", "Hats"], ["aura", "Auras"]];

  function loadUnlocked() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function saveUnlocked(a) { try { localStorage.setItem(STORE_KEY, JSON.stringify(a)); } catch (e) { /* storage unavailable */ } }

  function initShop() {
    var unlocked = loadUnlocked();
    var filter = "all";
    var grid = $("#cosmetics");
    var dlg = $("#quest-dialog");
    var openId = null;

    $("#stat-items").textContent = D.cosmetics.length;

    $("#filters").innerHTML = FILTERS.map(function (f) {
      return '<button type="button" class="filter' + (f[0] === filter ? " is-on" : "") + '" data-f="' + f[0] + '">' + f[1] + "</button>";
    }).join("");
    $("#filters").addEventListener("click", function (e) {
      var b = e.target.closest(".filter"); if (!b) return;
      filter = b.getAttribute("data-f");
      $$(".filter").forEach(function (x) { x.classList.toggle("is-on", x === b); });
      drawGrid();
    });

    function drawGrid() {
      var items = D.cosmetics.filter(function (c) { return filter === "all" || c.category === filter; });
      $("#stat-unlocked").textContent = D.cosmetics.filter(function (c) { return unlocked.indexOf(c.id) > -1; }).length;
      if (!items.length) { grid.innerHTML = '<p class="empty">Nothing in this category yet.</p>'; return; }
      grid.innerHTML = items.map(function (c) {
        var own = unlocked.indexOf(c.id) > -1;
        var bg = "radial-gradient(120% 90% at 50% 0%, " + c.color_from + "66, transparent 65%), linear-gradient(150deg, " + c.color_from + ", " + c.color_to + ")";
        return '<button type="button" class="cosmetic" data-id="' + esc(c.id) + '">' +
          '<div class="art" style="background-image:' + bg + '"><div class="glyph">' + icon(CAT_ICON[c.category] || "shirt", "icon-lg") + "</div>" +
          '<span class="rarity ' + esc(c.rarity) + '">' + esc(c.rarity) + "</span>" +
          (own ? '<span class="owned">' + icon("check") + "</span>" : "") + "</div>" +
          '<div class="body"><div class="title"><h3>' + esc(c.name) + '</h3><span class="free">Free</span></div>' +
          '<p class="cat">' + esc(c.category) + "</p>" +
          '<div class="quest"><span>Quest · </span>' + esc(c.quest_title) + "</div>" +
          '<p class="cta">' + (own ? "Unlocked" : "View quest") + "</p></div></button>";
      }).join("");
    }

    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".cosmetic"); if (!b) return;
      openQuest(b.getAttribute("data-id"));
    });

    function openQuest(id) {
      var c = D.cosmetics.filter(function (x) { return x.id === id; })[0]; if (!c) return;
      openId = id;
      var own = unlocked.indexOf(id) > -1;
      var steps = (c.quest_steps || []).map(function (s, i) { return "<li><i>" + (i + 1) + "</i><span>" + esc(s) + "</span></li>"; }).join("");
      dlg.innerHTML = '<div class="quest-body">' +
        '<button class="quest-close" type="button" data-close aria-label="Close">' + icon("x") + "</button>" +
        '<div><p class="kicker">' + esc(c.category) + " · " + esc(c.rarity || "common") + " · free</p>" +
        "<h2>" + esc(c.name) + '</h2><p class="desc">' + esc(c.quest_description || "") + "</p></div>" +
        '<div><p class="qt">Quest · ' + esc(c.quest_title) + '</p><ol class="quest-steps">' + steps + "</ol></div>" +
        '<div class="quest-actions">' + (own
          ? '<div class="unlocked-msg">' + icon("check") + "Unlocked — equip it from the launcher's wardrobe.</div>" +
            '<button class="link-btn" type="button" data-reset>Reset quest progress</button>'
          : '<button class="btn btn-solid" type="button" data-unlock>Mark quest complete</button>' +
            '<p class="note">No payment, ever. Quests unlock cosmetics on your account.</p>') +
        "</div></div>";
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    }

    dlg.addEventListener("click", function (e) {
      if (e.target === dlg || e.target.closest("[data-close]")) { dlg.close(); return; }
      if (e.target.closest("[data-unlock]") && openId) {
        if (unlocked.indexOf(openId) < 0) unlocked.push(openId);
        saveUnlocked(unlocked); drawGrid(); openQuest(openId);
      }
      if (e.target.closest("[data-reset]") && openId) {
        unlocked = unlocked.filter(function (x) { return x !== openId; });
        saveUnlocked(unlocked); drawGrid(); openQuest(openId);
      }
    });

    drawGrid();
  }

  if (page === "home") initHome();
  if (page === "downloads") initDownloads();
  if (page === "changelog") initChangelog();
  if (page === "shop") initShop();
})();
