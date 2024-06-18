#! /usr/bin/python3
import json
from config_getter import get_config_map


def get_ranked_config(sort: str, rank_list: list[str]):
    config_map = get_config_map(sort)
    rank_config_map = {}
    for name in rank_list:
        try:
            rank_config_map[name] = config_map.pop(name)
        except KeyError:
            print(f"config not fund: {name}")
    return rank_config_map | config_map


app_rank_list = []
hub_rank_list = []
with open('./rules/rules_list.json', 'r', encoding='utf-8') as f:
    text = f.read()
    data = json.loads(text)
    app_rank_list = data["app_list"]
    hub_rank_list = data["hub_list"]

app_list = list(get_ranked_config("apps", app_rank_list).values())
hub_list = list(get_ranked_config("hubs", hub_rank_list).values())
print("App Num:", len(app_list))
print("Hub Num:", len(hub_list))

json_data = {"app_config_list": app_list, "hub_config_list": hub_list}

with open('./rules/rules.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(json_data, separators=(',', ':'), ensure_ascii=False))

print("Done")
