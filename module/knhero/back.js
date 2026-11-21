
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
const varMi = (v) => slugVar.has(temiz(v));
const git = (v) => esc(wxLangInternalHref(temiz(v)));

const kat = String(des.ulkeKategori || "ulkeler").replace(/[^a-z0-9_-]/gi, "");
const ulkeSay = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : []).filter((r) => r && r.status === "play").length;
const kodlar = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : [])
  .filter((r) => r && r.status === "play" && des.ulkeKod && des.ulkeKod[r.path])
  .map((r) => String(des.ulkeKod[r.path]).replace(/[^A-Z]/g, "").slice(0, 3));

const hucre = (etiket, deger) => (pick(etiket).trim() && String(deger).trim()
  ? `<div class="modulex-knh-hucre"><span class="modulex-knh-etiket">${esc(pick(etiket))}</span><strong>${deger}</strong></div>` : "");
const alici = esc(pick(des.alici)) + (kodlar.length ? ` <bdi dir="ltr" class="modulex-knh-kod">${kodlar.map(esc).join(" ")}</bdi>` : "");
const hucreler = hucre(des.gonderenEtiket, esc(pick(des.gonderen))) + hucre(des.aliciEtiket, alici) + hucre(des.servisEtiket, esc(pick(des.servis)));

const b1 = pick(des.cta1Ad).trim() && varMi(des.cta1Url) ? `<a class="modulex-knh-btn modulex-knh-btn--dolu" href="${git(des.cta1Url)}"><span>${esc(pick(des.cta1Ad))}</span><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "";
const b2 = pick(des.cta2Ad).trim() && varMi(des.cta2Url) ? `<a class="modulex-knh-btn modulex-knh-btn--cizgi" href="${git(des.cta2Url)}"><span class="material-symbols-outlined" aria-hidden="true">calculate</span><span>${esc(pick(des.cta2Ad))}</span></a>` : "";
const takip = varMi(des.takipUrl) && pick(des.takipEtiket).trim()
  ? `<form class="modulex-knh-takip" action="${git(des.takipUrl)}" method="get" role="search">
      <label class="modulex-knh-etiket" for="knh-{{id}}-no">${esc(pick(des.takipEtiket))}</label>
      <div class="modulex-knh-takip-satir"><input id="knh-{{id}}-no" name="no" type="text" inputmode="text" autocomplete="off" maxlength="40" placeholder="${esc(pick(des.takipYer))}" required />
      <button type="submit"><span class="material-symbols-outlined" aria-hidden="true">package_2</span><span>${esc(pick(des.takipAd))}</span></button></div>
    </form>`
  : "";
const barkodYazi = esc(pick(des.barkodYazi).replace("{ulke}", String(ulkeSay)));
const img = String(pick(des.img) || "").trim().replace(/[^a-z0-9._/-]/gi, "");
const foto = img ? `<figure class="modulex-knh-foto"><img src="/img/${esc(img)}" alt="${esc(pick(des.alt))}" width="640" height="901" fetchpriority="high" decoding="async" /><span class="modulex-knh-bant modulex-knh-bant--1" aria-hidden="true"></span><span class="modulex-knh-bant modulex-knh-bant--2" aria-hidden="true"></span></figure>` : "";
const damga = pick(des.damga).trim() ? `<p class="modulex-knh-damga" aria-hidden="true"><span>${esc(pick(des.damga))}</span></p>` : "";

html = html
  .replaceAll("{{knh_ust}}", () => esc(pick(des.ust)))
  .replaceAll("{{knh_baslik}}", () => esc(pick(des.baslik)))
  .replaceAll("{{knh_metin}}", () => esc(pick(des.metin)))
  .replaceAll("{{knh_hucreler}}", () => hucreler)
  .replaceAll("{{knh_butonlar}}", () => (b1 || b2 ? `<div class="modulex-knh-butonlar">${b1}${b2}</div>` : ""))
  .replaceAll("{{knh_takip}}", () => takip)
  .replaceAll("{{knh_barkod}}", () => barkodYazi)
  .replaceAll("{{knh_foto}}", () => foto + damga)
  .replaceAll("{{knh_sinif}}", () => (foto ? "" : " modulex-knh--fotosuz"));
