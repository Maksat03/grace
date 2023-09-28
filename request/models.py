from threading import Thread

import requests
from django.db import models

from base_object_presenter.models import BaseModelPresenter
from project.settings import BOT_TOKEN
from project.utils import datetime_now


class Request(models.Model):
    fullname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(default=datetime_now, editable=False)
    answered_at = models.DateTimeField(null=True, blank=True)
    is_accepted = models.BooleanField(default=False)
    comment = models.TextField(null=True, blank=True)
    data = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.pk:
            self.answered_at = datetime_now()

        super().save(*args, **kwargs)


class RequestModelPresenter(BaseModelPresenter):
    model = Request

    @staticmethod
    def get_object_add_form_serializer_fields():
        return ["fullname", "phone_number", "data"]

    @staticmethod
    def get_updatable_fields():
        return ["is_accepted", "comment"]

    @staticmethod
    def send_tg_messages(notification_text):
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

    def object_add_form_serializer_create(self, validated_data):
        request = self.model.objects.create(**validated_data)

        notification_text = (
            f"<b>ФИО:</b> {request.fullname}\n",
            f"<b>Номер телефона:</b> {request.phone_number}\n"
            f"<b>Время:</b> {request.created_at}\n"
        )

        if not request.data:
            notification_text = (f"<b>Номер заявки №{request.id}\n</b>", *notification_text)
        else:
            notification_text = (f"<b>Номер заказа №{request.id}\n</b>", *notification_text,
                                 f"<b>Заказ:</b> {request.data['count']} шт {request.data['product']}")

        notification_text = "\n".join(notification_text)

        Thread(daemon=True, target=self.send_tg_messages, args=(notification_text,)).start()

        return request
