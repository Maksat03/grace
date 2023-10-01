from django.urls import path
from .views import information_on_site_view, tg_ids_view

urlpatterns = [
    path("information_on_site/", information_on_site_view),
    path("tg_ids/", tg_ids_view)
]