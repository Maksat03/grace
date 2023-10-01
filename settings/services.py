import json


def get_tg_ids():
    with open("../settings/tg_ids.txt") as file:
        return file.readlines()


def update_tg_ids(data):
    with open("../settings/tg_ids.txt", "w") as file:
        file.write("\n".join([tg_id.strip() for tg_id in data]))


def get_information_on_site():
    with open("../settings/information_on_site.json") as file:
        return json.loads(file.read())


def update_information_on_site(data):
    with open("../settings/information_on_site.json", "w") as file:
        file.write(json.dumps(data))
