WebCrawler = {
  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0",
  URL: "",
  initData() {
    this.getDefaultName();
  },
  getDefaultName() {
    var nodeList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//p[@class="detail_app_title"]/text()'
    );
    var defaultName = nodeList[0];
    Log.d(this.URL, "defaultName", defaultName);
    return defaultName;
  },
  getReleaseNum() {
    return 1;
  },
  getVersionNumber(releaseNum) {
    var nodeList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//span[@class="list_app_info"]/text()'
    );
    var versionNumber = nodeList[releaseNum];
    Log.d(this.URL, "versionNumber", versionNumber);
    return versionNumber;
  },
  getReleaseDownload(releaseNum) {
    var nodeList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//script[@type="text/javascript"][1]/text()'
    );
    var releaseDownloadText = nodeList[0];
    var releaseDownloadRegList = releaseDownloadText.match('"(.*?)"');
    if (releaseDownloadRegList.length == 0) return "";
    var releaseDownload = releaseDownloadRegList[0];
    releaseDownload = releaseDownload.substr(1, releaseDownload.length - 2);
    var releaseNumber = this.getVersionNumber(releaseNum);
    if (releaseNumber == null && releaseDownload == null) return "";
    Log.d(this.URL, "releaseNumber", releaseNumber);
    Log.d(this.URL, "releaseDownload", releaseDownload);
    var releaseDownloadJsonObject =
      "{" + '"' + releaseNumber + '"' + ":" + '"' + releaseDownload + '"' + "}";
    return releaseDownloadJsonObject;
  }
};
