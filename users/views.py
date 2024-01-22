import random
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages, admin
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import SetPasswordForm

from .Utility_functions.handle_otp_verfication import (
    verify_otp_via_mail,
    send_otp_via_email,
)
from .forms import CustomUserCreationForm, LoginForm, VerifyOTPForm


# signup page
def user_signup(request):
    if request.method == "POST":
        # Initialize the form with the data

        admin_role = False
        if request.POST.get("is_admin") == "on":
            admin_role = True

        print(request.POST.get("is_admin"))


        form_data = {
            "username": request.POST.get("username"),
            "email": request.POST.get("email"),
            "password1": request.POST.get("password1"),
            "password2": request.POST.get("password2"),
            "is_admin": admin_role
        }

        form = CustomUserCreationForm(form_data)

        if form.is_valid():
            print("form is valid")
            # Save the form to create the user
            user_instance = form.save()
            form_data["user_instance"] = user_instance

            try:
                response = verify_otp_via_mail(user_object=form_data)
                request.session["signup_username"] = form_data["username"]

                return redirect("verify_otp")

            except Exception as e:
                messages.error(request, f"Something went wrong: {str(e)}")
                return render(request, "users/signup.html", {"form": form})

        else:
            print("form is invalid")
            messages.error(request, "Form is not valid. Please check the errors.")
            return render(request, "users/signup.html", {"form": form})

    else:
        form = CustomUserCreationForm()
    return render(request, "users/signup.html", {"form": form})


@login_required(login_url="/users/login")
def validate_otp(request):
    signup_username = request.session.get("signup_username")

    if request.method == "POST":
        try:
            user_obj = User.objects.get(username=request.POST.get("username"))
        except User.DoesNotExist:
            messages.error(request, "User not found.")
            return render(
                request,
                "users/verify_otp.html",
                {"form": form, "username": signup_username},
            )

        form = VerifyOTPForm(request.POST)
        if user_obj.userprofile.otp != request.POST.get("otp"):
            messages.error(request, "OTP didn't match!")
            return render(
                request,
                "users/verify_otp.html",
                {"form": form, "username": signup_username},
            )

        else:
            user_obj.is_active = True
            user_obj.save()
            messages.success(request, "Registration successful!")
            return redirect("login")

    else:
        form = VerifyOTPForm()

    request.session.pop("signup_username", None)
    return render(
        request, "users/verify_otp.html", {"form": form, "username": signup_username}
    )


# login page
def user_login(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        form_data = {"username": username, "password": password}

        form = LoginForm(form_data)

        print(form_data)

        if form.is_valid():
            print("form is valid")
            # Access the authenticated user from the form
            user = form.user
            login(request, user)
            return redirect("web_scrapping:avialable_websites")

        print("form is in valid")

    else:
        form = LoginForm()

    return render(request, "users/login.html", {"form": form})


# logout page
def user_logout(request):
    logout(request)
    return redirect("login")


def handle_forgot_password_request(request):
    if request.method == "GET":
        return render(request, "users/forgot_password.html")

    if request.method == "POST":
        try:
            if "email" in request.POST:
                user_obj = get_object_or_404(User, email=request.POST.get("email"))

            elif "username" in request.POST:
                user_obj = get_object_or_404(
                    User, username=request.POST.get("username")
                )

            else:
                print("Nothing found")

            otp = random.randint(1000, 9999)

            send_otp_via_email(otp, user_obj.email)
            request.session["user_id"] = user_obj.id

            user_obj.userprofile.otp = otp
            user_obj.userprofile.save()

            return redirect("verify_otp_pwd")

        except User.DoesNotExist:
            messages.error(request, "User not found.")

        except Exception as e:
            print(f"Something went wrong: {str(e)}")

        return render(request, "users/forgot_password.html")


def verify_otp_for_password(request):
    if request.method == "GET":
        user_id = request.session.get("user_id")
        user_obj = User.objects.get(pk=user_id)
        return render(request, "users/verify_otp_pwd.html", {"username": user_obj.username})

    if request.method == "POST":
        try:
            otp = request.POST.get("otp")
            user_id = request.session.get("user_id")

            user_obj = User.objects.get(pk=user_id)

            print(otp, user_obj.userprofile.otp)

            if int(otp) != int(user_obj.userprofile.otp):
                messages.error(request, "OTP didn't match!")
                return render(
                    request,
                    "users/verify_otp_pwd.html",
                    {"username": user_obj.username}
                )

            else:
                messages.success(request, "OTP matched!")
                return redirect("reset_password")  # Redirect to the reset password page

        except User.DoesNotExist:
            messages.error(request, "User not found.")
            return render(request, "users/verify_otp_pwd.html")

        except Exception as e:
            messages.error(request, f"Something went wrong: {str(e)}")
            return render(request, "users/verify_otp_pwd.html")

    # If none of the conditions are met, fall back to rendering the template
    return render(request, "users/verify_otp_pwd.html")


def reset_password(request):
    if request.method == "POST":
        print("post method called")
        try:
            form_data = {
                "new_password1": request.POST.get("password1"),
                "new_password2": request.POST.get("password2"),
            }

            user_id = request.session.get("user_id")

            print("user_id:", user_id, form_data)

            # Check if the user object is present and is a valid user
            user_obj = User.objects.get(pk=user_id)
            form = SetPasswordForm(user_obj, form_data)

            if form.is_valid():
                print("form is valid")
                user = form.save()
                print("user updated")
                messages.success(request, "Your password was successfully updated!")
                request.session.pop("user", None)
                return redirect("login")

            else:
                print(form.errors)
                messages.error(request, form.errors)

        except Exception as e:
            # Handle exceptions, log them, or customize the error handling as needed
            messages.error(
                request, "An error occurred while processing the password reset."
            )


    request.session.pop("user", None)
    return render(request, "users/reset_password.html")


def admin_panel_view(request):
    return render(request, 'users/admin_panel.html')