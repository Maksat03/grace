from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.request import Request

from . import services


@api_view(["POST"])
@permission_classes([IsAdminUser])
def change_password_view(request: Request) -> Response:
    services.change_password(request, request.user, request.data)
    return Response({"success": True})
