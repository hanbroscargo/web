
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
const kat = String(des.kategori || "blog").replace(/[^a-z0-9_-]/gi, "");
const adet = Math.max(1, Math.min(12, parseInt(des.adet, 10) || 3));
const kisalt = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
const tarihYaz = (t) => { const d = new Date(t); return isNaN(d) ? "" : d.toISOString().slice(0, 10).split("-").reverse().join("."); };
const yazilar = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : [])
  .filter((r) => r && r.status === "play" && pick(r.name).trim())
  .map((r, i) => ({ r, i, t: Date.parse(r.date || r.update || "") || 0 }))
  .sort((a, b) => b.t - a.t || a.i - b.i)
  .slice(0, adet)
  .map(({ r }) => ({
    ad: pick(r.name).trim(),
    url: wxLangInternalHref(r.pathnext || r.path || ""),
    img: r.img ? `/page/${encodeURIComponent(r.id)}/${encodeURIComponent(r.img)}` : "",
    aciklama: kisalt(pick(r.description).trim(), 130),
    tarih: tarihYaz(r.date || r.update),
  }));
const dosya = pick(des.dosyaEtiket).trim();
const kartlar = yazilar.map((y, i) => `<li><a class="modulex-knr-kart" href="${esc(y.url)}">
  <span class="modulex-knr-sekme"><span>${esc(dosya)} ${String(i + 1).padStart(2, "0")}</span>${y.tarih ? `<time>${esc(y.tarih)}</time>` : ""}</span>
  <span class="modulex-knr-ic2">
    ${y.img ? `<span class="modulex-knr-gorsel"><img src="${esc(y.img)}" alt="" width="480" height="270" loading="lazy" decoding="async" /></span>` : ""}
    <strong>${esc(y.ad)}</strong>${y.aciklama ? `<small>${esc(y.aciklama)}</small>` : ""}
    ${pick(des.oku).trim() ? `<span class="modulex-knr-oku">${esc(pick(des.oku))}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></span>` : ""}
  </span></a></li>`).join("");
const tumY = temiz(des.tumUrl);
const sayfaY = String(page && (page.pathnext || page.path) || "");
const tum = pick(des.tumAd).trim() && slugVar.has(tumY) && tumY !== sayfaY ? `<a class="modulex-knr-tum" href="${esc(wxLangInternalHref(tumY))}">${esc(pick(des.tumAd))}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "";
const B = { ust: pick(des.ust).trim(), baslik: pick(des.baslik).trim() };
const bas = `<header class="modulex-knr-bas"><div>${B.ust ? `<p class="modulex-knr-ust">${esc(B.ust)}</p>` : ""}${B.baslik ? `<h2 class="modulex-knr-baslik">${esc(B.baslik)}</h2>` : ""}</div>${tum}</header>`;
html = yazilar.length ? html.replaceAll("{{knr_govde}}", () => bas + `<ol class="modulex-knr-liste">${kartlar}</ol>`) : "";
