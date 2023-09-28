from django.db import models
from django.db.models import Count, F
from rest_framework import serializers

from base_object_presenter.models import BaseModelPresenter


class Service(models.Model):
    parent_service = models.ForeignKey("Service", on_delete=models.CASCADE, related_name="sub_services", null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    poster = models.ImageField(upload_to="service_posters/")


class ServiceImage(models.Model):
    service = models.ForeignKey("Service", on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="service_images/")


class ServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ["image"]


class ServiceModelPresenter(BaseModelPresenter):
    model = Service

    @staticmethod
    def get_many_service():
        return {
            "prefetch_related": [],
            "select_related": [],
            "annotate": {"sub_services_count": Count("sub_services")},
            "only": ["id", "name", "poster"],
            "filtration": {}
        }

    @staticmethod
    def get_service():
        return {
            "prefetch_related": ["images"],
            "select_related": [],
            "annotate": {"parent_service_name": F("parent_service__name"), "sub_services_count": Count("sub_services")},
            "only": ["id", "name", "description", "poster", "parent_service", "images"],
        }

    @staticmethod
    def get_object_serializer_fields():
        return ["id", "name", "description", "poster", "parent_service_id"]

    @staticmethod
    def get_object_serializer_extra_fields():
        return {
            "parent_service_name": serializers.CharField(max_length=255),
            "images": ServiceImageSerializer(many=True),
            "sub_services_count": serializers.IntegerField()
        }

    @staticmethod
    def get_objects_serializer_fields():
        return ["id", "name", "poster"]

    @staticmethod
    def get_objects_serializer_extra_fields():
        return {
            "sub_services_count": serializers.IntegerField()
        }

    @staticmethod
    def get_object_add_form_serializer_fields():
        return ["name", "description", "poster", "parent_service_id", "images"]

    @staticmethod
    def get_object_add_form_serializer_extra_fields():
        return {
            "images": serializers.JSONField(required=False),
            "parent_service_id": serializers.IntegerField(required=False),
        }

    @staticmethod
    def get_object_edit_form_serializer_fields():
        return ["name", "description", "poster", "parent_service_id", "images"]

    @staticmethod
    def get_object_edit_form_serializer_extra_fields():
        return {
            "images": serializers.JSONField(required=False),
            "parent_service_id": serializers.IntegerField(required=False),
        }

    def object_add_form_serializer_create(self, validated_data):
        images = validated_data.pop("images", [])
        files = validated_data.pop("files", {})

        service = Service(**validated_data)

        for image in images:
            img = files.get("image: " + image)
            images.append(ServiceImage(service=service, image=img))

        service = service.save()
        ServiceImage.objects.bulk_create(images)

        return service

    def object_edit_form_serializer_update(self, instance, validated_data):
        images = validated_data.pop("images", [])
        files = validated_data.pop("files", {})

        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance = instance.save()
        new_images = []

        for image in images:
            img = files.pop(image, False)

            if not img:
                img = image.replace("/media/", "")
            else:
                img = img[0]

            new_images.append(ServiceImage(**image, service=instance, image=img))

        ServiceImage.objects.filter(service=instance).delete()
        ServiceImage.objects.bulk_create(new_images)

        return instance
