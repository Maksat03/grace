from django import template
from settings import services as settings_services


register = template.Library()


@register.simple_tag
def get_information_on_site():
    return settings_services.get_information_on_site()
