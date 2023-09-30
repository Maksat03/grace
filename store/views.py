from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.request import Request
from rest_framework.response import Response

from base_object_presenter.views import BaseViewsPresenter, get_permissions_for_view
from .services import StoreServicesPresenter


class StoreViewsPresenter(BaseViewsPresenter):
    services = StoreServicesPresenter()

    @method_decorator(api_view(["GET"]))
    def get_categories_view(self, request):
        categories = self.services.get_categories()
        return Response(categories)

    @method_decorator(api_view(["GET"]))
    def get_brands_view(self, request):
        brands = self.services.get_category_info(request.query_params.get("category"))["brands"]
        return Response(brands)

    @method_decorator(api_view(["POST"]))
    @method_decorator(parser_classes([MultiPartParser, FormParser]))
    @get_permissions_for_view("add")
    def add_view(self, request: Request) -> Response:
        obj_id = self.services.add_custom(request.data, request.FILES)
        return Response({"id": obj_id})

    @method_decorator(api_view(["POST"]))
    @method_decorator(parser_classes([MultiPartParser, FormParser]))
    @get_permissions_for_view("edit")
    def edit_view(self, request: Request) -> Response:
        self.services.edit_custom(request.data.get("id"), request.data, request.FILES)
        return Response({"success": True})
