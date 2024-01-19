from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .forms import CustomUserCreationForm, LoginForm, VerifyOTPForm
from .Utility_functions.handle_otp_verfication import verify_otp_via_mail
from django.contrib.auth.models import User


# signup page
def user_signup(request):
    if request.method == 'POST':
        # Initialize the form with the data

        print("Entering views")
        form_data = {
            'username': request.POST.get("username"),
            'email': request.POST.get('email'),
            'password1': request.POST.get('password1'),
            'password2': request.POST.get('password2')
        }

        form = CustomUserCreationForm(form_data)

        if form.is_valid():
            print("form is valid")
            # Save the form to create the user
            user_instance = form.save()
            form_data['user_instance'] = user_instance

            try:
                response = verify_otp_via_mail(user_object=form_data)
                print(response)
                request.session['signup_username'] = form_data['username']

                return redirect('verify_otp')

            except Exception as e:
                messages.error(request, f"Something went wrong: {str(e)}")
                return render(request, 'users/signup.html', {'form': form})

        else:
            print("form is invalid")
            messages.error(request, 'Form is not valid. Please check the errors.')
            return render(request, 'users/signup.html', {'form': form})

    else:
        form = CustomUserCreationForm()
    return render(request, 'users/signup.html', {'form': form})


def validate_otp(request):
    signup_username = request.session.get('signup_username')
    
    if request.method == "POST":
        messages.success(request, "Hi! Please check your email for an OTP")

        try:
            user_obj = User.objects.get(username=request.POST.get("username"))
        except User.DoesNotExist:
            messages.error(request, "User not found.")
            return render(request, 'users/verify_otp.html', {'form': form, 'username': signup_username})

        form = VerifyOTPForm(request.POST)
        if user_obj.userprofile.otp != request.POST.get('otp'):
            messages.error(request, "OTP didn't match!")
            return render(request, 'users/verify_otp.html', {'form': form, 'username': signup_username})
        
        else:
            user_obj.is_active = True
            user_obj.save()
            messages.success(request, "Registration successful!")
            return redirect('login')

    else:
        form = VerifyOTPForm()

    request.session.pop('signup_username', None)
    return render(request, 'users/verify_otp.html', {'form': form, 'username': signup_username})

        


# login page
def user_login(request):
    if request.method == 'POST':
        
        username = request.POST.get("username")
        password = request.POST.get("password")

        form_data = {
            "username": username,
            "password": password
        }

        form = LoginForm(form_data)
        
        print(form_data)

        if form.is_valid():
            print("form is valid")
            # Access the authenticated user from the form
            user = form.user
            login(request, user)
            return redirect('web_scrapping:avialable_websites')
        
        print("form is in valid")

    else:
        form = LoginForm()

    return render(request, 'users/login.html', {'form': form})


# logout page
def user_logout(request):
    logout(request)
    return redirect('login')
