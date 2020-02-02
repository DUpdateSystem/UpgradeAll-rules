var userAgent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0";
function getDefaultName() {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//p[@class="article-headline-p"]/text()'
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
    '//div[@id="post-content"]/p[3]/strong[1]/text()'
  );
  var versionNumber = versionNumberList.get(releaseNum);
  Log.d(versionNumber);
  return versionNumber;
}
function getReleaseDownload(releaseNum) {
  var releaseDownloadLiList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//div[@id="post-content"]/ul/li'
  );
        var releaseDownload = JSUtils.getJSONObject();
  for (var i = 0; i < releaseDownloadLiList.size(); i++) {
    var releaseDownloadNameList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//div[@id="post-content"]/ul/li' + "[" + (i + 1) + "]" + "/a/text()"
    );
    var releaseDownloadUrlList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//div[@id="post-content"]/ul/li' + "[" + (i + 1) + "]" + "/a/@href"
    );
    releaseDownload.put(
      releaseDownloadNameList.get(0),
      releaseDownloadUrlList.get(0)
    );
  }
  return releaseDownload.toString();
}
