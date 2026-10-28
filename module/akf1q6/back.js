


var TASIMA_TIPLERI = [
    { code: 'CA', hash: 'kargo', title: { tr: 'Kargo', en: 'Cargo' }, icon: 'local_shipping' },
    { code: 'CO', hash: 'ticari', title: { tr: 'Ticari', en: 'Commercial' }, icon: 'business_center' },
    { code: 'FU', hash: 'mobilya', title: { tr: 'Mobilya', en: 'Furniture' }, icon: 'weekend' },
    { code: 'RE', hash: 'zati', title: { tr: 'Zati', en: 'Personal Effects' }, icon: 'inventory_2' },
    { code: 'AU', hash: 'arac', title: { tr: 'Araç', en: 'Vehicle' }, icon: 'directions_car' }
];
var menuHtml = '';
var lang = (typeof json !== 'undefined' && json.lang && json.lang === 'en') ? 'en' : 'tr';
var data = (typeof json !== 'undefined' && json.desing && json.desing.data && Array.isArray(json.desing.data)) ? json.desing.data : null;
var go1ilzBase = '/' + lang + '/akilli-hesaplama/';
var i;
for (i = 0; i < TASIMA_TIPLERI.length; i++) {
    var tip = TASIMA_TIPLERI[i];
    var it = data && data[i] ? data[i] : tip;
    var title = (it.title && it.title[lang]) ? it.title[lang]
              : (it.title && it.title.tr) ? it.title.tr
              : (it.title && it.title.en) ? it.title.en
              : tip.title[lang];
    var iconName = (it && it.icon) ? it.icon : tip.icon;
    var code = (it && it.code) ? it.code : tip.code;
    var hash = (it && it.hash) ? it.hash : tip.hash;
    var href = go1ilzBase + '#' + hash;
    menuHtml += '<a class="modulex-item" href="' + href + '" aria-label="' + title + '" data-request-type="' + code + '">';
    menuHtml += '<span class="modulex-item-badge">' + code + '</span>';
    menuHtml += '<span class="modulex-item-icon material-symbols-outlined" aria-hidden="true">' + iconName + '</span>';
    menuHtml += '<span class="modulex-item-title">' + title + '</span>';
    menuHtml += '<span class="modulex-item-arrow material-symbols-outlined" aria-hidden="true">arrow_forward</span>';
    menuHtml += '</a>';
}
var h1Text = "";
try {
  if (typeof json !== "undefined" && json && json["name"]) {
    var h1L = (json.lang || "tr").toString().slice(0, 2).toLowerCase();
    var h1Src = json["name"];
    if (typeof h1Src === "object" && h1Src !== null) { h1Text = h1Src[h1L] || h1Src.tr || h1Src.en || ""; }
    else { h1Text = String(h1Src); }
  }
} catch (h1e) { h1Text = ""; }
var h1Html = h1Text ? '<h1 class="modulex-pageh1" style="font-size:30px;font-weight:600;margin:0 0 18px 0;">' + h1Text + '</h1>' : "";
if (h1Html) { html = h1Html + html; }
html = html.replace(/\{\{menu\}\}/g, menuHtml || '');
