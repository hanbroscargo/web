

let data = "";

if (json.desing && json.desing.data) {
    for (const key in json.desing.data) {
        const item = json.desing.data[key];
        const title = item.title && item.title[json.lang] ? item.title[json.lang] : item[json.lang] || 'Başlık';
        
        data += `
        <div class="modulex-item" onclick="pageteklif('modulex-${json.desing.data[key].id}')">
            <img class="modulex-item-img" 
                 src="/img/akf1q6/${json.desing.data[key].img}" 
                 alt="${title}"
                 loading="lazy">
            <div class="modulex-item-title">
                ${title}
            </div>
        </div>`;
    }
}

html = html.replace(new RegExp("{{menu}}", "g"), data);




