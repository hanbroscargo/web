
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
const ctaY = temiz(des.ctaUrl);
const sayfaY = String(page && (page.pathnext || page.path) || "");
const cta = pick(des.ctaAd).trim() && slugVar.has(ctaY) && ctaY !== sayfaY
  ? `<a class="modulex-knc-btn modulex-knc-btn--lime" href="${esc(wxLangInternalHref(ctaY))}"><span>${esc(pick(des.ctaAd))}</span><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "";
const telHam = String(pick(des.tel) || (W.setting && W.setting.phone) || "").replace(/[^\d]/g, "");
const tel = telHam.length >= 8 ? telHam : "";
const wa = tel && pick(des.waAd).trim() ? `<a class="modulex-knc-btn modulex-knc-btn--cizgi" href="https://wa.me/${tel}" target="_blank" rel="noopener"><span class="material-symbols-outlined" aria-hidden="true">chat</span><span>${esc(pick(des.waAd))}</span></a>` : "";
const telA = tel ? `<a class="modulex-knc-tel" href="tel:+${tel}"><span class="material-symbols-outlined" aria-hidden="true">call</span><bdi dir="ltr">${esc(pick(des.telYazi) || "+" + tel)}</bdi></a>` : "";
const damga = pick(des.damga).trim();

const halka = damga ? (damga + " • ").repeat(Math.max(1, Math.ceil(46 / (damga.length + 3)))) : "";
html = html
  .replaceAll("{{knc_baslik}}", () => esc(pick(des.baslik)))
  .replaceAll("{{knc_metin}}", () => esc(pick(des.metin)))
  .replaceAll("{{knc_butonlar}}", () => cta + wa)
  .replaceAll("{{knc_tel}}", () => telA)
  .replaceAll("{{knc_halka}}", () => esc(halka))
  .replaceAll("{{knc_sinif}}", () => (damga ? "" : " modulex-knc--damgasiz"));
