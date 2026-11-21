
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const des = json.desing || {};
const W = webmakerdata || {};
const kat = String(des.ulkeKategori || "ulkeler").replace(/[^a-z0-9_-]/gi, "");
const kisa = des.ulkeKisa && typeof des.ulkeKisa === "object" ? des.ulkeKisa : {};
const kodHarita = des.ulkeKod && typeof des.ulkeKod === "object" ? des.ulkeKod : {};
const kisalt = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
const ulkeler = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : [])
  .filter((r) => r && r.status === "play")
  .map((r) => ({
    ad: pick(kisa[r.path]).trim() || pick(r.name).trim(),
    kod: String(kodHarita[r.path] || "").replace(/[^A-Z]/g, "").slice(0, 3),
    url: wxLangInternalHref(r.pathnext || r.path || ""),
    img: r.img ? `/page/${encodeURIComponent(r.id)}/${encodeURIComponent(r.img)}` : "",
    aciklama: kisalt(pick(r.description).trim(), 110),
  }))
  .filter((u) => u.ad);
const cikis = String(des.cikisKod || "TR").replace(/[^A-Z]/g, "").slice(0, 3);
const etiket = pick(des.hizmetEtiketi).trim();
const incele = pick(des.incele).trim();
const no = (i) => String(i + 1).padStart(2, "0");
const kartlar = ulkeler.map((u, i) => `<li><a class="modulex-knl-bilet" href="${esc(u.url)}">
  <span class="modulex-knl-kocan"><span class="modulex-knl-etiket">${esc(pick(des.seferEtiket))} ${no(i)}</span>
    <bdi dir="ltr" class="modulex-knl-kodlar"><span>${esc(cikis)}</span><span class="material-symbols-outlined modulex-knl-ucak" aria-hidden="true">local_shipping</span><span>${esc(u.kod || "··")}</span></bdi></span>
  <span class="modulex-knl-govde">
    ${u.img ? `<span class="modulex-knl-gorsel"><img src="${esc(u.img)}" alt="" width="160" height="160" loading="lazy" decoding="async" /></span>` : ""}
    <span class="modulex-knl-yazi"><strong>${esc(u.ad)}</strong>${u.aciklama ? `<small>${esc(u.aciklama)}</small>` : ""}${etiket ? `<span class="modulex-knl-tag">${esc(etiket)}</span>` : ""}</span>
    ${incele ? `<span class="modulex-knl-git">${esc(incele)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></span>` : ""}
  </span></a></li>`).join("");
const B = { ust: pick(des.ust).trim(), baslik: pick(des.baslik).trim(), metin: pick(des.metin).trim() };
const bas = B.ust || B.baslik || B.metin
  ? `<header class="modulex-knl-bas">${B.ust ? `<p class="modulex-knl-ust">${esc(B.ust)}</p>` : ""}${B.baslik ? `<h2 class="modulex-knl-baslik">${esc(B.baslik)}</h2>` : ""}${B.metin ? `<p class="modulex-knl-metin">${esc(B.metin)}</p>` : ""}</header>`
  : "";
html = ulkeler.length ? html.replaceAll("{{knl_govde}}", () => bas + `<ol class="modulex-knl-liste">${kartlar}</ol>`) : "";
