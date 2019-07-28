var userAgent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0";
function getDefaultName() {
  var nodeList = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    "//body/div/div[3]/div[1]/div[1]/div/h1/text()"
  );
  var defaultName = nodeList.get(0);
  Log.d(URL, "defaultName", defaultName);
  return defaultName;
}
function getReleaseNum() {
  var nodeList = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    "//body/div/div[3]/div[2]/div[1]/div[2]/div[3]/ul/li"
  );
  if (nodeList != null) return nodeList.size();
}
function getVersionNumber(releaseNum) {
  var versionNumberList = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    "//span[@class='history-verison-app-versionName']/text()"
  );
  var versionNumber = versionNumberList.get(releaseNum);
  if (releaseNum == null) Log.d(URL, "versionNumber", "NULL");
  Log.d(URL, "versionNumber", versionNumber);
  return versionNumber;
}
function getReleaseDownload(releaseNum) {
  var releaseDownloadName = getVersionNumber(releaseNum);
  var releaseDownloadList = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    "//a[@class='historyVerison-download fright download_app']/@href"
  );
  var releaseDownloadUrl = releaseDownloadList.get(releaseNum);
  var releaseDownload = JSUtils.getJSONObject();
  releaseDownload.put(releaseDownloadName, releaseDownloadUrl);
  return releaseDownload.toString();
}
