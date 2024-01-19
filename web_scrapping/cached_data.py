from django.core.cache import cache
from .api.urls import get_scrapped_company_details

def get_scrapped_company_details_cached(company):
    cache_key = f'company_details:{company}'
    result = cache.get(cache_key)

    if result is None:
        # If not in cache, compute the result and store it in the cache
        result = get_scrapped_company_details(company)
        cache.set(cache_key, result, timeout=3600)  # Cache for 1 hour (adjust as needed)

    return result