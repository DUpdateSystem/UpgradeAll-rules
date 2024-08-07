from json import loads, dumps


def test_app():
    s = """
    {
  "base_version": 1,
  "uuid": "c31de18d-b56e-41b9-b43b-a1c6d69ec6a0",
  "info": {
    "app_name": "1Password",
    "config_version": 1,
    "url": "https://play.google.com/store/apps/details?id=com.agilebits.onepassword"
  },
  "app_config": {
    "hub_info": {
      "hub_uuid": "65c2f60c-7d08-48b8-b4ba-ac6ee924f6fa"
    },
    "target_checker": {
      "api": "App_Package",
      "extra_string": "com.agilebits.onepassword"
    }
  }
}
    """
    print(migration_1_2_app(s))


def test_hub():
    s = """
    {
  "base_version": 5,
  "uuid": "6a6d590b-1809-41bf-8ce3-7e3f6c8da945",
  "info": {
    "hub_name": "F-droid",
    "config_version": 2
  },
  "api_keywords": ["android_app_package"],
  "app_url_templates": [
    "https://f-droid.org/%language/packages/%android_app_package/",
    "https://f-droid.org/packages/%android_app_package/"
  ]
}
    """
    print(migration_5_6_hub(s))


def migration_1_2_app(s: str) -> str or None:
    old_json = loads(s)
    if old_json["base_version"] != 1:
        raise KeyError
    target = old_json["app_config"]["target_checker"]
    extra_map = {__api_constant(target["api"]): target["extra_string"]}
    new_json = {
        "base_version": 2,
        "config_version": old_json["info"]["config_version"],
        "uuid": old_json["uuid"],
        "base_hub_uuid": old_json["app_config"]["hub_info"]["hub_uuid"],
        "info": {
            "name": old_json["info"]["app_name"],
            "url": old_json["info"]["url"],
            "extra_map": extra_map,
        },
    }
    return dumps(new_json, indent=2, ensure_ascii=False)


def __api_constant(_s: str) -> str or None:
    s = _s.lower()
    if s == "app_package":
        return "android_app_package"
    elif s == "magisk_module":
        return "android_magisk_module"
    elif s == "shell":
        return "android_custom_shell"
    elif s == "shell_root":
        return "android_custom_shell_root"
    else:
        return s


def migration_5_6_hub(s: str) -> str or None:
    old_json = loads(s)
    if old_json["base_version"] != 5:
        raise KeyError
    new_json = {
        "base_version": 6,
        "config_version": old_json["info"]["config_version"],
        "uuid": old_json["uuid"],
        "info": {
            "hub_name": old_json["info"]["hub_name"],
            "hub_icon_url": ""
        },
        "target_check_api": "",
        "api_keywords": old_json["api_keywords"],
        "app_url_templates": old_json["app_url_templates"],
    }
    return dumps(new_json, indent=2, ensure_ascii=False)
