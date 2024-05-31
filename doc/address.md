# Address API Spec

## Create Address

Endpoint : POST /api/contacts/:contactId/addresses/v1

Headers : 
- Authorization: token

Request Body : 

```json
{
    "street" : "street_value", //optional
    "city" : "city_value", //optional
    "province" : "province_value", //optional
    "country" : "country_value",
    "postal_code" : "postal_code_value"
}
```

Responese Body (Success) : 

```json
{
    "statusCode" : 201,
    "message" : "Create contact address success", 
    "data" : {
        "id" : 1,
        "street" : "street_value", 
        "city" : "city_value",
        "province" : "province_value",
        "country" : "country_value",
        "postal_code" : "postal_code_value"
    }
}
```

Responese Body (Failed) : 

```json
{
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
}
```

## Get Address Detail

Endpoint : GET /api/contacts/:contactId/addresses/v1/:addressId

Headers : 
- Authorization: token

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Get specific address contact user success", 
    "data" : {
        "id" : 1,
        "street" : "street_value", 
        "city" : "city_value",
        "province" : "province_value",
        "country" : "country_value",
        "postal_code" : "postal_code_value"
    }
}
```

Responese Body (Failed) : 

```json
{
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
}
```

## Update Address

Endpoint : PUT /api/contacts/:contactId/addresses/v1/:addressId

Headers : 
- Authorization: token

Request Body : 

```json
{
    "street" : "street_value", //optional
    "city" : "city_value", //optional
    "province" : "province_value", //optional
    "country" : "country_value",
    "postal_code" : "postal_code_value"
}
```

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Update contact address success", 
    "data" : {
        "id" : 1,
        "street" : "street_value", 
        "city" : "city_value",
        "province" : "province_value",
        "country" : "country_value",
        "postal_code" : "postal_code_value"
    }
}
```

Responese Body (Failed) : 

```json
{
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
}
```

## Remove Address

Endpoint : DELETE /api/contacts/:contactId/addresses/v1/:addressId

Headers : 
- Authorization: token

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Remove address success", 
    "data" : true
}
```

Responese Body (Failed) : 

```json
{
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
}
```

## List Addresses

Endpoint : GET /api/contacts/:contactId/v1/addresses

Headers : 
- Authorization: token

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Get contact addresses success", 
    "data" : [
        {
            "id" : 1,
            "street" : "street_value", 
            "city" : "city_value",
            "province" : "province_value",
            "country" : "country_value",
            "postal_code" : "postal_code_value"
        },
        {
            "id" : 2,
            "street" : "street_value 2", 
            "city" : "city_value 2",
            "province" : "province_value 2",
            "country" : "country_value 2",
            "postal_code" : "postal_code_value 2"
        }
    ]
}
```

Responese Body (Failed) : 

```json
{
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
}
```


