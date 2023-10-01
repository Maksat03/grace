from rest_framework.decorators import permission_classes, api_view
from rest_framework.request import Request
from rest_framework.response import Response

from base_object_presenter.permission_classes import IsAdmin
from . import services


@api_view(["GET", "POST"])
@permission_classes([IsAdmin])
def tg_ids_view(request: Request):
    if request.method == "GET":
        data = services.get_tg_ids()
        return Response(data)

    services.update_tg_ids(request.data["tg_ids"])
    return Response({"success": True})


@api_view(["GET", "POST"])
@permission_classes([IsAdmin])
def information_on_site_view(request):
    if request.method == "GET":
        data = services.get_information_on_site()
        return Response(data)

    services.update_information_on_site(request.data["information_on_site"])
    return Response({"success": True})
