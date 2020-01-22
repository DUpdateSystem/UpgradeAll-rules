# -*- coding:utf-8 -*-
import uuid
import json
import os

myuuid = uuid.uuid1()
packagename = input("包名: ")
url = input("源地址: ")
hub = {
    #GitHub
    1: "fd9b2602-62c5-4d55-bd1e-0d6537714ca0",
    #酷安
    2: "1c010cc9-cff8-4461-8993-a86cd190d377",
    #应用汇
    3: "4a23c3a5-8200-40bb-b961-c1bb5d7fd921"
}
print(
    "\033[1;35;40m",
    "*" * 55,
    "请选择来源".center(45),
    "\n",
    "*" * 55,
    "\033[1;34;40m",
    "\n",
    "序号\t来源",
    "\033[1;36;40m",
    "\n",
    "1\tGitHub",
    "\n",
    "2\t酷安",
    "\n",
    "3\t应用汇",
    "\033[1;33;40m",
)
index = input("序号：")
indexToint = int(index.replace(" ", ""))
hub_uuid = hub.get(indexToint)
name = input("App名称: ")

myconfig = {}
data = json.loads(json.dumps(myconfig))
data['base_version'] = 1
data['uuid'] = str(myuuid)
info = {'app_name': name, 'config_version': 1, 'url': url}
data['info'] = info
hub_info = {'hub_uuid': hub_uuid}
app_config = {'hub_info': hub_info}
data['app_config'] = app_config
target_checker = {'api': 'App_Package', 'extra_string': packagename}
data['target_checker'] = target_checker
config = json.dumps(data, ensure_ascii=False, indent=2)
path = os.path.abspath(os.path.dirname(os.getcwd()))
listpath = path + '/rules/rules_list.json'
apppath = path + '/rules/apps/%s.json' % (name)
#print(listpath)
#print(apppath)
open(apppath, 'a').writelines(config)
with open(listpath, 'r') as js:
    list = json.load(js)
    mylist = {}
    mylists = json.loads(json.dumps(mylist))
    mylists['app_config_name'] = name
    mylists['app_config_uuid'] = str(myuuid)
    mylists['app_config_file_name'] = name
    list['app_list'].append(mylists)
with open(listpath, 'w') as f:
    json.dump(list, f, indent=2, ensure_ascii=False)
