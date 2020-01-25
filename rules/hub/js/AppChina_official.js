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
  /*
   * 获取版本号
   * 得到第一个版本号
   * 数据格式:"版本 : 1.1.1"
   * 不管数据的多少大小,都是输出为一个数组
   */
  var versionNumberList = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    "//div[@class='intro app-other-info-intro']/p[4]/text()"
  );

  /*
   * 获取下载链接
   * 获取对应"第一个版本"的链接
   * 链接比较特殊,需要使用正则去除数据中的链接
   * 取出输出的数组中的数据使用get函数
   * 此输出的数据:
   *
   *
   */
  var first_raw_url = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    "//a[@class='download_app']/@onclick"
  ).get(0);
  //定义正则表达式
  var reg = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  //使用JavaScript的match函数配合正则表达式取出字符串中的下载链接
  var first_url = first_raw_url.match(reg);

  //获取软件名称,将它赋值
  var app_name = getDefaultName();

  //获取更新日志
  //第一个
  var changelog1 = JSUtils.selNByJsoupXpath(
    userAgent,
    URL,
    "//p[@class='art-content'][2]/text()"
  );

  //将所有数据转化成json,并返回
  return jsonstring(app_name, versionNumberList, first_raw_url, changelog1);
}

function jsonstring(App_name, version_array, url_array, change) {
  var datas = [];
  for (var i = 0; i < version_array.size(); i++) {
    var data = {};
    var assets = [];
    var asset = {};
    asset["name"] = "[" + App_name + "]" + version_array.get(i);
    asset["download_url"] = "" + String(url_array);
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
    userAgent,
    URL,
    "//body/div/div[3]/div[1]/div[1]/div/h1/text()"
  );
  var defaultName = nodeList.get(0);
  Log.d(defaultName);
  return defaultName;
}
