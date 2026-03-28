# Explore Module - Items Search API

The Items Search API provides high-performance, fuzzy text matching combined with geospatial radius filtering for product discovery.

## Endpoint

`GET /api/explore/items/search`

## Query Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `query` | `string` | **Yes** | The search term (e.g., "Milk", "Bread"). Minimum 1 character. |
| `lat` | `number` | **Yes** | Latitude for proximity search (e.g., `33.687060`). |
| `lon` | `number` | **Yes** | Longitude for proximity search (e.g., `73.046776`). |
| `radius` | `number` | No | Search radius in meters. Default: `5000` (5km). |
| `page` | `number` | No | Pagination page number. Default: `1`. |
| `limit` | `number` | No | Number of items per page. Default: `10`. |

## Features

1.  **Fuzzy Search**: Uses PostgreSQL `pg_trgm` (trigram) similarity matching on item names and descriptions. This allows for typo tolerance (e.g., "Faha" matches "Fahad").
2.  **Geospatial Filtering**: Automatically restricts search results to active shops within the specified radius using PostGIS `ST_DWithin`.
3.  **Advanced Ranking**: Results are sorted by:
    *   Name similarity (highest first)
    *   Description similarity
    *   Distance from the user (closest first)
4.  **Analytics**: Each search query and its results are tracked for behavioral analytics.

## Example Request

```bash
curl -X GET "http://localhost:3837/api/explore/items/search?query=Milk&lat=33.68&lon=73.04&radius=10000"
```

## Example Response

```json
{
  "success": true,
  "statusCode": 200,
  "data": [
    {
      "id": "item-uuid",
      "name": "Fresh Milk",
      "description": "1L organic milk bottle",
      "price": "2.50",
      "unit": "Piece",
      "imageUrl": "https://...",
      "isAvailable": true,
      "stockCount": 10,
      "shop": {
        "id": "shop-uuid",
        "shopName": "Organic Store",
        "shopAddress": "Islamabad",
        "shopLatitude": "33.68...",
        "shopLongitude": "73.04...",
        "isActive": true
      }
    }
  ],
  "meta": {
    "totalItems": 1,
    "itemCount": 1,
    "itemsPerPage": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```
