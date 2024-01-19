from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.user_signup, name='signup'),
    path('verify_otp/', views.validate_otp, name='verify_otp'),
    path('login/', views.user_login, name='login'),
    path('forgot_password/', views.handle_forgot_password_request, name='forgot_password'),
    path('reset_password/', views.reset_password, name='reset_password'),
    path('verify_otp_pwd/', views.verify_otp_for_password, name='verify_otp_pwd'),
    path('logout/', views.user_logout, name='logout'),

]