
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
