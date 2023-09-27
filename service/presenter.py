from service.models import ServiceModelPresenter
from service.services import ServiceServicesPresenter
from service.urls import ServiceURLsPresenter
from service.views import ServiceViewsPresenter


service_urls_presenter = ServiceURLsPresenter()
service_views_presenter = ServiceViewsPresenter()
service_services_presenter = ServiceServicesPresenter()
service_model_presenter = ServiceModelPresenter()
