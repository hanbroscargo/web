
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const des = json.desing || {};
const W = webmakerdata || {};
const slugVar = new Set([""]);
for (const k of Object.keys(W)) {
  const kol = W[k];
  if (!kol || !Array.isArray(kol.data) || k === "setting" || k === "modules") continue;
  for (const r of kol.data) { if (r && r.status === "play") slugVar.add(String(r.pathnext || r.path || "")); }
}
const temiz = (v) => String(pick(v) || "").trim().replace(/^\/[a-z]{2}(\/|$)/i, "").replace(/^\/+|\/+$/g, "");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const adimlar = (Array.isArray(des.adimlar) ? des.adimlar : []).filter((a) => a && pick(a.baslik).trim());
const etiket = pick(des.adimEtiket).trim();
const satir = adimlar.map((a, i) => {
  const y = temiz(a.url);
  const link = pick(a.link).trim() && slugVar.has(y) ? `<a class="modulex-kns-link" href="${esc(wxLangInternalHref(y))}">${esc(pick(a.link))}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "";
  return `<li class="modulex-kns-adim"><span class="modulex-kns-kutu" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg></span>
    <span class="modulex-kns-no">${esc(etiket)} ${String(i + 1).padStart(2, "0")}</span>
    <span class="modulex-kns-ikon material-symbols-outlined" aria-hidden="true">${ikonAd(a.ikon) || "check"}</span>
    <h3 class="modulex-kns-abaslik">${esc(pick(a.baslik))}</h3>
    ${pick(a.metin).trim() ? `<p class="modulex-kns-ametin">${esc(pick(a.metin))}</p>` : ""}${link}</li>`;
}).join("");
const B = { ust: pick(des.ust).trim(), baslik: pick(des.baslik).trim(), metin: pick(des.metin).trim() };
const bas = B.ust || B.baslik || B.metin
  ? `<header class="modulex-kns-bas">${B.ust ? `<p class="modulex-kns-ust">${esc(B.ust)}</p>` : ""}${B.baslik ? `<h2 class="modulex-kns-baslik">${esc(B.baslik)}</h2>` : ""}${B.metin ? `<p class="modulex-kns-metin">${esc(B.metin)}</p>` : ""}</header>`
  : "";
const ctaY = temiz(des.ctaUrl);
const cta = pick(des.ctaAd).trim() && slugVar.has(ctaY) ? `<a class="modulex-kns-cta" href="${esc(wxLangInternalHref(ctaY))}">${esc(pick(des.ctaAd))}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "";
html = adimlar.length ? html.replaceAll("{{kns_govde}}", () => bas + `<ol class="modulex-kns-liste">${satir}</ol>` + cta) : "";
