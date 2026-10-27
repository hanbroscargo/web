

var title = json.desing.title ? json.desing.title[json.lang] : '🎟️ İndirim Çeki';
var subtitle = json.desing.subtitle ? json.desing.subtitle[json.lang] : 'Fuar indirim çeki için formu doldurunuz';
html = html.replace(new RegExp("{{title}}", "g"), title);
html = html.replace(new RegExp("{{subtitle}}", "g"), subtitle);
