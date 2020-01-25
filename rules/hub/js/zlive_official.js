var userAgent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0";
  
 function getReleaseInfo() {
	 app_name = getDefaultName();
	 version = getVersionNumber();
	 d_url = getReleaseDownload();
	 
	 return jsonstring(app_name,version,d_url,"");
	 }
	 
function jsonstring(App_name, version_array, url, change) {
  var datas = [];
    var data = {};
    var assets = [];
    var asset = {};
    asset["name"] = "[" + App_name + "]" + version_array;
    asset["download_url"] = "" + url;
    assets.push(asset);
    data["version_number"] = "" + version_array;
    data["change_log"] = "" + change;
    data["assets"] = assets;
    datas.push(data);
  return JSON.stringify(datas);
}

	 
	 
function getDefaultName() {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    "//section[1]/h1/text()"
  );
  var defaultName = nodeList.get(0);
  //Log.d(defaultName);
  return defaultName;
}

function getVersionNumber() {
  var versionNumberList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    "//section[1]/p/code/text()"
  );
  var versionNumber = versionNumberList.get(0);
  //Log.d(versionNumber);
  return versionNumber;
}
function getReleaseDownload(releaseNum) {
  var releaseDownloadUrlList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    "//section[1]/a[2]/@href"
  );
  var releaseDownload = "https://app.zhibo.at/" + releaseDownloadUrlList.get(0).substr(1).substr(1);
  return releaseDownload;
}
