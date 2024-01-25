from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate

from decouple import config


class CustomUserCreationForm(UserCreationForm):
    username = forms.CharField(label="username", min_length=5, max_length=150)
    email = forms.EmailField(label="email")
    password1 = forms.CharField(label="password1")
    password2 = forms.CharField(label="password2")
    is_admin = forms.BooleanField(label="is_admin", required=False)

    def username_clean(self):
        username = self.cleaned_data["username"].lower()
        new = User.objects.filter(username=username)
        if new.count():
            raise ValidationError("User Already Exist")
        return username

    def email_clean(self):
        email = self.cleaned_data["email"].lower()
        new = User.objects.filter(email=email)
        if new.count():
            raise ValidationError("Email Already Exist")
        return email

    def clean_password2(self):
        password1 = self.cleaned_data["password1"]
        password2 = self.cleaned_data["password2"]

        if password1 and password2 and password1 != password2:
            raise ValidationError("Password don't match")
        return password2

    def clean_is_admin(self):
        is_admin = self.cleaned_data.get("is_admin")
        if is_admin == True:
            print("code in if")
            password1 = self.cleaned_data["password1"]

            admin_password = config("ADMIN_PASSWORD")
            if password1 != admin_password:
                raise ValidationError(
                    "Please ensure you have the correct admin password"
                )
        print("code in else")
        return is_admin

    def save_user(self, commit=True):
        user = super().save(commit=False)

        user.email = self.cleaned_data["email"].lower()
        user.set_password(self.cleaned_data["password1"])
        user.is_active = False

        if commit:
            user.save()

        return user

    def save_admin(self, commit=True):
        user = self.save_user(commit=False)

        if self.cleaned_data.get("is_admin") == True:
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True

        if commit:
            user.save()

        return user


class VerifyOTPForm(forms.Form):
    email = forms.EmailField()
    otp = forms.CharField(max_length=4)

    def clean(self):
        cleaned_data = super().clean()
        email = cleaned_data.get("email")
        otp = cleaned_data.get("otp")

        if not email or not otp:
            raise forms.ValidationError("Email and OTP are required.")

        return cleaned_data


class LoginForm(forms.Form):
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)
    user = None

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get("username")
        password = cleaned_data.get("password")

        print("username - ", username)
        print("password - ", password)

        # Authenticate the user
        self.user = authenticate(username=username, password=password)

        if not self.user:
            raise ValidationError("Invalid username or password.")

        return cleaned_data
