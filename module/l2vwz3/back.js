
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const des = json.desing || {};
const W = webmakerdata || {};
const kat = String(des.kategori || "hizmetler").replace(/[^a-z0-9_-]/gi, "");
const kisa = des.hizmetKisa && typeof des.hizmetKisa === "object" ? des.hizmetKisa : {};
const kisalt = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
const ogeler = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : [])
  .filter((r) => r && r.status === "play")
  .map((r) => ({
    ad: pick(kisa[r.path]).trim() || pick(r.name).trim(),
    url: wxLangInternalHref(r.pathnext || r.path || ""),
    img: r.img ? `/page/${encodeURIComponent(r.id)}/${encodeURIComponent(r.img)}` : "",
    aciklama: kisalt(pick(r.description).trim(), 170),
  }))
  .filter((o) => o.ad);
const incele = pick(des.incele).trim();
const no = (i) => String(i + 1).padStart(2, "0");
const satirlar = ogeler.map((o, i) => `<li><a class="modulex-knz-satir" href="${esc(o.url)}">
  <span class="modulex-knz-no" aria-hidden="true">${no(i)}</span>
  ${o.img ? `<span class="modulex-knz-gorsel"><img src="${esc(o.img)}" alt="" width="240" height="160" loading="lazy" decoding="async" /></span>` : `<span class="modulex-knz-gorsel modulex-knz-gorsel--bos" aria-hidden="true"></span>`}
  <span class="modulex-knz-yazi"><strong>${esc(o.ad)}</strong>${o.aciklama ? `<small>${esc(o.aciklama)}</small>` : ""}</span>
  <span class="modulex-knz-git">${incele ? `<span class="modulex-knz-gityazi">${esc(incele)}</span>` : ""}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></span>
</a></li>`).join("");
const B = { ust: pick(des.ust).trim(), baslik: pick(des.baslik).trim(), metin: pick(des.metin).trim() };
const ozet = pick(des.kalemYazi).trim() ? `<p class="modulex-knz-ozet"><span>${esc(pick(des.kalemYazi))}</span><strong>${String(ogeler.length).padStart(2, "0")}</strong></p>` : "";
const bas = `<header class="modulex-knz-bas"><div>${B.ust ? `<p class="modulex-knz-ust">${esc(B.ust)}</p>` : ""}${B.baslik ? `<h2 class="modulex-knz-baslik">${esc(B.baslik)}</h2>` : ""}${B.metin ? `<p class="modulex-knz-metin">${esc(B.metin)}</p>` : ""}</div>${ozet}</header>`;
const kolon = `<div class="modulex-knz-kolon" aria-hidden="true"><span>${esc(pick(des.kolonNo))}</span><span></span><span>${esc(pick(des.kolonHizmet))}</span><span></span></div>`;
html = ogeler.length ? html.replaceAll("{{knz_govde}}", () => bas + `<div class="modulex-knz-tablo">${kolon}<ol class="modulex-knz-liste">${satirlar}</ol></div>`) : "";
