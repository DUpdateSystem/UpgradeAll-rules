/*
 * 提交须知:
 * 1.提交前先本地调试脚本运行状态
 * 2.提交前查看脚本的调试标记
 * (将Log.v,等调试函数注释)
 * 3.每个脚本增加注释
 * (提高脚本可读性,维护性)
 *
 */

var userAgent =
  "Mozilla/5.0 (X11; Linux x86_64; rv:67.0) Gecko/20100101 Firefox/67.0";

function getReleaseInfo() {
  //获取版本号
  var version = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    '//span[@class="list_app_info"]/text()'
  );
  //获取更新日志
  var changelog = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    '//div[@class="apk_left_title"][1]/p[@class="apk_left_title_info"]/text()'
  );

  //获取下载链接
  var d_url = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    '//script[@type="text/javascript"][1]/text()'
  );
  var releaseDownloadText = d_url.get(0);
  var releaseDownloadRegList = releaseDownloadText.match('"(.*?)"');
  //if (releaseDownloadRegList.length == 0) return "";
  var releaseDownload = releaseDownloadRegList[0];
  releaseDownload = releaseDownload.substr(1, releaseDownload.length - 2);
  //Log.d(changelog);
  //Log.d(changelog.get(0));
  return jsonstring(version, releaseDownload, changelog);
}

function jsonstring(version_array, url, change) {
  var datas = [];
  for (var i = 0; i < version_array.size(); i++) {
    var data = {};
    var assets = [];
    var asset = {};
    asset["name"] = "" + "universal";
    asset["download_url"] = "" + url;
    asset["file_type"] = "" + "apk/universal";
    assets.push(asset);
    data["version_number"] = "" + version_array.get(i);
    data["change_log"] = "" + change;
    data["assets"] = assets;
    datas.push(data);
  }
  return JSON.stringify(datas);
}

function getDefaultName() {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//p[@class="detail_app_title"]/text()'
  );
  var defaultName = nodeList.get(0);
  //Log.d(defaultName);
  return defaultName;
}
