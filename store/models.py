from django.db import models
from base_object_presenter.models import BaseModelPresenter


class Product(models.Model):
    name = models.CharField(max_length=255)
    poster = models.ImageField(upload_to="product_posters/")
    code = models.CharField(max_length=50)
    price = models.PositiveIntegerField()
    category = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    description = models.TextField()


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
    def get_object_add_form_serializer_fields():
        return "__all__"

    @staticmethod
    def get_object_add_form_serializer_extra_fields():
        return {}

    @staticmethod
    def get_object_edit_form_serializer_fields():
        return "__all__"

    @staticmethod
    def get_object_edit_form_serializer_extra_fields():
        return {}

    def object_edit_form_serializer_update(self, instance, validated_data):
        return self.model.objects.filter(id=instance.id).update(**validated_data)

    def object_add_form_serializer_create(self, validated_data):
        return self.model.objects.create(**validated_data)
