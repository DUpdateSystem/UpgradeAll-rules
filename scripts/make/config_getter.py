from pathlib import Path
import json
from collections import OrderedDict


def get_config_map(sort: str) -> dict[str, any]:
    uuid_list = []
    config_map = {}
    for config_file in Path(f"./rules/{sort}").glob('*.json'):
        config_name = config_file.name
        config = get_config(config_name, sort)
        if config:
            uuid = config["uuid"]
            if uuid in uuid_list:
                print(f"sort: {sort}, name: {config_name}")
                raise KeyError
            uuid_list.append(uuid)
            config_map[config_name[:-5]] = config
    return config_map


def get_config(file_name: str, sort: str) -> OrderedDict:
    with open(f'./rules/{sort}/{file_name}', 'r', encoding='utf-8') as f:
        text = f.read()
        return json.loads(text, object_pairs_hook=OrderedDict)
