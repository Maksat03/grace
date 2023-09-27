from base_object_presenter.views import BaseViewsPresenter
from .services import StoreServicesPresenter


class StoreViewsPresenter(BaseViewsPresenter):
    services = StoreServicesPresenter()
