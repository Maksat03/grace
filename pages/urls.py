from django.urls import path
from .views import *


urlpatterns = [
    path("", main_page_view),
    path("services/", services_page_view),
    path("service/", service_page_view)
]
