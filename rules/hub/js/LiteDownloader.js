WebCrawler = {
  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0",
  URL: "",
  getDefaultName() {
    var nodeList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//div[@class="app-detail"]/h1/text()'
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
      "//div[2]/div[2]/div/section/text()"
    );
    var versionNumber = versionNumberList[releaseNum];
    Log.d(this.URL, "versionNumber", versionNumber);
    return versionNumber;
  },
  getReleaseDownload(releaseNum) {
    var releaseDownloadUrlList = JSUtils.selNByJsoupXpath(
      this.userAgent,
      this.URL,
      '//div[@id="wx_btn1"]/a/@href'
    );
    var releaseDownload = { apk_file: releaseDownloadUrlList[0] };
    var releaseDownloadString = JSON.stringify(releaseDownload);
    return releaseDownloadString;
  }
};
