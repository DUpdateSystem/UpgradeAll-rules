import json
import re
from collections import OrderedDict
from enum import Enum
from uuid import uuid4

from config_getter import get_config_map

test_input_text = """
### 软件/模块名称(App/Module name)：

链接至 Windows

### 软件包名(Package name)：

com.microsoft.appmanager

### 软件地址(App URL)：

https://play.google.com/store/apps/details?id=com.microsoft.appmanager
"""

temp_text = """
{
  "base_version": 1,
  "uuid": "0bea5a92-4b1d-44c6-b628-7b0eb75dfbd5",
  "info": {
    "app_name": "Meow",
    "config_version": 1,
    "url": "https://github.com/neverfelly/Meow"
  },
  "app_config": {
    "hub_info": {
      "hub_uuid": "fd9b2602-62c5-4d55-bd1e-0d6537714ca0"
    },
    "target_checker": {
      "api": "App_Package",
      "extra_string": "top.rechinx.meow"
    }
  }
}
"""
j = json.loads(temp_text, object_pairs_hook=OrderedDict)


class AppType(Enum):
    ANDROID_APP_TYPE = "android_app_package"
    ANDROID_MAGISK_MODULE_TYPE = "android_magisk_module"
    ANDROID_CUSTOM_SHELL = "android_custom_shell"
    ANDROID_CUSTOM_SHELL_ROOT = "android_custom_shell_root"


class AppIssueType(Enum):
    ANDROID_APP_TYPE = "[android]"
    ANDROID_MAGISK_MODULE_TYPE = "[magisk]"


def get_hub_url_regex_map() -> dict[str, str]:
    hub_config_map = get_config_map("hubs")
    hub_regex_map = {}
    for hub_config in hub_config_map.values():
        try:
            hub_regex_list = get_hub_url_regex(hub_config)
            if hub_regex_list:
                uuid = hub_config['uuid']
                hub_regex_map[uuid] = f'({")|(".join(hub_regex_list)})'
        except KeyError:
            # print("fail get hub url: ", hub_config)
            pass
    return hub_regex_map


def get_hub_url_regex(hub_config: dict) -> list[str]:
    api_keywords_regex = r"|".join(
        [f"%{keyword}" for keyword in hub_config['api_keywords']])
    url_regex_list = [
        re.sub(api_keywords_regex, r'.+', re.escape(url_template)).rstrip('/')
        for url_template in hub_config['app_url_templates']
    ]
    return url_regex_list


def get_hub_uuid(url, hub_regex_map) -> str or None:
    for uuid, hub_regex in hub_regex_map.items():
        if re.search(hub_regex, url):
            return uuid


app_name_title = "App/Module name"
app_pkg_title = "Package name"
app_url_title = "App URL"

body_line_list = []


def get_arg_tag(line: str) -> str:
    if app_name_title in line:
        return app_name_title
    elif app_pkg_title in line:
        return app_pkg_title
    elif app_url_title in line:
        return app_url_title


def del_surplus_start(first_tag: str, body_line_list: list[str]) -> list[str]:
    """ 移除首个 TAG 之前的多余字符 """
    index = get_contain_index(body_line_list, first_tag)
    return body_line_list[index:]


def del_surplus_tags(tag_list: list[str],
                     body_line_list: list[str]) -> list[str]:
    """ 检查 TAG 之间的字符
    若完全相同，移除至最后一个 TAG
    若有一项为空，同上
    """
    mezzanine_list = [
        str(body_line_list[get_contain_index(body_line_list, tag_list[i]):
                           get_contain_index(body_line_list, tag_list[i + 1]) -
                           1]) for i in range(len(tag_list) - 1)
    ]

    if len(set(mezzanine_list)) == 1:
        return body_line_list[get_contain_index(body_line_list, tag_list[-1]) +
                              1:]

    return body_line_list


def get_contain_index(str_list, value) -> int:
    for i in range(len(str_list)):
        if value in str_list[i]:
            return i
    # 未检索到
    if str_list:
        print("no value:", value)
    raise KeyError


def pop_arg_by_tag(tag: str, body_line_list: list[str]) -> str:
    try:
        index = get_contain_index(body_line_list, tag) + 1
        return body_line_list.pop(index)
    except KeyError:
        return None


hub_regex_map = get_hub_url_regex_map()


def split_type_and_name(s: str) -> tuple[str, AppType]:
    name = s
    app_type = AppType.ANDROID_APP_TYPE
    if s.lower().startswith(AppIssueType.ANDROID_APP_TYPE.value):
        app_type = AppType.ANDROID_APP_TYPE
        name = s[len(AppIssueType.ANDROID_APP_TYPE.value)]
    elif s.lower().startswith(AppIssueType.ANDROID_MAGISK_MODULE_TYPE.value):
        app_type = AppType.ANDROID_APP_TYPE
        name = s[len(AppIssueType.ANDROID_MAGISK_MODULE_TYPE.value)]
    return name, app_type


def mk_simgle_config(info_map: dict) -> tuple[str, str]:
    raw_name = info_map[app_name_title]
    package = info_map[app_pkg_title]
    url = info_map[app_url_title]
    name, app_type = split_type_and_name(raw_name)
    if name and package and url:
        j["info"]["app_name"] = name
        j["info"]["url"] = url
        j["app_config"]["target_checker"] = {
            "api": app_type.value,
            "extra_string": package
        }
        j["uuid"] = str(uuid4())
        hub_uuid = get_hub_uuid(url, hub_regex_map)
        j["app_config"]["hub_info"]["hub_uuid"] = hub_uuid
        return name.replace(' ', ''), json.dumps(j,
                                                 indent=2,
                                                 ensure_ascii=False)


def mk_config(input_text: str) -> dict[str, str]:
    config_info_map = {}
    tag_list = [app_name_title, app_pkg_title, app_url_title]
    body_line_list = [
        i for i in input_text.splitlines() if i and not i.isspace()
    ]
    while body_line_list:
        try:
            body_line_list = del_surplus_tags(tag_list, body_line_list)
            body_line_list = del_surplus_start(tag_list[0], body_line_list)
            arg_map = {
                tag: pop_arg_by_tag(tag, body_line_list)
                for tag in tag_list
            }
            name, value = mk_simgle_config(arg_map)
            print("deal:", name)
            config_info_map[name] = value
            name = None
        except Exception as e:
            print(e)
            if body_line_list:
                print("left data:", body_line_list)
            break

    print(f"finish: {', '.join(config_info_map.keys())}")
    return config_info_map
