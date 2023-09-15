from django.urls import path
from .views import *


urlpatterns = [
    path("", main_page_view),
    path("portfolio/", portfolio_page_view)
]
