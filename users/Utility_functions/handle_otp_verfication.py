from web_scrapping.models import UserProfile

import random
from django.conf import settings
from django.core.mail import send_mail
from rest_framework.generics import get_object_or_404

from django.core.exceptions import ValidationError


def create_user_profile(user_object, otp):

	user_data = {
		'username': user_object["username"],
		'otp': otp,
		'email': user_object["email"],
		'user': user_object["user_instance"],
	}

	try:
		user = UserProfile(**user_data)
		user.full_clean()
		user.save()
		print("user created successfully")
		return {
			'message': "user created successfully",
			'status': 200
		}

	except ValidationError as ve:
		print(f"Validation error: {ve}")
		return {
			'message': f'Validation error: {ve}',
			'status': 400
		}

	except Exception as e:
		print(f"Something went wrong while creating userProfile: {str(e)}")
		return {
			'message' : f'issue - {str(e)}',
			'status' : 400
		}


def send_otp_via_email(otp, email):
	# Send OTP via email
	subject = "Here is your OTP"
	message = f"Your OTP for verification is -> {otp}"
	email_from = settings.EMAIL_HOST
	send_mail(subject, message, email_from, [email])
	print("OTP SENT FOR VERIFICATION")


def verify_otp(user_object):
	otp = random.randint(1000, 9999)

	# Ensure user_object is a dictionary containing 'username'
	username = user_object.get('username')
	if not username:
		# Handle the case where 'username' is not present in user_object
		return

	# Create UserProfile with OTP
	try:
		response = create_user_profile(user_object, otp)
		print(response)
	except Exception as e:
		return str(e)

	# Retrieve UserProfile
	user_profile = get_object_or_404(UserProfile, username=username)

	send_otp_via_email(otp, user_profile.email)

	# Update OTP in UserProfile
	user_profile.otp = otp
	user_profile.save()

	return otp


def verify_otp_via_mail(user_object):
	return verify_otp(user_object)
