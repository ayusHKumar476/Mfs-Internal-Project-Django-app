from web_scrapping.models import ScrapedData, Store
from .serializers import ScrapedDataSerializer
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView
from rest_framework import status
import io, csv, pandas as pd
import json, ast

def get_scrapped_data_details():
    items = ScrapedData.objects.all()[:50]
    serializer = ScrapedDataSerializer(items, many=True)
    response = serializer.data

    response_list = []

    for item in response:
        data_json = ast.literal_eval(item["data"])

        response_list.append({
            "store_id": item['store'],
            "store_name": data_json.get('store_name', ''),
            "store_city": data_json.get('store_city', '')
        })

    return response_list


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

            # Create ScrapedData instance
            scraped_data = ScrapedData.objects.create(
                store=store,
                data=row.to_dict(),
            )

        return Response(
            {"message": "Data created successfully"}, status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# create_scrapped_details()
