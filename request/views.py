from base_object_presenter.permission_classes import IsAdmin, NoPermission
from base_object_presenter.views import BaseViewsPresenter
from .services import RequestServicesPresenter


class RequestViewsPresenter(BaseViewsPresenter):
    services = RequestServicesPresenter()
    permissions = {
        "add": [NoPermission],
        "get_many": [IsAdmin],
        "update_fields": [IsAdmin]
    }
