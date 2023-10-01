from typing import MutableMapping

from base_object_presenter.services import BaseServicesPresenter
from request.models import RequestModelPresenter

from project.utils import datetime_now


class RequestServicesPresenter(BaseServicesPresenter):
    model_presenter = RequestModelPresenter()

    def update_fields(self, obj_id: int, data: MutableMapping) -> None:
        updatable_fields = self.model_presenter.get_updatable_fields()

        for key, value in data.items():
            if key not in updatable_fields:
                raise ValidationError({'detail': f'Not updatable field "{key}"'})
            else:
                try:
                    continue
                    getattr(self.model_presenter.model, key).clean(value, None)
                except Exception as e:
                    raise ValidationError({'detail': e})

        data["answered_at"] = datetime_now()
        self.model_presenter.model.objects.filter(id=obj_id).update(**data)

    def get_new_requests_count(self):
        return {
            "total": self.model_presenter.model.objects.filter(is_accepted=False).count(),
            "count_for_store": self.model_presenter.model.objects.filter(is_accepted=False, category="store").count(),
            "count_for_services": self.model_presenter.model.objects.filter(is_accepted=False, category="services").count(),
        }
