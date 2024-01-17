from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .api.urls import get_scrapped_data_details


# Create your views here.
@login_required(login_url="/users/login")
def get_available_websites(request):
    if request.method == "POST":

        print("webpage has been fetched")


        return render(request, 'web_scrapping/index.html', {'form': 'HELLO'})
    
    if request.method == "GET":
        # print("data from class - ", get_scrapped_data_details())
        
        print("GET METHOD FETCHED")

        return render(request, 'web_scrapping/index.html', {'form': 'HELLO'})

