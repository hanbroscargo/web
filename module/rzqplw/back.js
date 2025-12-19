// İndirim çeki formu modülü
// URL'den id parametresini alır ve form oluşturur

var title = json.desing.title ? json.desing.title[json.lang] : '🎟️ İndirim Çeki';
var subtitle = json.desing.subtitle ? json.desing.subtitle[json.lang] : 'Fuar indirim çeki için formu doldurunuz';

// HTML'deki placeholder'ları değiştir
html = html.replace(new RegExp("{{title}}", "g"), title);
html = html.replace(new RegExp("{{subtitle}}", "g"), subtitle);
