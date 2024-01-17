from rest_framework import serializers
from web_scrapping.models import ScrapedData

class ScrapedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapedData
        fields = ['store', 'data']