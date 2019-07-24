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
      '//p[@class="article-headline-p"]/text()'
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
      '//div[@id="post-content"]/p[3]/strong[1]/text()'
    );
    var versionNumber = versionNumberList[releaseNum];
    Log.d(this.URL, "versionNumber", versionNumber);
    return versionNumber;
  },
  getReleaseDownload(releaseNum) {
    var releaseDownloadLiList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//div[@id="post-content"]/ul/li'
    );
    var releaseDownload = {};
    for (var i = 0; i < releaseDownloadLiList.length; i++) {
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
      releaseDownload[releaseDownloadNameList[0]] = releaseDownloadUrlList[0];
    }
    var releaseDownloadString = JSON.stringify(releaseDownload);
    return releaseDownloadString;
  }
};
