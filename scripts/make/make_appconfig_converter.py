from make_appconfig import mk_config
import requests

api_url = "https://api.github.com/repos/JohnsonRan/UpgradeAll-rules/issues/1"


def convert_issues(api_url):
    input_text = requests.get(api_url).json()['body']
    print(input_text)
    for json_name, json_text in mk_config(input_text).items():
        with open(f'./rules/apps/{json_name}.json', 'w+') as f:
            f.write(json_text)


convert_issues(api_url)
