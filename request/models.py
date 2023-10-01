from threading import Thread

import requests
from django.db import models
from rest_framework import serializers

from base_object_presenter.models import BaseModelPresenter
from project.settings import BOT_TOKEN, DOMAIN
from project.utils import datetime_now
from store.models import Product


class Request(models.Model):
    category = models.CharField(max_length=255, choices=(("services", "Услуги"), ("store", "Магазин")), default="services")
    fullname = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    created_at = models.DateTimeField(default=datetime_now, editable=False)
    answered_at = models.DateTimeField(null=True, blank=True)
    is_accepted = models.BooleanField(default=False)
    comment = models.TextField(null=True, blank=True)
    data = models.JSONField(null=True, blank=True)


class RequestModelPresenter(BaseModelPresenter):
    model = Request

    @staticmethod
    def get_object_add_form_serializer_fields():
        return ["category", "fullname", "phone_number", "data"]

    @staticmethod
    def get_object_add_form_serializer_extra_fields():
        return {
            "count": serializers.IntegerField(required=False),
            "product_id": serializers.IntegerField(required=False),
            "service_name": serializers.CharField(max_length=255, required=False),
        }

    @staticmethod
    def get_updatable_fields():
        return ["is_accepted", "comment"]

    @staticmethod
    def send_tg_messages(notification_text):
        tg_ids = []

        with open("../settings/tg_ids.txt") as file:
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
        category = validated_data.pop("category")
        fullname = validated_data.pop("fullname")
        phone_number = validated_data.pop("phone_number")

        if category == "store":
            product = Product.objects.filter(id=validated_data.get('product_id')).only("id", "name", "price").first()

        data = {}
        for key, value in validated_data.items():
            data[key] = value
            if key == "count":
                data["sum"] = data[key] * product.price
                data["product_name"] = product.name

        request = self.model.objects.create(category=category, fullname=fullname, phone_number=phone_number, data=data)

        notification_text = (
            f"<b>ФИО:</b> {request.fullname}\n",
            f"<b>Номер телефона:</b> {request.phone_number}\n"
            f"<b>Время:</b> {request.created_at}\n"
        )

        if category == "services":
            notification_text = (f"<b>Номер заявки №{request.id}\n</b>", *notification_text,
                                 f"<b>Услуга:</b> {request.data.get('service_name', 'не выбрано')}")

            request.data = {'text': request.data.get('service_name', 'не выбрано')}
        else:
            notification_text = (f"<b>Номер заказа №{request.id}\n</b>", *notification_text,
                                 f"<b>Заказ:</b> {request.data['count']} шт <a href='http://{DOMAIN}/product/{product.id}/'>{product.name}</a>\n"
                                 f"<b>Итого:</b> {request.data['count'] * product.price} тг")
            request.data = {'text': f"{request.data['count']} шт <a href='http://{DOMAIN}/product/{product.id}/'>{product.name}</a>\n"
                                    f"<b>Итого:</b> {request.data['count'] * product.price} тг"}

        request.save(update_fields=['data'])
        notification_text = "\n".join(notification_text)
        Thread(daemon=True, target=self.send_tg_messages, args=(notification_text,)).start()

        return request
