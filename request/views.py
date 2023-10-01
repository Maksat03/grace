from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

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

    @method_decorator(api_view(["GET"]))
    @method_decorator(permission_classes([IsAdmin]))
    def get_new_requests_count_view(self, request):
        counts = self.services.get_new_requests_count()
        return Response(counts)
