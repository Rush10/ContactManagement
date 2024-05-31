# User API Spec

## Register User

Endpoint : POST /api/users/v1/register

Request Body : 

```json
{
    "username" : "username_value", 
    "password" : "password_value", 
    "name" : "name_value"
}
```

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Register success", 
    "data" : {
        "username" : "username_value",
        "name" : "name_value"
    }
}
```

Responese Body (Failed) : 

```json
{
    "statusCode": 400,
    "message": "Validation Error",
    "errors": "Username already exist"
}
```

## Login User

Endpoint : POST /api/users/v1/login

Request Body : 

```json
{
    "username" : "username_value", 
    "password" : "password_value"
}
```

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Login success", 
    "data" : {
        "username" : "username_value",
        "name" : "name_value",
        "token" : "session_id_generated_value"
    }
}
```

Responese Body (Failed) : 

```json
{
    "statusCode": 401,
    "message": "Username or password is invalid",
    "errors": "Username or password is invalid"
}
```

## Get User

Endpoint : GET /api/users/v1/current

Headers : 
- Authorization: token

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Get current user success", 
    "data" : {
        "username" : "username_value",
        "name" : "name_value"
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

## Update User

Endpoint : PATCH /api/users/v1/current

Headers : 
- Authorization: token

Request Body : 

```json
{ 
    "name" : "name_value", //optional, if you want to change name
    "password" : "password_value" //optional, if you want to change password
}
```

Responese Body (Success) : 

```json
{
    "statusCode" : 200,
    "message" : "Update current user success", 
    "data" : {
        "username" : "username_value",
        "name" : "name_value"
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

## Logout User

Endpoint : DELETE /api/users/v1/current

Headers : 
- Authorization: token

Responese Body (Success) : 

```json
{
    "statusCode": 200,
    "message": "Logout success",
    "data": true
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


