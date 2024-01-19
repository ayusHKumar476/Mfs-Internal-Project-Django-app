import json
import openpyxl
import os
import pandas as pd


from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.core.mail import send_mail, EmailMessage, BadHeaderError

from .api.urls import get_scrapped_company
from .cached_data import get_scrapped_company_details_cached


# Create your views here.
@login_required(login_url="/users/login")
def get_available_websites(request):
    if request.method == "POST":

        company = request.POST.get("company")
        store_details = get_scrapped_company_details_cached(company)

        # Set the number of items per page
        items_per_page = 5

        # Create a Paginator object
        paginator = Paginator(store_details, items_per_page)

        # Get the requested page number from the request parameters
        page_number = request.POST.get("page", 1)

        # Convert the page number to an integer
        page_number = int(page_number)

        try:
            # Get the Page object for the requested page
            page_obj = paginator.page(page_number)
        except (PageNotAnInteger, EmptyPage):
            # If page_number is not an integer or out of range, set to the first page
            page_obj = paginator.page(1)

        # Convert the Page object to a list for JSON serialization
        serialized_page = list(page_obj.object_list)

        data = {
            "data_obj": {
                "list": serialized_page,
                "has_previous": page_obj.has_previous(),
                "has_next": page_obj.has_next(),
                "number": page_obj.number,
            },
        }

        return JsonResponse(data, safe=False)

    if request.method == "GET":
        try:
            data_list = get_scrapped_company()
            return render(request, "web_scrapping/index.html", {"form": data_list})

        except Exception as e:
            return render(request, "web_scrapping/index.html", {"form": ""})
        

def send_mail_to_user(request):
    if request.method == "POST":

        try:

            company_name = request.POST.get('company')
            user_email = request.user.email

            company_details = get_scrapped_company_details_cached(company_name)
            data_list = [store_info['data'] for store_info in company_details]

            # Convert company_details to a DataFrame
            df = pd.DataFrame(data_list)


            # Create an Excel file from the DataFrame
            excel_file_path = str(company_name) + ' store_list.xlsx'
            df.to_excel(excel_file_path, index=False)

            try:
                # Send email with the Excel file attachment
                email = EmailMessage(
                    str(company_name)+' Stores',
                    'Please find attached the list of stores.',
                    'testing@gmail.com',  # Sender's email address
                    # [user_email],  # Recipient's email address
                    ["kumarayushjsrsakchi@gmail.com"],
                )

                email.attach_file(excel_file_path)
                sent_count = email.send()

                if sent_count == 1:
                    # Email sent successfully
                    return HttpResponse('Email sent successfully!')
                else:
                    # Email not sent
                    return HttpResponse('Failed to send email.')

            except BadHeaderError:
                # Handle BadHeaderError if the email headers are not properly formatted
                return HttpResponse('Invalid email header. Please check your email content.')

    
        except Exception as e:
            return HttpResponse(f'Something went wrong error: {str(e)}')