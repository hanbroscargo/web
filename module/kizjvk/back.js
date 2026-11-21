
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) {  } }
  return String(v[json.lang] ?? v.tr ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const des = json.desing || {};
const W = webmakerdata || {};

const kaynak = Array.isArray(json.data) && json.data.length ? json
  : (W.modules && Array.isArray(W.modules.data) ? W.modules.data : []).find((m) => m && m.path === String(des.kaynakModul || "contact-4") && Array.isArray(m.data));
const ofisler = (kaynak ? kaynak.data : []).map((o) => {
  const satir = Array.isArray(o && o.data) ? o.data : [];
  const yer = satir.find((x) => x && x.icon === "location_on") || {};
  const map = String(o && o.map || "");
  return {
    ad: pick(yer.name).trim(),
    adres: String(yer.text || "").trim(),
    map: /^https:\/\/www\.google\.com\/maps\/embed\?/.test(map) ? map : "",
  };
}).filter((o) => o.ad);

const telHam = String(pick(des.tel) || (W.setting && W.setting.phone) || "").replace(/[^\d]/g, "");
const tel = telHam.length >= 8 ? telHam : "";
const telYazi = pick(des.telYazi).trim() || (tel ? "+" + tel : "");
const eposta = pick(des.eposta).trim();
const alan = (ikon, etiket, icerik) => `<li class="modulex-kni-alan"><span class="material-symbols-outlined" aria-hidden="true">${ikon}</span><span class="modulex-kni-etiket">${esc(pick(etiket))}</span>${icerik}</li>`;
const alanlar = []
  .concat(tel ? [alan("call", des.telEtiket, `<a class="modulex-kni-buyuk" href="tel:+${tel}"><bdi dir="ltr">${esc(telYazi)}</bdi></a>`)] : [])
  .concat(eposta ? [alan("mail", des.epostaEtiket, `<a class="modulex-kni-buyuk" href="mailto:${esc(eposta)}">${esc(eposta)}</a>`)] : [])
  .concat(tel && pick(des.waAd).trim() ? [alan("chat", des.waEtiket, `<a class="modulex-kni-wa" href="https://wa.me/${tel}" target="_blank" rel="noopener">${esc(pick(des.waAd))}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>`)] : [])
  .concat(pick(des.destek).trim() ? [alan("schedule", des.destekEtiket, `<span class="modulex-kni-buyuk">${esc(pick(des.destek))}</span>`)] : [])
  .join("");

const sekmeler = ofisler.map((o, i) => `<li role="presentation"><button type="button" role="tab" id="kni-{{id}}-t${i}" aria-controls="kni-{{id}}-p" aria-selected="${i === 0 ? "true" : "false"}" tabindex="${i === 0 ? "0" : "-1"}" data-adres="${esc(o.adres)}" data-ad="${esc(o.ad)}" data-map="${esc(o.map)}"><span class="modulex-kni-no" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span><span>${esc(o.ad)}</span></button></li>`).join("");
const ilk = ofisler[0] || null;
const ofisBolum = ilk
  ? `<div class="modulex-kni-ofis"><p class="modulex-kni-etiket">${esc(pick(des.ofisBaslik))}</p>
      <ul class="modulex-kni-sekmeler" role="tablist" aria-label="${esc(pick(des.ofisBaslik))}">${sekmeler}</ul>
      <div class="modulex-kni-panel" id="kni-{{id}}-p" role="tabpanel" aria-labelledby="kni-{{id}}-t0">
        <p class="modulex-kni-pad">${esc(ilk.ad)}</p><p class="modulex-kni-padres">${esc(ilk.adres)}</p>
        <div class="modulex-kni-harita"><span class="material-symbols-outlined modulex-kni-pin" aria-hidden="true">location_on</span>
          <button type="button" class="modulex-kni-haritabtn"${ilk.map ? "" : " hidden"}><span class="material-symbols-outlined" aria-hidden="true">map</span>${esc(pick(des.haritaAd))}</button></div>
      </div></div>`
  : "";
html = html
  .replaceAll("{{kni_ust}}", () => esc(pick(des.ust)))
  .replaceAll("{{kni_baslik}}", () => esc(pick(des.baslik)))
  .replaceAll("{{kni_metin}}", () => esc(pick(des.metin)))
  .replaceAll("{{kni_alanlar}}", () => alanlar)
  .replaceAll("{{kni_ofis}}", () => ofisBolum)
  .replaceAll("{{kni_haritabaslik}}", () => esc(pick(des.haritaBaslik)));
