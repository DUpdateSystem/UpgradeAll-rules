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
        re.sub(api_keywords_regex, r'.+', url_template).rstrip('/')
        for url_template in hub_config['app_url_templates']
    ]
    return url_regex_list


def get_hub_uuid(url, hub_regex_map) -> str or None:
    for uuid, hub_regex in hub_regex_map.items():
        if re.search(hub_regex, url):
            return uuid


def mk_config(input_text: str) -> tuple[str, str]:
    hub_regex_map = get_hub_url_regex_map()
    app_text_list = input_text.split("***")
    for app_text in app_text_list:
        name = None
        package = None
        url = None
        for t in app_text.splitlines():
            if "App Name" in t:
                name = t[16:]
            if "App Package" in t:
                package = t[19:]
            if "App URL" in t:
                url = t[15:]
        if name and package and url:
            j["info"]["app_name"] = name
            j["info"]["url"] = url
            j["app_config"]["target_checker"]["extra_string"] = package
            j["uuid"] = str(uuid4())
            hub_uuid = get_hub_uuid(url, hub_regex_map)
            j["app_config"]["hub_info"]["hub_uuid"] = hub_uuid
            return name.replace(' ', ''), \
                json.dumps(j, indent=2, ensure_ascii=False)
