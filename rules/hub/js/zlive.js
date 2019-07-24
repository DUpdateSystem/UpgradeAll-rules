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
      "//section[1]/h1/text()"
    );
    var defaultName = nodeList[0];
    Log.d(this.URL, "defaultName", defaultName);
    return defaultName;
  },
  getReleaseNum() {
    return 1;
  },
  getVersionNumber(releaseNum) {
    var versionNumberList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      "//section[1]/p/code/text()"
    );
    var versionNumber = versionNumberList[releaseNum];
    Log.d(this.URL, "versionNumber", versionNumber);
    return versionNumber;
  },
  getReleaseDownload(releaseNum) {
    var releaseDownloadNameList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      "//section[1]/a/text()"
    );
    var releaseDownloadUrlList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      "//section[1]/a/@href"
    );
    var releaseDownload = {};
    for (var i = 0; i < releaseDownloadNameList.length; i++) {
      var releaseDownloadUrl = releaseDownloadUrlList[i];
      if (releaseDownloadUrl.charAt(0) == ".") {
        releaseDownloadUrl = "https://app.zhibo.at/" + releaseDownloadUrl;
      }
      Log.d(this.URL, "release", releaseDownloadUrl);
      releaseDownload[releaseDownloadNameList[i]] = releaseDownloadUrl;
    }
    var releaseDownloadString = JSON.stringify(releaseDownload);
    return releaseDownloadString;
  }
};
