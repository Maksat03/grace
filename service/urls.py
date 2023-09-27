from base_object_presenter.urls import BaseURLsPresenter
from .views import ServiceViewsPresenter


class ServiceURLsPresenter(BaseURLsPresenter):
    views = ServiceViewsPresenter()


urlpatterns = ServiceURLsPresenter().get_urlpatterns()
