/*
 * 提交须知:
 * 1.提交前先本地调试脚本运行状态
 * 2.提交前查看脚本的调试标记
 * (将Log.v,等调试函数注释)
 * 3.每个脚本增加注释
 * (提高脚本可读性,维护性)
 *
 */

function getReleaseInfo() {
  //将应用名称赋值
  //var App_name = getDefaultName();
  var releaseNum = getReleaseNum();
  var returnJson = getContext();
  //Log.v(returnJson[0].assets[0].browser_download_url);
  //returnJson[i].assets.browser_download_url
  var datas = [];
  for (var i = 0; i < releaseNum; i++) {
    //获取应用版本号
    var versionNumber = "";
    var versionNumber = "" + returnJson[i].name;
    if (
      versionNumber.search(
        "(\\d+(\\.\\d+)*)(([\\.|\\-|\\+|_| ]|[0-9A-Za-z])*)"
      ) == -1
    ) {
      var versionNumber = returnJson[i].tag_name;
    }
    var assets = [];
    for (var ii = 0; ii < returnJson[i].assets.length; ii++) {
      var file_name = returnJson[i].assets[ii].name;

      if (file_name.indexOf(".apk") != -1) {
        if (file_name.indexOf("tv") == -1) {
          if (file_name.indexOf("arm64") != -1) {
            var arch = "apk/arm64-v8a";
          } else if (file_name.indexOf("armeabi") != -1) {
            var arch = "apk/armeabi-v7a";
          } else if (file_name.indexOf("x86_64") != -1) {
            var arch = "apk/x86_64";
          } else if (file_name.indexOf("x86") != -1) {
            var arch = "apk/x86";
          } else {
            var arch = "apk/universal";
          }
        } else {
          if (file_name.indexOf("arm64") != -1) {
            var arch = "apk/tv-arm64-v8a";
          } else if (file_name.indexOf("armeabi") != -1) {
            var arch = "apk/tv-armeabi-v7a";
          } else if (file_name.indexOf("x86_64") != -1) {
            var arch = "apk/tv-x86_64";
          } else if (file_name.indexOf("x86") != -1) {
            var arch = "apk/tv-x86";
          } else {
            var arch = "apk/tv-universal";
          }
        }
      } else {
        var arch = "magisk_module_zip";
      }

      var asset = {};
      asset["name"] = "" + file_name;
      asset["download_url"] =
        "" + returnJson[i].assets[ii].browser_download_url;
      asset["file_type"] = "" + arch;
      assets.push(asset);
    }
    var data = {};
    data["version_number"] = "" + versionNumber;
    data["change_log"] = "" + returnJson[i].body;
    data["assets"] = assets;
    datas.push(data);
  }
  return JSON.stringify(datas);
}

//获取应用名称
//通过splitUrl(URL)分割
function getDefaultName() {
  var tmpList = splitUrl(URL);
  if (tmpList == null) return null;
  return tmpList[1];
}

function getContext() {
  var apiUrl = getApiUrl(URL);
  var jsonText = JSUtils.getHttpResponse(apiUrl);
  //Log.v(JSON.parse(jsonText)[0]);
  return JSON.parse(jsonText);
}

function getReleaseNum() {
  var returnJson = getContext();
  //Log.v(returnJson.length);
  return returnJson.length;
}

function getApiUrl(url) {
  //获取api地址的独立方法
  var apiUrlStringList = splitUrl(url);
  if (apiUrlStringList == null) return null;
  // 网址不符合规则返回 false
  else return apiUrlStringList[0];
}

function splitUrl(url) {
  var temp = url.split("github.com/");
  temp = temp[temp.length - 1].split("/");
  if (temp.length >= 2) {
    var owner = temp[0];
    var repo = temp[1].split(".git")[0];
    // 分割网址
    var apiUrl =
      "https://api.github.com/repos/" + owner + "/" + repo + "/releases";
    Log.d(apiUrl);
    return [apiUrl, repo];
  } else return null;
}
