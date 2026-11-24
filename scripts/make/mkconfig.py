#! /usr/bin/python3
import json
from config_getter import get_config_map


def get_ranked_config(sort: str, rank_list: list[str], previous: list[dict]):
    config_map = get_config_map(sort)
    rank_config_map = {}
    for name in rank_list:
        try:
            rank_config_map[name] = config_map.pop(name)
        except KeyError:
            print(f"config not fund: {name}")
    # Keep the published order for unranked rules; filesystem glob order is not stable.
    positions = {entry["uuid"]: position for position, entry in enumerate(previous)}
    ordered = sorted(config_map.items(), key=lambda item: (positions.get(item[1]["uuid"], len(positions)), item[0]))
    return list(rank_config_map.values()) + [config for _, config in ordered]


app_rank_list = []
hub_rank_list = []
with open('./rules/rules_list.json', 'r', encoding='utf-8') as f:
    text = f.read()
    data = json.loads(text)
    app_rank_list = data["app_list"]
    hub_rank_list = data["hub_list"]

try:
    with open('./rules/rules.json', encoding='utf-8') as f:
        previous_catalog = json.load(f)
except FileNotFoundError:
    previous_catalog = {}

app_list = get_ranked_config("apps", app_rank_list, previous_catalog.get("app_config_list", []))
hub_list = get_ranked_config("hubs", hub_rank_list, previous_catalog.get("hub_config_list", []))


def write_catalog(path: str, version: int):
    hubs = [
        {key: value for key, value in hub.items() if key != "min_catalog_version"}
        for hub in hub_list
        if hub.get("min_catalog_version", 1) <= version
    ]
    hub_ids = {hub["uuid"] for hub in hubs}
    all_hub_ids = {hub["uuid"] for hub in hub_list}
    unavailable_hubs = all_hub_ids - hub_ids
    apps = [app for app in app_list if app.get("base_hub_uuid") not in unavailable_hubs]
    with open(path, 'w', encoding='utf-8') as f:
        json.dump({"app_config_list": apps, "hub_config_list": hubs}, f,
                  separators=(',', ':'), ensure_ascii=False)
    print(f"{path}: {len(apps)} apps, {len(hubs)} hubs")


# Keep the original URL compatible with clients that lack newer providers.
write_catalog('./rules/rules.json', 1)
write_catalog('./rules/rules-v2.json', 2)
