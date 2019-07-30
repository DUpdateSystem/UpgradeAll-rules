var userAgent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0";
function getDefaultName() {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//div[@class="app-detail"]/h1/text()'
  );
  var defaultName = nodeList.get(0);
  Log.d(defaultName);
  return defaultName;
}
function getReleaseNum() {
  return 1;
}
function getVersionNumber(releaseNum) {
  var versionNumberList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    "//div[2]/div[2]/div/section/text()"
  );
  var versionNumber = versionNumberList.get(releaseNum);
  var versionNumber = versionNumber.split(" ")[1];
  Log.d(versionNumber);
  return versionNumber;
}
function getReleaseDownload(releaseNum) {
  var releaseDownloadUrlList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//div[@id="wx_btn1"]/a/@href'
  );
  var releaseDownload = JSUtils.getJSONObject();
  releaseDownload.put("apk_file", releaseDownloadUrlList.get(0));
  return releaseDownload.toString();
}
