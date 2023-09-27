from base_object_presenter.views import BaseViewsPresenter
from .services import ServiceServicesPresenter


class ServiceViewsPresenter(BaseViewsPresenter):
    services = ServiceServicesPresenter()
