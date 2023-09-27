from django.urls import path
from .views import change_password_view


urlpatterns = [
    path("change_password/", change_password_view, name="change_password"),
]
