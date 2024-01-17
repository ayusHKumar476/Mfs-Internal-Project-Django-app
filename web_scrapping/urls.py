from django.urls import path
from . import views

app_name = 'web_scrapping'

urlpatterns = [
    path('avialable_websites/', views.get_available_websites, name='avialable_websites'),
]