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
      "//body/div/div[3]/div[1]/div[1]/div/h1/text()"
    );
    var defaultName = nodeList[0];
    Log.d(this.URL, "defaultName", defaultName);
    return defaultName;
  },
  getReleaseNum() {
    var nodeList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      "//body/div/div[3]/div[2]/div[1]/div[2]/div[3]/ul/li"
    );
    if (nodeList != null) return nodeList.length;
  },
  getVersionNumber(releaseNum) {
    var versionNumberList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      "//span[@class='history-verison-app-versionName']/text()"
    );
    var versionNumber = versionNumberList[releaseNum];
    Log.d(this.URL, "versionNumber", versionNumber);
    return versionNumber;
  },
  getReleaseDownload(releaseNum) {
    var releaseDownloadList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      "//a[@class='historyVerison-download fright download_app']/@href"
    );
    var releaseDownloadUrl = releaseDownloadList[releaseNum];
    var releaseDownloadName = this.getVersionNumber(releaseNum);
    var releaseDownload = { [releaseDownloadName]: releaseDownloadUrl };
    var releaseDownloadString = JSON.stringify(releaseDownload);
    return releaseDownloadString;
  }
};
