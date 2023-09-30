from django.db import models
from rest_framework import serializers

from base_object_presenter.models import BaseModelPresenter


class Product(models.Model):
    name = models.CharField(max_length=255)
    name_lower = models.CharField(max_length=255, default="")
    poster = models.ImageField(upload_to="product_posters/")
    code = models.CharField(max_length=50)
    code_lower = models.CharField(max_length=50, default="")
    price = models.PositiveIntegerField()
    category = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    description = models.TextField()

    def save(self, *args, **kwargs):
        self.name_lower = self.name.lower()
        self.code_lower = self.code.lower()

        super().save(*args, **kwargs)


class StoreModelPresenter(BaseModelPresenter):
    model = Product

    @staticmethod
    def get_many_service():
        return {
            "prefetch_related": [],
            "select_related": [],
            "annotate": {},
            "only": ["id", "name", "poster", "code", "price"],
            "filtration": {}
        }

    @staticmethod
    def get_objects_serializer_fields():
        return ["id", "name", "poster", "code", "price"]

    @staticmethod
    def get_searchable_fields():
        return ["name_lower", "code_lower"]

    @staticmethod
    def get_object_add_form_serializer_fields():
        return ["name", "code", "price", "category", "brand", "description"]

    @staticmethod
    def get_object_add_form_serializer_extra_fields():
        return {
            "poster": serializers.CharField(max_length=1000)
        }

    @staticmethod
    def get_object_edit_form_serializer_fields():
        return ["name", "code", "price", "category", "brand", "description"]

    @staticmethod
    def get_object_edit_form_serializer_extra_fields():
        return {
            "poster": serializers.CharField(max_length=1000)
        }

    def object_edit_form_serializer_update(self, instance, validated_data):
        poster = validated_data.pop("files").pop(validated_data.pop("poster"), False)

        if poster:
            instance.poster.delete()
            instance.poster = poster[0]
            instance.save()

        return self.model.objects.filter(id=instance.id).update(**validated_data)

    def object_add_form_serializer_create(self, validated_data):
        poster = validated_data.pop("files").pop(validated_data.pop("poster"))[0]

        return self.model.objects.create(**validated_data, poster=poster)
