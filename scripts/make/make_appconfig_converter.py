from sys import argv
from make_appconfig import mk_config


def convert_issues_body(body_text):
    for json_name, json_text in mk_config(body_text).items():
        with open(f'./rules/apps/{json_name}.json', 'w+') as f:
            f.write(json_text)


try:
    input_text = argv[1]
except IndexError:
    print("issue body: ")
    input_text = ""
    while True:
        try:
            input_text += (input() + '\n')
        except EOFError:
            break
        except KeyboardInterrupt:
            break

convert_issues_body(input_text)
