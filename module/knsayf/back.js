
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const des = json.desing || {};
const W = webmakerdata || {};
const P = page || {};
const ATLA = new Set(["setting", "modules", "pagesetting", "desing"]);

if (!P.path || !P.id) {
  html = "";
} else {
  const slugVar = new Set([""]);
  for (const k of Object.keys(W)) {
    const kol = W[k];
    if (!kol || !Array.isArray(kol.data) || ATLA.has(k)) continue;
    for (const r of kol.data) { if (r && r.status === "play") slugVar.add(String(r.pathnext || r.path || "")); }
  }
  const temiz = (v) => String(pick(v) || "").trim().replace(/^\/[a-z]{2}(\/|$)/i, "").replace(/^\/+|\/+$/g, "");
  const href = (r) => wxLangInternalHref(r.pathnext || r.path || "");

  
  let kat = "";
  let sira = -1;
  for (const k of Object.keys(W)) {
    const kol = W[k];
    if (!kol || !Array.isArray(kol.data) || ATLA.has(k)) continue;
    const i = kol.data.findIndex((r) => r && r.id === P.id);
    if (i !== -1) { kat = k; sira = i; break; }
  }
  const ps = W.pagesetting && Array.isArray(W.pagesetting.data) ? W.pagesetting.data.find((it) => it && it.modulestatus && it.modulestatus.page) : null;
  const sayfaKat = ps ? ps.path : "page";
  let hub = null;
  if (kat && kat !== sayfaKat) {
    for (const k of Object.keys(W)) {
      const kol = W[k];
      if (!kol || !Array.isArray(kol.data) || ATLA.has(k) || k === kat) continue;
      const r = kol.data.find((x) => x && x.status === "play" && (x.id === kat || x.path === kat));
      if (r) { hub = { ad: pick(r.name).trim(), url: href(r) }; break; }
    }
  }

  
  const ad = pick(P.name).trim() || pick(P.title).trim();
  const ozet = pick(P.description).trim();
  const kirinti = [`<li><a href="${esc(wxLangInternalHref(""))}">${esc(pick(des.anaSayfa))}</a></li>`]
    .concat(hub && hub.ad && hub.url !== href(P) ? [`<li><a href="${esc(hub.url)}">${esc(hub.ad)}</a></li>`] : [])
    .concat([`<li aria-current="page"><span>${esc(ad)}</span></li>`]).join("");
  const katKod = (des.katKod && des.katKod[kat]) || String(kat || "sf").replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase();
  const belgeNo = `${String(pick(des.belgeOnek) || "HB")}-${katKod}-${String(Math.max(0, sira) + 1).padStart(3, "0")}`;

  
  let metin = "";
  const ham = pick(P.text);
  if (ham && ham.trim()) {
    const htmlMi = ham.trim().indexOf("<") === 0 || ham.indexOf("<style") !== -1;
    metin = htmlMi ? ham : ham.split("\n").filter((s) => s.trim()).map((s) => `<p>${s}</p>`).join("\n");
  }
  const kelime = metin ? metin.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length : 0;
  const dakika = kelime > 120 ? Math.max(1, Math.round(kelime / 200)) : 0;
  const tarih = (() => { const d = new Date(P.date || ""); return P.date && !isNaN(d) ? d.toISOString().slice(0, 10).split("-").reverse().join(".") : ""; })();
  const ulkeKat = String(des.ulkeKategori || "ulkeler");
  const ulkeKod = kat === ulkeKat && des.ulkeKod ? String(des.ulkeKod[P.path] || "").replace(/[^A-Z]/g, "").slice(0, 3) : "";
  const hucre = (etiket, deger, mono) => (pick(etiket).trim() && deger ? `<div class="modulex-knp-hucre"><span class="modulex-knp-etiket">${esc(pick(etiket))}</span><strong${mono ? ' class="modulex-knp-mono"' : ""}>${deger}</strong></div>` : "");
  const hucreler = hucre(des.belgeEtiket, `<bdi dir="ltr">${esc(belgeNo)}</bdi>`, true)
    + hucre(des.bolumEtiket, hub && hub.ad ? esc(hub.ad) : "", false)
    + hucre(des.guzergahEtiket, ulkeKod ? `<bdi dir="ltr">${esc(String(des.cikisKod || "TR"))} → ${esc(ulkeKod)}</bdi>` : "", true)
    + hucre(des.tarihEtiket, tarih ? esc(tarih) : "", true)
    + hucre(des.okumaEtiket, dakika ? esc(pick(des.okumaYazi).replace("{dk}", String(dakika))) : "", true);

  
  let gorsel = "";
  const imgAd = String(P.img || "").trim();
  if (imgAd && !/^(https?:)?\/\//i.test(imgAd) && !imgAd.includes("..")) {
    const wd = typeof webDir === "string" ? webDir : "";
    const fsx = typeof fsSync !== "undefined" ? fsSync : null;
    
    const ikonAdli = /^(logo\d*|icon|favicon|info|tracking)\.(png|svg|webp|jpe?g)$/i.test(imgAd);
    let var_ = !ikonAdli;
    if (var_ && wd && fsx && typeof fsx.existsSync === "function" && typeof path !== "undefined") {
      var_ = fsx.existsSync(path.join(wd, "page", String(P.id), imgAd));
    }
    if (var_) gorsel = `/page/${encodeURIComponent(P.id)}/${encodeURIComponent(imgAd)}`;
  }
  const foto = gorsel
    ? `<figure class="modulex-knp-foto${(Array.isArray(des.seritliKategori) ? des.seritliKategori : []).includes(kat) ? " modulex-knp-foto--seritli" : ""}"><img src="${esc(gorsel)}" alt="${esc(ad)}" width="560" height="420" fetchpriority="high" decoding="async" /><figcaption><bdi dir="ltr">${esc(belgeNo)}</bdi></figcaption></figure>`
    : `<div class="modulex-knp-barkodkart" aria-hidden="true"><span class="modulex-knp-cubuk"></span><bdi dir="ltr">${esc(belgeNo)}</bdi></div>`;

  
  const h1Atla = Array.isArray(des.h1Atla) ? des.h1Atla : [];
  const govde = P.desing && Array.isArray(P.desing.body) ? P.desing.body.map((x) => (x && typeof x === "object" ? x.id : x)) : [];
  const baslikEtiket = govde.some((id) => h1Atla.includes(id)) ? "p" : "h1";
  const islevKip = govde.some((id) => (Array.isArray(des.islevModul) ? des.islevModul : []).includes(id));

  
  let icerik = "";
  if (metin && islevKip) {
    icerik = `<details class="modulex-knp-not"><summary><span class="material-symbols-outlined" aria-hidden="true">sticky_note_2</span><span>${esc(pick(des.notBaslik))}</span>${dakika ? `<small>${esc(pick(des.okumaYazi).replace("{dk}", String(dakika)))}</small>` : ""}</summary><div class="modulex-knp-metin">${metin}</div></details>`;
  } else if (metin) {
    const eylemler = (Array.isArray(des.eylemler) ? des.eylemler : []).map((e) => {
      if (!e || !pick(e.ad).trim()) return "";
      const ikon = String(e.ikon || "arrow_forward").replace(/[^a-z0-9_]/gi, "");
      if (e.url === "wa") {
        const tel = String(pick(des.tel) || (W.setting && W.setting.phone) || "").replace(/[^\d]/g, "");
        return tel.length >= 8 ? `<li><a href="https://wa.me/${tel}" target="_blank" rel="noopener"><span class="material-symbols-outlined" aria-hidden="true">${ikon}</span><span>${esc(pick(e.ad))}</span></a></li>` : "";
      }
      const y = temiz(e.url);
      return slugVar.has(y) && y !== String(P.pathnext || P.path) ? `<li><a href="${esc(wxLangInternalHref(y))}"><span class="material-symbols-outlined" aria-hidden="true">${ikon}</span><span>${esc(pick(e.ad))}</span></a></li>` : "";
    }).join("");
    let komsu = "";
    if (kat && kat !== sayfaKat && Array.isArray(W[kat] && W[kat].data)) {
      const tum = W[kat].data.filter((r) => r && r.status === "play" && r.id !== P.id && pick(r.name).trim());
      
      const bas = tum.length > 8 ? Math.max(0, Math.min(tum.length - 8, sira - 3)) : 0;
      komsu = tum.slice(bas, bas + 8).map((r) => `<li><a href="${esc(href(r))}">${esc(pick(r.name).trim())}</a></li>`).join("");
    }
    const fis = (eylemler || komsu)
      ? `<aside class="modulex-knp-fis" aria-label="${esc(pick(des.fisBaslik))}"><p class="modulex-knp-fisbas"><span>${esc(pick(des.fisBaslik))}</span><bdi dir="ltr">${esc(belgeNo)}</bdi></p>`
        + (eylemler ? `<ul class="modulex-knp-eylem">${eylemler}</ul>` : "")
        + (komsu ? `<p class="modulex-knp-etiket modulex-knp-komsubas">${esc(pick(des.komsuBaslik))}</p><ol class="modulex-knp-komsu">${komsu}</ol>` : "")
        + `</aside>`
      : "";
    icerik = `<div class="modulex-knp-govde${fis ? "" : " modulex-knp-govde--tek"}"><div class="modulex-knp-metin">${metin}</div>${fis}</div>`;
  }

  html = html
    .replaceAll("{{knp_kirinti}}", () => kirinti)
    .replaceAll("{{knp_kirintietiket}}", () => esc(pick(des.kirintiEtiket)))
    .replaceAll("{{knp_hucreler}}", () => hucreler)
    .replaceAll("{{knp_baslik}}", () => `<${baslikEtiket} class="modulex-knp-baslik">${esc(ad)}</${baslikEtiket}>`)
    .replaceAll("{{knp_ozet}}", () => (ozet ? `<p class="modulex-knp-ozet">${esc(ozet)}</p>` : ""))
    .replaceAll("{{knp_foto}}", () => foto)
    .replaceAll("{{knp_icerik}}", () => icerik)
    .replaceAll("{{knp_sinif}}", () => (icerik && !islevKip ? "" : " modulex-knp--kisa") + (islevKip ? " modulex-knp--islev" : ""));
}
