
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const des = json.desing || {};
const W = webmakerdata || {};
const ayar = W.setting || {};
const slugVar = new Set([""]);
for (const k of Object.keys(W)) {
  const kol = W[k];
  if (!kol || !Array.isArray(kol.data) || k === "setting" || k === "modules") continue;
  for (const r of kol.data) { if (r && r.status === "play") slugVar.add(String(r.pathnext || r.path || "")); }
}
const temiz = (v) => String(pick(v) || "").trim().replace(/^\/[a-z]{2}(\/|$)/i, "").replace(/^\/+|\/+$/g, "");
const varMi = (v) => slugVar.has(temiz(v));


const sutunlar = (Array.isArray(des.sutunlar) ? des.sutunlar : []).map((s) => {
  const kat = String(s && s.kategori || "").replace(/[^a-z0-9_-]/gi, "");
  const kisa = s && s.kisa && typeof s.kisa === "object" ? s.kisa : {};
  const satir = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : []).filter((r) => r && r.status === "play" && (r.category || "") === "").slice(0, 8);
  const li = satir.map((r) => {
    const ad = pick(kisa[r.path]).trim() || pick(r.name).trim();
    return ad ? `<li><a href="${esc(wxLangInternalHref(r.pathnext || r.path || ""))}">${esc(ad)}</a></li>` : "";
  }).join("");
  return li ? `<div class="modulex-kna-sutun"><p class="modulex-kna-etiket">${esc(pick(s.baslik))}</p><ul>${li}</ul></div>` : "";
}).join("");


const ofisler = (Array.isArray(des.ofisler) ? des.ofisler : []).filter((o) => o && pick(o.sehir).trim());
const ofisTablo = ofisler.length
  ? `<div class="modulex-kna-manifest"><p class="modulex-kna-etiket">${esc(pick(des.ofisBaslik))}</p><ol>${ofisler.map((o, i) => `<li><span class="modulex-kna-ono" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><span class="modulex-kna-osehir"><strong>${esc(pick(o.sehir))}</strong><small>${esc(pick(o.ulke))}</small></span><span class="modulex-kna-oadres">${esc(pick(o.adres))}</span></li>`).join("")}</ol></div>`
  : "";

const telHam = String(pick(des.tel) || ayar.phone || "").replace(/[^\d]/g, "");
const tel = telHam.length >= 8 ? telHam : "";
const telYazi = pick(des.telYazi).trim() || (tel ? "+" + tel : "");
const eposta = pick(des.eposta).trim();
const ctaAd = pick(des.ctaAd).trim();
const cta = ctaAd && varMi(des.ctaUrl) ? `<a class="modulex-kna-cta" href="${esc(wxLangInternalHref(temiz(des.ctaUrl)))}"><span>${esc(ctaAd)}</span><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "";
const alanlar = []
  .concat(tel ? [`<div class="modulex-kna-alan"><p class="modulex-kna-etiket">${esc(pick(des.telEtiket))}</p><a href="tel:+${tel}"><bdi dir="ltr">${esc(telYazi)}</bdi></a></div>`] : [])
  .concat(eposta ? [`<div class="modulex-kna-alan"><p class="modulex-kna-etiket">${esc(pick(des.epostaEtiket))}</p><a href="mailto:${esc(eposta)}">${esc(eposta)}</a></div>`] : [])
  .concat(pick(des.destek).trim() ? [`<div class="modulex-kna-alan"><p class="modulex-kna-etiket">${esc(pick(des.destekEtiket))}</p><span>${esc(pick(des.destek))}</span></div>`] : [])
  .join("");

const WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4 5.3 5.3 0 0 0 3.2.7 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
const waMesaj = pick(des.waMesaj).trim();
const wa = tel ? `<a class="modulex-kna-wa" href="https://wa.me/${tel}${waMesaj ? "?text=" + encodeURIComponent(waMesaj) : ""}" target="_blank" rel="noopener" aria-label="${esc(pick(des.waEtiket))}">${WA}</a>` : "";
const ad = pick(ayar.name).trim();
const yil = new Date().getFullYear();
const logoDosya = String(pick(des.logoDosya) || "").trim().replace(/[^a-z0-9._/-]/gi, "");

html = html
  .replaceAll("{{kna_manset}}", () => esc(pick(des.manset)))
  .replaceAll("{{kna_metin}}", () => esc(pick(des.metin)))
  .replaceAll("{{kna_cta}}", () => cta)
  .replaceAll("{{kna_alanlar}}", () => alanlar)
  .replaceAll("{{kna_manifest}}", () => ofisTablo)
  .replaceAll("{{kna_sutunlar}}", () => sutunlar)
  .replaceAll("{{kna_wa}}", () => wa)
  .replaceAll("{{kna_telif}}", () => `© ${yil} ${esc(ad)}`)
  .replaceAll("{{kna_belge}}", () => esc(pick(des.belgeNo)))
  .replaceAll("{{kna_logo}}", () => (logoDosya || "{{logo}}"));
