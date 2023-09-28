from base_object_presenter.services import BaseServicesPresenter
from request.models import RequestModelPresenter


class RequestServicesPresenter(BaseServicesPresenter):
    model_presenter = RequestModelPresenter()
