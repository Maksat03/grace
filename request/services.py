import requests
from threading import Thread
from typing import MutableMapping

from base_object_presenter.services import BaseServicesPresenter
from project.settings import BOT_TOKEN
from request.models import RequestModelPresenter


class RequestServicesPresenter(BaseServicesPresenter):
    model_presenter = RequestModelPresenter()

    def __init__(self):
        super().__init__()

    def send_tg_messages(self, notification_text):
        tg_ids = []

        with open("telegram bot/tg_ids.txt") as file:
            for line in file:
                tg_ids.append(line.strip())

        for tg_id in tg_ids:
            requests.post(
                f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
                data={
                    'chat_id': tg_id,
                    'text': notification_text,
                    'parse_mode': 'html'
                }
            )

    def add(self, add_request_schema: MutableMapping) -> int:
        serializer = self.serializers["object_add_form"](data=add_request_schema)
        serializer.is_valid(raise_exception=True)
        request = serializer.save()

        notification_text = (
            f"<b>ФИО:</b> {request.fullname}\n",
            f"<b>Номер телефона:</b> {request.phone_number}\n"
            f"<b>Время:</b> {request.created_at}\n"
        )

        if not request.data:
            notification_text = (f"<b>Номер заявки №{request.id}\n</b>", *notification_text)
        else:
            notification_text = (f"<b>Номер заказа №{request.id}\n</b>", *notification_text, f"<b>Заказ:</b> {request.data['count']} шт {request.data['product']}")

        notification_text = "\n".join(notification_text)

        Thread(daemon=True, target=self.send_tg_messages, args=(notification_text,)).start()

        return request.id
