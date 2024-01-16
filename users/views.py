from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import CustomUserCreationForm, LoginForm, VerifyOTPForm
from .Utility_functions.handle_otp_verfication import verify_otp_via_mail
from django.contrib.auth.models import User
from django.urls import reverse


# signup page
def user_signup(request):
    if request.method == 'POST':
        # Initialize the form with the data

        print("Entering views")
        form_data = {
            'username': request.POST.get("username"),
            'email': request.POST.get('email'),
            'password1': request.POST.get('password1'),
            'password2': request.POST.get('password2'),
            'is_active': 0
        }

        form = CustomUserCreationForm(form_data)

        if form.is_valid():
            print("form is valid")
            # Save the form to create the user
            user_instance = form.save()
            form_data['user_instance'] = user_instance
            verify_otp_via_mail(
                user_object=form_data
            )

            return redirect('verify_otp')

        else:
            print("form is invalid")
            return render(request, 'users/signup.html', {'form': form})

    else:
        form = CustomUserCreationForm()
    return render(request, 'users/signup.html', {'form': form})


def validate_otp(request):
    if request.method == "POST":
        messages.success(request, "Hi! Please check your email for an OTP")

        try:
            user_obj = User.objects.get(username=request.POST.get("username"))
        except User.DoesNotExist:
            messages.error(request, "User not found.")
            return render(request, 'users/verify_otp.html', {'form': form})

        form = VerifyOTPForm(request.POST)
        if user_obj.userprofile.otp != request.POST.get('otp'):
            messages.error(request, "OTP didn't match!")
            return render(request, 'users/verify_otp.html', {'form': form})
        
        else:

            user_obj.is_active = 1
            user_obj.save()

            messages.success(request, "Registration successful!")
            return redirect('login')

    else:
        form = VerifyOTPForm()
    return render(request, 'users/verify_otp.html', {'form': form})
        


# login page
def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('login')
    else:
        form = LoginForm()
    return render(request, 'users/login.html', {'form': form})


# logout page
def user_logout(request):
    logout(request)
    return redirect('login')
