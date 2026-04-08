

if (typeof json === 'undefined') {
  var json = {};
}
var lang = (json.lang === 'tr' || json.lang === 'en') ? json.lang : 'tr';
var d = json.desing || {};

function getDesing(key) {
  return (d[key] && d[key][lang]) ? d[key][lang] : (d[key] && d[key].tr) ? d[key].tr : '';
}

html = html.replace(/\{\{lang\}\}/g, lang);
html = html.replace(/\{\{heroTitle\}\}/g, getDesing('heroTitle'));
html = html.replace(/\{\{heroSubtitle\}\}/g, getDesing('heroSubtitle'));
html = html.replace(/\{\{searchTitle\}\}/g, getDesing('searchTitle'));
html = html.replace(/\{\{searchSubtitle\}\}/g, getDesing('searchSubtitle'));
html = html.replace(/\{\{inputPlaceholder\}\}/g, getDesing('inputPlaceholder'));
html = html.replace(/\{\{btnSearch\}\}/g, getDesing('btnSearch'));
html = html.replace(/\{\{statusDefault\}\}/g, getDesing('statusDefault'));
html = html.replace(/\{\{statusDesc\}\}/g, getDesing('statusDesc'));
html = html.replace(/\{\{fabRefresh\}\}/g, getDesing('fabRefresh'));
html = html.replace(/\{\{loadingText\}\}/g, getDesing('loadingText'));
html = html.replace(/\{\{errorNotFound\}\}/g, getDesing('errorNotFound'));
html = html.replace(/\{\{errorNoHistory\}\}/g, getDesing('errorNoHistory'));
html = html.replace(/\{\{trackingStatusFormat\}\}/g, getDesing('trackingStatusFormat'));
html = html.replace(/\{\{formAriaLabel\}\}/g, getDesing('formAriaLabel'));
html = html.replace(/\{\{inputAriaLabel\}\}/g, getDesing('inputAriaLabel'));
html = html.replace(/\{\{searchBtnAriaLabel\}\}/g, getDesing('searchBtnAriaLabel'));
html = html.replace(/\{\{timelineAriaLabel\}\}/g, getDesing('timelineAriaLabel'));
