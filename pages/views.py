from django.shortcuts import render
from project.utils import base_page_or_content


@base_page_or_content
def main_page_view(request):
    return render(request, "main_page.html")


@base_page_or_content
def services_page_view(request):
    return render(request, "services_page.html")


@base_page_or_content
def service_page_view(request):
    return render(request, "service_page.html")
