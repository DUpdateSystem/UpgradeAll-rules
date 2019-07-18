WebCrawler = {
  setUrl(url) {
    this.URL = url;
  },
  flashData() {
    webCrawler.selNByJsoupXpath(
      this.URL,
      '//p[@class="detail_app_title"]/text()'
    );
  },
  getDefaultName() {
    var nodeList = webCrawler.selNByJsoupXpath(
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
    var nodeList = webCrawler.selNByJsoupXpath(
      this.URL,
      '//span[@class="list_app_info"]/text()'
    );
    var versionNumber = nodeList[0];
    Log.d(this.URL, "versionNumber", versionNumber);
    return versionNumber;
  },
  getReleaseDownload(releaseNum) {
    var nodeList = webCrawler.selNByJsoupXpath(
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
