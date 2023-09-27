from base_object_presenter.services import BaseServicesPresenter
from .models import ServiceModelPresenter


class ServiceServicesPresenter(BaseServicesPresenter):
    model_presenter = ServiceModelPresenter()
