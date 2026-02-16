// Dinamik menu: desing.data kartlarından menü HTML üretilir.
// {{menu}} placeholder'ı render'da desing key'i olmadığı için back.js'de doldurulur.
var menuHtml = '';
if (typeof json !== 'undefined' && json.desing && json.desing.data && Array.isArray(json.desing.data)) {
    var lang = (json.lang && json.lang === 'en') ? 'en' : 'tr';
    for (var i = 0; i < json.desing.data.length; i++) {
        var it = json.desing.data[i];
        var title = (it.title && it.title[lang]) ? it.title[lang] : (it.title && it.title.tr) ? it.title.tr : (it.title && it.title.en) ? it.title.en : 'Kart ' + (i + 1);
        var img = it.img ? ('/module/akf1q6/images/' + it.img) : '/module/akf1q6/images/kargo-tasimaciligi.jpg';
        var modulexId = 'modulex-' + (i + 1);
        menuHtml += '<div class="modulex-item" role="button" tabindex="0" onclick="pageteklif(\'' + modulexId + '\')" style="cursor: pointer;" aria-label="' + title + '">';
        menuHtml += '<img class="modulex-item-img" src="' + img + '" alt="' + title + '" width="80" height="80" loading="lazy">';
        menuHtml += '<span class="modulex-item-title">' + title + '</span></div>';
    }
}
html = html.replace(/\{\{menu\}\}/g, menuHtml || '');
