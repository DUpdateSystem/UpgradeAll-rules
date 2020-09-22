#! /usr/bin/python3
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
    uuid_list = [config["uuid"] for config in config_list]
    for config_name in init_list:
        config = get_config(config_name, sort)
        if config:
            uuid = config["uuid"]
            if uuid in uuid_list:
                print(f"sort: {sort}, name: {config_name}")
                raise KeyError
            uuid_list.append(uuid)
            config_list.append(config)
    return config_list


def complete_config_list(sort: str, init_list: list,
                         config_list: list) -> list:
    uuid_list = [config["uuid"] for config in config_list]
    for config_row_name in os.listdir(f"./rules/{sort}"):
        config_name = config_row_name[:-5]
        if config_name not in init_list:
            config = get_config(config_name, sort)
            if config:
                uuid = config["uuid"]
                if uuid in uuid_list:
                    print(f"sort: {sort}, name: {config_name}")
                    raise KeyError
                uuid_list.append(uuid)
                config_list.append(config)
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

complete_config_list("apps", app_list, json_data["app_config_list"])
complete_config_list("hubs", hub_list, json_data["hub_config_list"])

with open('./rules/rules.json', 'w') as f:
    f.write(json.dumps(json_data, indent=2, ensure_ascii=False))

print("Done")
