# Contact API Spec

## Create Contact

Endpoint : POST /api/contacts/v1

Headers : 
- Authorization: token

Request Body : 

```json
{
    "first_name" : "first_name_value", 
    "last_name" : "last_name_value",
    "email" : "email_value",
    "phone" : "phone_value"
}
```

Responese Body (Success) : 

```json
{
    "statusCode" : 201,
    "message" : "Create Contact Success", 
    "data" : {
        "id" : 1, 
        "first_name" : "first_name_value", 
        "last_name" : "last_name_value",
        "email" : "email_value",
        "phone" : "phone_value"
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

## Get Contact Detail

Endpoint : GET /api/contacts/v1/:contactId

Headers : 
- Authorization: token

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Get specific contact user success", 
    "data" : {
        "id" : 1, 
        "first_name" : "first_name_value", 
        "last_name" : "last_name_value",
        "email" : "email_value",
        "phone" : "phone_value"
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

## Update Contact

Endpoint : PUT /api/contacts/v1/:contactId

Headers : 
- Authorization: token

Request Body : 

```json
{
    "first_name" : "first_name_value", 
    "last_name" : "last_name_value",
    "email" : "email_value",
    "phone" : "phone_value"
}
```

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Update contact success", 
    "data" : {
        "id" : 1, 
        "first_name" : "first_name_value", 
        "last_name" : "last_name_value",
        "email" : "email_value",
        "phone" : "phone_value"
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

## Remove Contact
Endpoint : DELETE /api/contacts/v1/:contactId

Headers : 
- Authorization: token

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Remove contact success", 
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

## Search Contact
Endpoint : GET /api/contacts/v1

Headers : 
- Authorization: token

Query Params:
- Name : string, contact first name or last name, optional
- Phone : string, contact phone, optional
- Email : string, contact email, optional
- Page : number, default 1
- Size : number, default 10

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Success search contact", 
    "data" : [
        {
            "id" : 1, 
            "first_name" : "first_name_value", 
            "last_name" : "last_name_value",
            "email" : "email_value",
            "phone" : "phone_value"
        },
        {
            "id" : 2, 
            "first_name" : "first_name_value 2", 
            "last_name" : "last_name_value 2",
            "email" : "email_value 2",
            "phone" : "phone_value 2"
        }
    ],
    "paging" : {
        "current_page" : 1,
        "total_page" : 10,
        "size" : 2 
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


