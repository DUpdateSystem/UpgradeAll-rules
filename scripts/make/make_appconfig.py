import json
import re
from uuid import uuid4
from collections import OrderedDict
from config_getter import get_config_map

test_input_text = """
软件名称(App Name): PixEz-flutter

软件包名(App Package): com.perol.pixez

软件地址(App URL): https://github.com/Notsfsssf/pixez-flutter
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


app_name_title = "App Name"
app_pkg_title = "App Package"
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
    print("no value:", value)
    raise KeyError


def pop_arg_by_tag(tag: str, body_line_list: list[str]) -> str:
    try:
        index = get_contain_index(body_line_list, tag) + 1
        return body_line_list.pop(index)
    except KeyError:
        return None


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
        except Exception:
            if body_line_list:
                print("left data:", body_line_list)
            break

    print(f"finish: {', '.join(config_info_map.keys())}")
    return config_info_map


hub_regex_map = get_hub_url_regex_map()


def mk_simgle_config(info_map: dict) -> tuple[str, str]:
    name = info_map[app_name_title]
    package = info_map[app_pkg_title]
    url = info_map[app_url_title]
    if name and package and url:
        j["info"]["app_name"] = name
        j["info"]["url"] = url
        j["app_config"]["target_checker"]["extra_string"] = package
        j["uuid"] = str(uuid4())
        hub_uuid = get_hub_uuid(url, hub_regex_map)
        j["app_config"]["hub_info"]["hub_uuid"] = hub_uuid
        return name.replace(' ', ''), json.dumps(j,
                                                 indent=2,
                                                 ensure_ascii=False)
