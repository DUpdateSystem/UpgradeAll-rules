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
    '//strong/a/text()'
  );

  //获取更新日志
  var changelog = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    '//span[@class="adown"]/text()'
  );

  //获取下载链接
  var d_url = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    '//span[@class="bdown"]/a/@href'
  );

  return jsonstring(version, d_url, changelog);
}

function jsonstring( version_array, url, change) {
  var datas = [];
  for (var i = 0; i < version_array.size(); i++) {
    var data = {};
    var assets = [];
    var asset = {};
    asset["name"] = "" + "整合包[universal]";
    asset["download_url"] = "" + url.get(i);
    asset["file_type"] = "" + "apk/universal";
    assets.push(asset);
    data["version_number"] = "" + version_array.get(i);
    data["change_log"] = "" + change.get(i);
    data["assets"] = assets;
    datas.push(data);
  }
  return JSON.stringify(datas);
}

function getDefaultName() {
  var nodeList = JSUtils.selNByJsoupXpath(
    this.userAgent,
    this.URL,
    '//@data-appname'
  );
  var defaultName = nodeList.get(0);
  return defaultName;
}
