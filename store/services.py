from base_object_presenter.services import BaseServicesPresenter
from .models import StoreModelPresenter


class StoreServicesPresenter(BaseServicesPresenter):
    model_presenter = StoreModelPresenter()
