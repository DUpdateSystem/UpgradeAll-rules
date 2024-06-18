#!/bin/python

import os
from migration_1_2 import migration_1_2_app, migration_5_6_hub

root_path = "../rules/"


def refresh_file(sort: str):
    dir_path = f"{root_path}{sort}"
    for config_name in os.listdir(dir_path):
        do_migration(sort, f"{dir_path}/{config_name}")


def do_migration(sort: str, path: str):
    try:
        with open(path, "r+") as f:
            s = f.read()
            if sort == "apps":
                j = migration_1_2_app(s)
            else:
                j = migration_5_6_hub(s)
        with open(path, "w+") as f:
            f.write(j)
    except KeyError:
        print(f"Base version not match: {path}")
    except IsADirectoryError:
        print(f"Is a dir: {path}")


refresh_file("apps")
refresh_file("hubs")
