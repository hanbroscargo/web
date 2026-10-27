

var pagesettingjson = webmakerdata.pagesetting.data.find(function (item) {
  return item.modulestatus && item.modulestatus.page;
});


function shouldSkipSubmenu(menuRow) {
  if (!menuRow) {
    return true;
  }
  var p = menuRow.path != null ? String(menuRow.path) : "";
  var nid = menuRow.id != null ? String(menuRow.id) : "";
  if (p === "bilgi-bankasi" || p === "iletisim") {
    return true;
  }
  if (nid === "bilgi-bankasi" || nid === "iletisim") {
    return true;
  }
  return false;
}
var backhtml =
  '<a class="modulexmenulist-menu modulexmenulist-home" href="/' +
  json.lang +
  '/">@home@ </a>';

if (pagesettingjson) {
  for (var ix = 0; ix < webmakerdata[pagesettingjson.path].data.length; ix++) {
    var iterator = webmakerdata[pagesettingjson.path].data[ix];
    if (iterator.status == "play") {
      if (iterator.category == "") {
        var durum = "";
        if (page.path == iterator.path) {
          durum = "dropdown-content-active-modulex";
        }

        var subHtml = "";
        if (!shouldSkipSubmenu(iterator)) {
          subHtml = pagecategory(iterator.id, iterator);
        }
        var hrefPage =
          "/" + json.lang + "/" + (iterator.pathnext || iterator.path) + "/";
        var itemLabel = iterator.name[json.lang];

        if (subHtml !== "") {
          var sid = "modulex-dropdown-" + ix;
          subHtml = subHtml.replace(
            '<div class="dropdown-content-modulex"',
            '<div id="' + sid + '" class="dropdown-content-modulex"',
          );
          backhtml +=
            '<div class="modulexmenulist-menu ' +
            durum +
            ' modulexmenulist-menu--hasdropdown">' +
            '<div class="modulexmenulist-row">' +
            '<a class="modulexmenulist-link" href="' +
            hrefPage +
            '">' +
            itemLabel +
            "</a>" +
            '<button type="button" class="modulex-submenu-toggle" aria-expanded="false" aria-controls="' +
            sid +
            '" title="Alt menü" aria-label="Alt menüyü aç veya kapat">' +
            '<span class="modulex-submenu-chevron" aria-hidden="true"></span>' +
            "</button>" +
            "</div>" +
            subHtml +
            "</div>\n";
        } else {
          backhtml +=
            '<div class="modulexmenulist-menu ' +
            durum +
            '">' +
            '<a class="modulexmenulist-link" href="' +
            hrefPage +
            '">' +
            itemLabel +
            "</a></div>\n";
        }
      }
    }
  }
  html = html.replace(new RegExp("{{html}}", "g"), backhtml);
}
langhtml = "";
for (var key in webmakerdata.setting.langs) {
  if (webmakerdata.setting.langs[key] == true) {
    var currentPagePath = page.path || "";
    var langUrl = "";
    var isCurrentLang = key === json.lang;

    if (currentPagePath === "" || currentPagePath === undefined) {
      langUrl = "/" + key + "/";
    } else {
      langUrl = "/" + key + "/" + currentPagePath + "/";
    }

    var hreflangAttr = 'hreflang="' + key + '"';
    var ariaCurrentAttr = isCurrentLang ? ' aria-current="true"' : "";
    var titleAttr = 'title="' + key + '"';

    langhtml +=
      '<a href="' +
      langUrl +
      '" ' +
      hreflangAttr +
      ariaCurrentAttr +
      " " +
      titleAttr +
      ' aria-label="' +
      key +
      '" lang="' +
      key +
      '"><img height="25" src="/src/lang/' +
      key +
      '.png" alt="' +
      key +
      '"></a>';
  }
}
html = html.replace(new RegExp("{{langhtml}}", "g"), langhtml);

html = html.replace(new RegExp("{{gonder}}", "g"), json.desing.gonder[json.lang]);
html = html.replace(new RegExp("{{teklifal}}", "g"), json.desing.teklifal[json.lang]);


function resolveCategoryListKey(parentRow) {
  if (!parentRow) {
    return null;
  }
  if (
    parentRow.path &&
    webmakerdata[parentRow.path] &&
    webmakerdata[parentRow.path].data &&
    webmakerdata[parentRow.path].data.length
  ) {
    return parentRow.path;
  }
  if (
    parentRow.id &&
    webmakerdata[parentRow.id] &&
    webmakerdata[parentRow.id].data &&
    webmakerdata[parentRow.id].data.length
  ) {
    return parentRow.id;
  }
  return null;
}


function pagecategory(parentId, parentRow) {
  var parts = [];
  var labelLang = json.lang;
  if (pagesettingjson) {
    var mainData = webmakerdata[pagesettingjson.path];
    if (mainData && mainData.data) {
      for (var i = 0; i < mainData.data.length; i++) {
        var pg = mainData.data[i];
        if (
          pg.status == "play" &&
          parentId != undefined &&
          parentId != "" &&
          pg.category === parentId
        ) {
          var slug1 =
            pg.pathnext != null && String(pg.pathnext).trim() !== ""
              ? pg.pathnext
              : pg.path;
          var nm1 =
            pg.name && pg.name[labelLang] != null ? pg.name[labelLang] : "";
          parts.push(
            '<a href="' +
              wxLangInternalHref(slug1) +
              '" role="menuitem">' +
              nm1 +
              "</a>",
          );
        }
      }
    }
  }
  var catKey = resolveCategoryListKey(parentRow);
  if (catKey) {
    var arr = webmakerdata[catKey].data;
    for (var j = 0; j < arr.length; j++) {
      var sub = arr[j];
      if (sub.status == "play") {
        var slug2 =
          sub.pathnext != null && String(sub.pathnext).trim() !== ""
            ? sub.pathnext
            : sub.path;
        var nm2 =
          sub.name && sub.name[labelLang] != null ? sub.name[labelLang] : "";
        parts.push(
          '<a href="' +
            wxLangInternalHref(slug2) +
            '" role="menuitem">' +
            nm2 +
            "</a>",
        );
      }
    }
  }

  if (parts.length === 0) {
    return "";
  }
  return (
    '<div class="dropdown-content-modulex" role="menu">' + parts.join("") + "</div>"
  );
}
