
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const des = json.desing || {};
const W = webmakerdata || {};
const kat = String(des.kategori || "blog").replace(/[^a-z0-9_-]/gi, "");
const enCok = Math.max(1, Math.min(60, parseInt(des.max, 10) || 24));
const kisalt = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
const tarihYaz = (t) => { const d = new Date(t); return t && !isNaN(d) ? d.toISOString().slice(0, 10).split("-").reverse().join(".") : ""; };
const yazilar = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : [])
  .filter((r) => r && r.status === "play" && pick(r.name).trim())
  .map((r, i) => ({ r, i, t: Date.parse(r.date || r.update || "") || 0 }))
  .sort((a, b) => b.t - a.t || a.i - b.i)
  .slice(0, enCok)
  .map(({ r }) => ({
    ad: pick(r.name).trim(),
    url: wxLangInternalHref(r.pathnext || r.path || ""),
    img: r.img ? `/page/${encodeURIComponent(r.id)}/${encodeURIComponent(r.img)}` : "",
    aciklama: pick(r.description).trim(),
    tarih: tarihYaz(r.date || r.update),
  }));
const dosya = pick(des.dosyaEtiket).trim();
const oku = pick(des.oku).trim();
const okuH = oku ? `<span class="modulex-knb-oku">${esc(oku)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></span>` : "";
const no = (i) => String(i + 1).padStart(2, "0");
let govde = "";
if (yazilar.length) {
  const [k, ...kalan] = yazilar;
  const kapak = `<a class="modulex-knb-kapak" href="${esc(k.url)}">
    ${k.img ? `<span class="modulex-knb-kgorsel"><img src="${esc(k.img)}" alt="" width="720" height="405" decoding="async" /></span>` : ""}
    <span class="modulex-knb-kyazi"><span class="modulex-knb-damga">${esc(pick(des.kapakEtiket))}</span>
      <span class="modulex-knb-meta">${esc(dosya)} ${no(0)}${k.tarih ? ` · <time>${esc(k.tarih)}</time>` : ""}</span>
      <strong>${esc(k.ad)}</strong>${k.aciklama ? `<small>${esc(kisalt(k.aciklama, 220))}</small>` : ""}${okuH}</span></a>`;
  const kartlar = kalan.map((y, i) => `<li><a class="modulex-knb-kart" href="${esc(y.url)}">
    <span class="modulex-knb-sekme"><span>${esc(dosya)} ${no(i + 1)}</span>${y.tarih ? `<time>${esc(y.tarih)}</time>` : ""}</span>
    <span class="modulex-knb-kic">${y.img ? `<span class="modulex-knb-gorsel"><img src="${esc(y.img)}" alt="" width="480" height="270" loading="lazy" decoding="async" /></span>` : ""}
    <strong>${esc(y.ad)}</strong>${y.aciklama ? `<small>${esc(kisalt(y.aciklama, 130))}</small>` : ""}${okuH}</span></a></li>`).join("");
  const sayac = pick(des.sayacYazi).trim() ? `<p class="modulex-knb-sayac"><span>${esc(pick(des.sayacYazi))}</span><strong>${String(yazilar.length).padStart(2, "0")}</strong></p>` : "";
  const bas = pick(des.baslik).trim() ? `<header class="modulex-knb-bas"><h2 class="modulex-knb-baslik">${esc(pick(des.baslik))}</h2>${sayac}</header>` : "";
  govde = bas + kapak + (kartlar ? `<ol class="modulex-knb-liste">${kartlar}</ol>` : "");
} else if (pick(des.bos).trim()) {
  govde = `<p class="modulex-knb-bos">${esc(pick(des.bos))}</p>`;
}
html = govde ? html.replaceAll("{{knb_govde}}", () => govde) : "";
