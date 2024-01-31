from django.urls import path
from . import views

app_name = 'web_scrapping'

urlpatterns = [
    path('available_websites/', views.get_available_websites, name='avialable_websites'),
    path('send_mail_to_user/', views.send_mail_to_user, name='send_mail_to_user'),
]