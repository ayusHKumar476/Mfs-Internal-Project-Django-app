from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	username = models.CharField(max_length=30, unique=True, db_index=True)
	email = models.EmailField(unique=True)
	is_superuser = models.BooleanField(default=False)
	otp = models.CharField(max_length=4, null=True, blank=True)

	def __str__(self):
		return self.user.username


class Store(models.Model):
	store_name = models.CharField(max_length=50)
	store_address = models.CharField(max_length=50)
	phone_number = models.CharField(max_length=50)
	zip_code = models.CharField(max_length=50)
	latitude = models.CharField(max_length=50)
	longitude = models.CharField(max_length=50)
	city_name = models.CharField(max_length=50)
	state = models.CharField(max_length=25)

	def __str__(self):
		return self.store_name


class ScrapedData(models.Model):
	store = models.ForeignKey(Store, on_delete=models.CASCADE)
	data = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.store.store_name} - {self.timestamp}"
