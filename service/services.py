from typing import MutableMapping

from django.db.models import F, Q

from base_object_presenter.services import BaseServicesPresenter
from .models import ServiceModelPresenter


class ServiceServicesPresenter(BaseServicesPresenter):
    model_presenter = ServiceModelPresenter()

    def get_categories(self):
        parent_services = list(self.model_presenter.model.objects.all().values_list('id', "name").distinct())

        return [{"id": parent_service[0], "name": parent_service[1]} for parent_service in parent_services]

    def add_custom(self, add_request_schema: MutableMapping, files: MutableMapping) -> int:
        serializer = self.serializers["object_add_form"](data=add_request_schema)
        serializer.is_valid(raise_exception=True)
        return serializer.save(files=files).id

    def edit_custom(self, obj_id: int, edit_request_schema: MutableMapping, files: MutableMapping) -> None:
        obj = self.model_presenter.model.objects.filter(id=obj_id).first()
        serializer = self.serializers["object_edit_form"](obj, data=edit_request_schema)
        serializer.is_valid(raise_exception=True)
        serializer.save(files=files)
