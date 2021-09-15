from sys import argv
from make_appconfig import mk_config


def convert_issues_body(body_text):
    for json_name, json_text in mk_config(body_text).items():
        with open(f'./rules/apps/{json_name}.json', 'w+') as f:
            f.write(json_text)


convert_issues_body(argv[0])
