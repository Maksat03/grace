import functools
from typing import MutableMapping

from django.db.models import Q
from rest_framework.exceptions import ValidationError

from .models import BaseModelPresenter
from .serializers import BaseSerializerPresenter, BaseSerializer


class BaseServicesPresenter:
    model_presenter: BaseModelPresenter

    def __init__(self):
        self.serializers = {
            "objects": BaseSerializerPresenter(self.model_presenter, "objects"),
            "object_add_form": BaseSerializerPresenter(self.model_presenter, "object_add_form"),
            "object_edit_form": BaseSerializerPresenter(self.model_presenter, "object_edit_form"),
            "object": BaseSerializerPresenter(self.model_presenter, "object"),
        }

    def get_many(self, get_many_request_schema: MutableMapping) -> BaseSerializer:
        get_many_query = self.model_presenter.get_many_service()

        objects = (self.model_presenter.model.objects
                   .prefetch_related(*get_many_query["prefetch_related"])
                   .select_related(*get_many_query["select_related"])
                   .filter(**{**get_many_query.get("filtration"), **get_many_request_schema.get("filtration", {})})
                   .annotate(**get_many_query["annotate"])
                   .order_by(get_many_request_schema.get("order_by", "-id"))
                   .only(*get_many_query["only"])
                   .distinct())

        return self.serializers["objects"](objects, many=True)

    def get(self, obj_id: int) -> BaseSerializer:
        get_query = self.model_presenter.get_service()

        obj = (self.model_presenter.model.objects
               .prefetch_related(*get_query["prefetch_related"])
               .select_related(*get_query["select_related"])
               .filter(id=obj_id)
               .annotate(**get_query["annotate"])
               .only(*get_query["only"])
               .first())

        return self.serializers["object"](obj)

    def delete(self, obj_id: int) -> None:
        self.model_presenter.model.objects.filter(id=obj_id).delete()

    def add(self, add_request_schema: MutableMapping) -> int:
        serializer = self.serializers["object_add_form"](data=add_request_schema)
        serializer.is_valid(raise_exception=True)
        return serializer.save().id

    def edit(self, obj_id: int, edit_request_schema: MutableMapping) -> None:
        obj = self.model_presenter.model.objects.filter(id=obj_id).first()
        serializer = self.serializers["object_edit_form"](obj, data=edit_request_schema)
        serializer.is_valid(raise_exception=True)
        serializer.save()

    def search(self, search_input: str, searching_fields: list) -> BaseSerializer:
        words = search_input.split()
        icontains_filters = []
        searchable_fields = self.model_presenter.get_searchable_fields()

        for searching_field in searching_fields:
            if searching_field in searchable_fields:
                for query in words:
                    icontains_filters.append(Q(**{f"{searching_field}__icontains": query.lower()}))

        combined_filter = functools.reduce(lambda a, b: a | b, icontains_filters)

        get_many_query = self.model_presenter.get_many_service()
        objs = (self.model_presenter.model.objects
                .prefetch_related(*get_many_query["prefetch_related"])
                .select_related(*get_many_query["select_related"])
                .filter(combined_filter)
                .annotate(**get_many_query["annotate"])
                .only(*get_many_query["only"])
                .distinct()
                .order_by("-id"))

        return self.serializers["objects"](objs, many=True)

    def update_fields(self, obj_id: int, data: MutableMapping) -> None:
        updatable_fields = self.model_presenter.get_updatable_fields()

        for key, value in data.items():
            if data[key] not in updatable_fields:
                raise ValidationError({'detail': f'Not updatable field "{key}"'})
            else:
                try:
                    getattr(self.model_presenter.model, key).clean(value, None)
                except Exception as e:
                    raise ValidationError({'detail': e})

        self.model_presenter.model.objects.filter(id=obj_id).update(**data)
