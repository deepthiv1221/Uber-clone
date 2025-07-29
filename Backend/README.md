# User Registration Endpoint Documentation

## POST `/users/register`

Registers a new user in the system.

### Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "yourpassword"
}
```

#### Field Requirements

- `fullname`: **object** (required)
  - `firstname`: **string**, minimum 3 characters (required)
  - `lastname`: **string**, minimum 3 characters (required)
- `email`: **string**, must be a valid email address (required)
- `password`: **string**, minimum 6 characters (required)

### Responses

| Status Code | Description                                    |
|-------------|------------------------------------------------|
| 201         | User registered successfully. Returns JWT token and user object. |
| 400         | Validation error. Returns details of missing or invalid fields. |

#### Example Success Response (`201`)

```json
{
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // other user fields
  }
}
```

#### Example Error Response (`400`)

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}
```
### Example response 


---

**Note:** All fields are required. The `fullname` field must be an object containing both