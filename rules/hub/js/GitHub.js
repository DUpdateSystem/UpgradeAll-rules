function getDefaultName() {
  var tmpList = splitUrl(URL);
  if (tmpList == null) return null;
  return tmpList[1];
}
function getReleaseNum() {
  var apiUrl = getApiUrl(URL);
  var jsonText = JSUtils.getHttpResponse(apiUrl);
  var returnJson = JSUtils.getJSONArray(jsonText);
  return returnJson.length();
}
function getVersionNumber(releaseNum) {
  var apiUrl = getApiUrl(URL);
  var jsonText = JSUtils.getHttpResponse(apiUrl);
  var returnJson = JSUtils.getJSONArray(jsonText);
  var versionNumber = returnJson.getJSONObject(releaseNum).getString("name");
  if (JSUtils.matchVersioningString(versionNumber) == null)
    versionNumber = returnJson.getJSONObject(releaseNum).getString("tag_name");
  if (JSUtils.matchVersioningString(versionNumber) == null)
    versionNumber = null;
  Log.d(versionNumber);
  return versionNumber;
}
function getChangelog(releaseNum) {
  var apiUrl = getApiUrl(URL);
  var jsonText = JSUtils.getHttpResponse(apiUrl);
  var returnJson = JSUtils.getJSONArray(jsonText);
  var changeLog = returnJson.getJSONObject(releaseNum).getString("body");
  Log.d(changeLog);
  return changeLog;
}
function getReleaseDownload(releaseNum) {
  var apiUrl = getApiUrl(URL);
  var jsonText = JSUtils.getHttpResponse(apiUrl);
  var returnJson = JSUtils.getJSONArray(jsonText);
  var releaseAssets = returnJson
    .getJSONObject(releaseNum)
    .getJSONArray("assets");
  var releaseDownload = JSUtils.getJSONObject();
  for (var i = 0; i < releaseAssets.length(); i++) {
    var tmpJsonObject = releaseAssets.getJSONObject(i);
    releaseDownload.put(
      tmpJsonObject.getString("name"),
      tmpJsonObject.getString("browser_download_url")
    );
  }
  return releaseDownload.toString();
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
    var repo = temp[1];
    // 分割网址
    var apiUrl =
      "https://api.github.com/repos/" + owner + "/" + repo + "/releases";
    Log.d(apiUrl);
    return [apiUrl, repo];
  } else return null;
}
