from base_object_presenter.urls import BaseURLsPresenter
from .views import StoreViewsPresenter


class StoreURLsPresenter(BaseURLsPresenter):
    views = StoreViewsPresenter()


urlpatterns = StoreURLsPresenter().get_urlpatterns()
