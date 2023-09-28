from django.db.models import Min, Max

from base_object_presenter.services import BaseServicesPresenter
from .models import StoreModelPresenter


class StoreServicesPresenter(BaseServicesPresenter):
    model_presenter = StoreModelPresenter()

    def get_category_info(self, category):
        price_range = self.model_presenter.model.objects.filter(category=category).aggregate(
            min_price=Min("price"),
            max_price=Max("price")
        )
        brands = self.model_presenter.model.objects.filter(category=category).values_list("brand", flat=True).distinct()

        return {
            "min_price": price_range["min_price"],
            "max_price": price_range["max_price"],
            "brands": brands,
        }

    def get_categories(self):
        return list(self.model_presenter.model.objects.values_list('category', flat=True).distinct())
