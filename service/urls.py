from base_object_presenter.urls import BaseURLsPresenter
from .views import ServiceViewsPresenter


class ServiceURLsPresenter(BaseURLsPresenter):
    views = ServiceViewsPresenter()
    urls = ["get_many", "add", "get", "edit", "delete", "update_fields", "get_categories"]


urlpatterns = ServiceURLsPresenter().get_urlpatterns()
