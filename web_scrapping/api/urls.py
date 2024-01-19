from web_scrapping.models import ScrapedData, Store
from .serializers import ScrapedDataSerializer
from django.http import JsonResponse
from django.db.models import F
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from rest_framework import status
import io, csv, pandas as pd
import json, ast


def get_scrapped_company():
    response_list = []

    try:
        unique_companies = (
            ScrapedData.objects
            .filter(data__contains={"company": "Apple"})
            .values("data__company")
            .annotate(company_name=F("data__company"))
            .values("company_name")
            .distinct()
        )

        for data in unique_companies:
            response_list.append(data)

    except Exception as e:
        print(f"Something went wrong: {e}")

    return response_list


def get_scrapped_company_details(company):
    try:
        query_set = ScrapedData.objects.filter(
            data__contains={'company': company}
        ).values(
            'data'
        )[:30]

        return list(query_set)

    except ObjectDoesNotExist:
        print(f"No data found for: {company}")
        return []

    except Exception as e:
        print(f"Something went wrong: {str(e)}")
        return []

        


def create_scrapped_details():
    file_path = "web_scrapping/csv_files/apple_store_locations.csv"
    file = pd.read_csv(file_path, index_col=0)

    try:
        # Iterate through each row in the CSV file
        for index, row in file.iterrows():
            # Create or get the Store instance
            store, created = Store.objects.get_or_create(
                store_name=row["store_name"],
                store_address=row["store_address"],
                phone_number=row["phone_number"],
                zip_code=row["zip_code"],
                latitude=row["latitude"],
                longitude=row["longitude"],
                city_name=row["city_name"],
                state=row["state"],
            )

            row_data = row.to_dict()
            row_data["company"] = "Apple"

            # Create ScrapedData instance
            scraped_data = ScrapedData.objects.create(store=store, data=row_data)

        return Response(
            {"message": "Data created successfully"}, status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# create_scrapped_details()
