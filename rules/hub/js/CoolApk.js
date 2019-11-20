var userAgent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0";
function getDefaultName() {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//p[@class="detail_app_title"]/text()'
  );
  var defaultName = nodeList.get(0);
  Log.d(defaultName);
  return defaultName;
}
function getReleaseNum() {
  return 1;
}
function getVersionNumber(releaseNum) {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//span[@class="list_app_info"]/text()'
  );
  var versionNumber = nodeList.get(releaseNum);
  Log.d(versionNumber);
  return versionNumber;
}
function getReleaseDownload(releaseNum) {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//script[@type="text/javascript"][1]/text()'
  );
  var releaseDownloadText = nodeList.get(0);
  var releaseDownloadRegList = releaseDownloadText.match('"(.*?)"');
  if (releaseDownloadRegList.length == 0) return "";
  var releaseDownload = releaseDownloadRegList[0];
  releaseDownload = releaseDownload.substr(1, releaseDownload.length - 2);
  var releaseNumber = this.getVersionNumber(releaseNum);
  if (releaseNumber == null && releaseDownload == null) return "";
  Log.d(releaseNumber);
  Log.d(releaseDownload);
  var releaseDownloadJsonObject = JSUtils.getJSONObject();
  releaseDownloadJsonObject.put(releaseNumber, releaseDownload);
  return releaseDownloadJsonObject.toString();
}
function downloadReleaseFile(releaseNum, fileIndex) {
  var downloadReleaseFileJson = JSUtils.getJSONObject(
    getReleaseDownload(releaseNum)
  );
  var fileName =
    JSUtils.getJSONObjectKeyByIndex[(downloadReleaseFileJson, fileIndex)];
  var fileUrl = downloadReleaseFileJson.get(fileName);
  return JSUtils.downloadFile(
    this.getDefaultName() + "_" + fileName + ".apk",
    fileUrl
  );
}
