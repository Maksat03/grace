from request.models import RequestModelPresenter
from request.services import RequestServicesPresenter
from request.urls import RequestURLsPresenter
from request.views import RequestViewsPresenter


request_urls_presenter = RequestURLsPresenter()
request_views_presenter = RequestViewsPresenter()
request_services_presenter = RequestServicesPresenter()
request_model_presenter = RequestModelPresenter()
