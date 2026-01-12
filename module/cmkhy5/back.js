// Find the page with `modulestatus.page` set to true












const pagesettingjson = webmakerdata.pagesetting.data.find(
  (item) => item.modulestatus && item.modulestatus.page,
);
let backhtml = `<a class="modulexmenulist-menu" href="/${json.lang}/">@home@ </a>`;
if (pagesettingjson) {
  for (const iterator of webmakerdata[pagesettingjson.path].data) {
    if (iterator.status == "play") {
      if (iterator.category == "") {
        if (page.path == iterator.path) {
          durum = "dropdown-content-active-modulex";
        } else {
          durum = "";
        }

        backhtml += `<div class="modulexmenulist-menu ${durum}" >

      <a href="/${json.lang}/${iterator.pathnext || iterator.path}/">
       ${iterator.name[json.lang]}
      </a>
     ${pagecategory(iterator.id)}
                    </div>
    `;
      }
    }
  }
  // Replace the placeholder {{html}} with the generated backhtml content
  html = html.replace(new RegExp("{{html}}", "g"), backhtml);
}
// Dil linklerini oluştur - mevcut sayfa path'ini koru
langhtml = "";
for (const key in webmakerdata.setting.langs) {
  if (webmakerdata.setting.langs[key] == true) {
    // Mevcut sayfa path'ini al - eğer boşsa ana sayfa, değilse aynı path'i kullan
    var currentPagePath = page.path || '';
    var langUrl = '';
    var isCurrentLang = key === json.lang;
    
    if (currentPagePath === '' || currentPagePath === undefined) {
      // Ana sayfa ise sadece dil kodu
      langUrl = `/${key}/`;
    } else {
      // Alt sayfa ise dil + path
      langUrl = `/${key}/${currentPagePath}/`;
    }
    
    // SEO için hreflang ve aria-current ekle
    var hreflangAttr = `hreflang="${key}"`;
    var ariaCurrentAttr = isCurrentLang ? ' aria-current="true"' : '';
    var titleAttr = `title="${key}"`;
    
    langhtml += `<a href="${langUrl}" ${hreflangAttr}${ariaCurrentAttr} ${titleAttr} aria-label="${key}" lang="${key}"><img height="25" src="/src/lang/${key}.png" alt="${key}"></a>`;
  }
}
html = html.replace(new RegExp("{{langhtml}}", "g"), langhtml);




html = html.replace(new RegExp("{{gonder}}", "g"), json.desing.gonder[json.lang]);
html = html.replace(new RegExp("{{teklifal}}", "g"), json.desing.teklifal[json.lang]);







function pagecategory(path) {
  let backhtml = "";
  if (path != undefined && path != "") {
    const pagesettingjson = webmakerdata.pagesetting.data.find(
      (item) => item.modulestatus && item.modulestatus.page,
    );
    if (pagesettingjson) {
      for (const page of webmakerdata[pagesettingjson.path].data) {
        if (page.status == "play") {
          if (path == page.category) {
            backhtml += `<a href="/${json.lang}/${page.path}/">
    ${page.name[json.lang]}</a>
      `;
          }
        }
      }
    }

    if (backhtml != "") {
      backhtml = `<div class="dropdown-content-modulex">
    ${backhtml}
    </div>`;
    }
  }
  return backhtml;
}


 
