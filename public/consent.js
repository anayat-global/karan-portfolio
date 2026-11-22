/* Cookie consent banner (analytics only). Stores the choice in localStorage under "cookie-consent". */
(function () {
  var KEY = "cookie-consent";
  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function gUpdate(v) { if (typeof window.gtag === "function") window.gtag("consent", "update", { analytics_storage: v }); }
  function clarityOn() {
    if (typeof window.__loadClarity === "function") window.__loadClarity();
    try { if (window.clarity) window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "granted" }); } catch (e) {}
  }
  function clarityOff() {
    try { if (window.clarity) { window.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" }); window.clarity("stop"); } } catch (e) {}
  }
  function css() {
    if (document.getElementById("cc-style")) return;
    var s = document.createElement("style"); s.id = "cc-style";
    s.textContent =
      "#cc-banner{position:fixed;left:16px;right:16px;bottom:16px;max-width:720px;margin:0 auto;background:#14141a;color:#fff;border-radius:14px;padding:16px 18px;box-shadow:0 8px 30px rgba(0,0,0,.35);z-index:2147483000;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;display:flex;gap:14px;align-items:center;flex-wrap:wrap}" +
      "#cc-banner p{margin:0;flex:1 1 320px}#cc-banner a{color:#c9b8ff;text-decoration:underline}" +
      "#cc-banner .cc-btns{display:flex;gap:10px;flex:0 0 auto}" +
      "#cc-banner button{font:inherit;font-weight:600;border-radius:999px;padding:9px 18px;cursor:pointer;border:1.5px solid #fff;background:transparent;color:#fff}" +
      "#cc-banner button.cc-accept{background:#fff;color:#14141a}" +
      "#cc-banner button:focus-visible{outline:3px solid #c9b8ff;outline-offset:2px}";
    document.head.appendChild(s);
  }
  function hide() { var b = document.getElementById("cc-banner"); if (b && b.parentNode) b.parentNode.removeChild(b); }
  function choose(v) {
    set(v); hide();
    if (v === "granted") { gUpdate("granted"); clarityOn(); } else { gUpdate("denied"); clarityOff(); }
  }
  function show() {
    if (document.getElementById("cc-banner") || !document.body) return;
    css();
    var b = document.createElement("div");
    b.id = "cc-banner"; b.setAttribute("role", "region"); b.setAttribute("aria-label", "Cookie consent");
    b.innerHTML =
      '<p>We use cookies to measure how our site is used and to improve it. You can accept or decline analytics cookies. See our <a href="/privacy-policy">Privacy Policy</a>.</p>' +
      '<div class="cc-btns"><button type="button" class="cc-decline">Decline</button><button type="button" class="cc-accept">Accept</button></div>';
    b.querySelector(".cc-accept").addEventListener("click", function () { choose("granted"); });
    b.querySelector(".cc-decline").addEventListener("click", function () { choose("denied"); });
    document.body.appendChild(b);
  }
  function maybeShow() { if (!get()) show(); }
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("[data-cookie-settings]") : null;
    if (t) { e.preventDefault(); try { localStorage.removeItem(KEY); } catch (x) {} show(); }
  });
  document.addEventListener("astro:page-load", maybeShow);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", maybeShow); else maybeShow();
})();
