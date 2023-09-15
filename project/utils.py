from datetime import datetime
from dateutil.relativedelta import relativedelta

from django.shortcuts import render
from project.settings import TIME_DIFFERENCE_BETWEEN_SERVER


def datetime_now() -> datetime:
    return datetime.now() + relativedelta(hours=TIME_DIFFERENCE_BETWEEN_SERVER)


def base_page_or_content(function):
    def wrapper(*args, **kwargs):
        request = args[0]

        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return function(*args, **kwargs)
        return render(request, "base.html")
    return wrapper
