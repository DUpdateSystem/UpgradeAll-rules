WebCrawler = {
        userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0",
        setUrl(url) {
                this.URL = url;
        },
        flashData() {
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
                if (nodeList != null)
                        return nodeList.length;
        },
        getVersionNumber(releaseNum) {
                var versionNumber = JSUtils.selNByJsoupXpath(
                        this.userAgent,
                        this.URL,
                        "//body/div/div[3]/div[2]/div[1]/div[2]/div[3]/ul/li" + "[" + releaseNum + "]" + "/div[1]/span[2]/text()",
                );
                Log.d(this.URL, "versionNumber", versionNumber);
                return versionNumber;
        },
        getReleaseDownload(releaseNum) {
                var nodeList = JSUtils.selNByJsoupXpath(
                        this.userAgent,
                        this.URL,
                        "//body/div/div[3]/div[2]/div[1]/div[2]/div[3]/ul/li" + "[" + releaseNum + "]" + "/a/@href");
                return nodeList;
        }
};
