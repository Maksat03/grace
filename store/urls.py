from base_object_presenter.urls import BaseURLsPresenter
from .views import StoreViewsPresenter


class StoreURLsPresenter(BaseURLsPresenter):
    views = StoreViewsPresenter()
    urls = ["get_many", "add", "get", "edit", "delete", "update_fields", "get_categories", "get_brands"]


urlpatterns = StoreURLsPresenter().get_urlpatterns()
