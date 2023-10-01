import json

from django.shortcuts import render, redirect
from project.utils import base_page_or_content
from service.presenter import service_services_presenter
from store.presenter import store_services_presenter


@base_page_or_content
def main_page_view(request):
    services = service_services_presenter.get_many({"limit": 5, "filtration": {"parent_service": None}})
    products = store_services_presenter.get_many({"limit": 5, "ordering": ["-id"]})
    return render(request, "main_page.html", {"services": services.data, "products": products.data})


@base_page_or_content
def services_page_view(request):
    service_id = request.GET.get("id", 0)

    if service_id:
        service = service_services_presenter.get(int(service_id))

        if service.data["sub_services_count"] > 0:
            services = service_services_presenter.get_many({"filtration": {"parent_service": service.data["id"]}})
            return render(request, "services_page.html", {"service": service.data, "services": services.data})
        return render(request, "service_page.html", {"service": service.data})

    services = service_services_presenter.get_many({"filtration": {"parent_service": None}})
    return render(request, "services_page.html", {"services": services.data})


@base_page_or_content
def store_page_view(request):
    categories = store_services_presenter.get_categories()

    if len(categories) > 0:
        category = request.GET.get("category", categories[0])
    else:
        category = request.GET.get("category", "Не выбрано")

    category_info = store_services_presenter.get_category_info(category)

    selected_ordering = request.GET.get("ordering", "-id")
    selected_min_price = request.GET.get("min_price", category_info["min_price"])
    selected_max_price = request.GET.get("max_price", category_info["max_price"])
    selected_brands = request.GET.get("brands", [])

    if selected_brands:
        selected_brands = json.loads(selected_brands)

    return render(request, "store_page.html", {
        "categories": categories,
        "min_price": category_info["min_price"],
        "max_price": category_info["max_price"],
        "brands": category_info["brands"],

        "selected_category": category,
        "selected_ordering": selected_ordering,
        "selected_min_price": selected_min_price,
        "selected_max_price": selected_max_price,
        "selected_brands": selected_brands,
    })


@base_page_or_content
def product_page_view(request, product_id):
    product = store_services_presenter.get(product_id)
    return render(request, "product_page.html", {"product": product.data})


def admin_page_view(request):
    if not request.user.is_authenticated:
        return redirect("/login/")

    if request.user.is_superuser or request.user.is_staff:
        return render(request, "admin_page.html")

    return redirect("/")


@base_page_or_content
def about_us_page_view(request):
    return render(request, "about_us_page.html")
