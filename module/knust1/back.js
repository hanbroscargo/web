
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const des = json.desing || {};
const W = webmakerdata || {};
const ayar = W.setting || {};
const sayfa = page || {};


const slugVar = new Set([""]);
for (const k of Object.keys(W)) {
  const kol = W[k];
  if (!kol || !Array.isArray(kol.data) || k === "setting" || k === "modules") continue;
  for (const r of kol.data) { if (r && r.status === "play") slugVar.add(String(r.pathnext || r.path || "")); }
}
const temiz = (v) => String(pick(v) || "").trim().replace(/^\/[a-z]{2}(\/|$)/i, "").replace(/^\/+|\/+$/g, "");
const varMi = (v) => slugVar.has(temiz(v));
const aktifSlug = String(sayfa.pathnext || sayfa.path || "");


const ogeler = [{ ad: pick(des.anaSayfa).trim() || "Home", url: wxLangInternalHref(""), aktif: !sayfa.path }];
const ps = W.pagesetting && Array.isArray(W.pagesetting.data) ? W.pagesetting.data.find((it) => it && it.modulestatus && it.modulestatus.page) : null;
const satirlar = ps && W[ps.path] && Array.isArray(W[ps.path].data) ? W[ps.path].data : [];
for (const r of satirlar) {
  if (!r || r.status !== "play" || (r.category || "") !== "") continue;
  const ad = pick(r.name).trim();
  if (!ad) continue;
  ogeler.push({ ad, url: wxLangInternalHref(r.pathnext || r.path || ""), aktif: !!sayfa.path && (sayfa.path === r.path || sayfa.categorypage === r.path) });
}
const no = (i) => String(i).padStart(2, "0");
const nav = ogeler.map((o, i) => `<li><a class="modulex-knu-oge" href="${esc(o.url)}"${o.aktif ? ' aria-current="page"' : ""}><span class="modulex-knu-no" aria-hidden="true">${no(i)}</span><span>${esc(o.ad)}</span></a></li>`).join("");
const panelNav = ogeler.map((o, i) => `<li><a class="modulex-knu-poge" href="${esc(o.url)}"${o.aktif ? ' aria-current="page"' : ""}><span class="modulex-knu-no" aria-hidden="true">${no(i)}</span><span>${esc(o.ad)}</span></a></li>`).join("");


const kat = String(des.ulkeKategori || "ulkeler").replace(/[^a-z0-9_-]/gi, "");
const kodlar = (W[kat] && Array.isArray(W[kat].data) ? W[kat].data : [])
  .filter((r) => r && r.status === "play" && des.ulkeKod && des.ulkeKod[r.path])
  .map((r) => String(des.ulkeKod[r.path]).replace(/[^A-Z]/g, "").slice(0, 3));
const cikisKod = String(des.cikisKod || "TR").replace(/[^A-Z]/g, "").slice(0, 3);
const rota = kodlar.length
  ? `<bdi dir="ltr" class="modulex-knu-kodlar">${esc(cikisKod)}<span class="modulex-knu-ok" aria-hidden="true">→</span>${kodlar.map(esc).join('<span class="modulex-knu-nokta" aria-hidden="true">·</span>')}</bdi>`
  : "";


const telHam = String(pick(des.tel) || ayar.phone || "").replace(/[^\d]/g, "");
const tel = telHam.length >= 8 ? telHam : "";
const telYazi = pick(des.telYazi).trim() || (tel ? "+" + tel : "");
const eposta = pick(des.eposta).trim();
const iletisim = []
  .concat(tel ? [`<a class="modulex-knu-sl" href="tel:+${tel}"><span class="material-symbols-outlined" aria-hidden="true">call</span><bdi dir="ltr">${esc(telYazi)}</bdi></a>`] : [])
  .concat(eposta ? [`<a class="modulex-knu-sl modulex-knu-sl--eposta" href="mailto:${esc(eposta)}"><span class="material-symbols-outlined" aria-hidden="true">mail</span><span>${esc(eposta)}</span></a>`] : [])
  .join("");

const takipAd = pick(des.takipAd).trim();
const takip = takipAd && varMi(des.takipUrl)
  ? `<a class="modulex-knu-takip" href="${esc(wxLangInternalHref(temiz(des.takipUrl)))}"><span class="material-symbols-outlined" aria-hidden="true">package_2</span><span class="modulex-knu-takip-yazi">${esc(takipAd)}</span></a>`
  : "";
const ctaAd = pick(des.ctaAd).trim();
const cta = ctaAd && varMi(des.ctaUrl)
  ? `<a class="modulex-knu-cta" href="${esc(wxLangInternalHref(temiz(des.ctaUrl)))}"><span>${esc(ctaAd)}</span><span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>`
  : "";


const bar = (Array.isArray(des.bar) ? des.bar : []).filter((b) => b && varMi(b.yol) && pick(b.ad).trim()).slice(0, 5);
const altbar = bar.length >= 2
  ? `<nav class="modulex-knu-altbar" aria-label="${esc(pick(des.altbarEtiket))}"><ul>${bar.map((b) => {
      const yol = temiz(b.yol);
      const aktif = yol === aktifSlug || (!yol && !sayfa.path);
      return `<li><a href="${esc(wxLangInternalHref(yol))}"${aktif ? ' aria-current="page"' : ""}><span class="material-symbols-outlined" aria-hidden="true">${ikonAd(b.ikon) || "circle"}</span><span>${esc(pick(b.ad))}</span></a></li>`;
    }).join("")}</ul></nav>`
  : "";

const logoDosya = String(pick(des.logoDosya) || "").trim().replace(/[^a-z0-9._/-]/gi, "");
html = html
  .replaceAll("{{knu_rotaetiket}}", () => esc(pick(des.rotaEtiket)))
  .replaceAll("{{knu_rota}}", () => rota)
  .replaceAll("{{knu_iletisim}}", () => iletisim)
  .replaceAll("{{knu_nav}}", () => nav)
  .replaceAll("{{knu_panelnav}}", () => panelNav)
  .replaceAll("{{knu_takip}}", () => takip)
  .replaceAll("{{knu_cta}}", () => cta)
  .replaceAll("{{knu_paneliletisim}}", () => (iletisim ? `<div class="modulex-knu-paneliletisim">${iletisim}</div>` : ""))
  .replaceAll("{{knu_altbar}}", () => altbar)
  .replaceAll("{{knu_sinif}}", () => (altbar ? " modulex-knu--altbarli" : ""))
  .replaceAll("{{knu_menuac}}", () => esc(pick(des.menuAc)))
  .replaceAll("{{knu_menukapat}}", () => esc(pick(des.menuKapat)))
  .replaceAll("{{knu_navetiket}}", () => esc(pick(des.navEtiket)))
  .replaceAll("{{knu_logo}}", () => (logoDosya || "{{logo}}"));
