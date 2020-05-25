import json
import os
from collections import OrderedDict


def get_config(file_name: str, dir: str) -> OrderedDict or None:
    if not file_name or not dir:
        return None

    with open(f'./rules/{dir}/{file_name}.json', 'r') as f:
        text = f.read()
        return json.loads(text, object_pairs_hook=OrderedDict)


def init_config_list(init_list: list, sort: str, config_list: list) -> list:
    for config_name in init_list:
        app_config = get_config(config_name, sort)
        if app_config:
            config_list.append(app_config)
    return config_list


def complete_config_list(sort: str, config_list: list) -> list:
    for app_config_row_name in os.listdir(f"./rules/{sort}"):
        app_config_name = app_config_row_name[:-5]
        if app_config_name not in app_list:
            config_list.append(get_config(app_config_name, sort))
    return config_list


json_data = {"app_config_list": [], "hub_config_list": []}
app_list = []
hub_list = []
with open('./rules/rules_list.json', 'r') as f:
    text = f.read()
    data = json.loads(text)
    app_list = data["app_list"]
    hub_list = data["hub_list"]

init_config_list(app_list, "apps", json_data["app_config_list"])
init_config_list(hub_list, "hubs", json_data["hub_config_list"])

complete_config_list("apps", json_data["app_config_list"])
complete_config_list("hubs", json_data["hub_config_list"])

with open('./rules/rules.json', 'w') as f:
    f.write(json.dumps(json_data, indent=2, ensure_ascii=False))
