
# Group User Authentication

## Internal Auth [/internal/auth]

### POST 

Authenticates user using username and password.
Possible response codes:
- `202` success
- `401` invalid username or password

+ Request (application/json)
              
        {
            "email": "admin",
            "password": "admin"
        }
      
+ Response 202 (application/json)

        {
            "user": {
                "id": 1,
                "email": "admin",
                "name": "Main",
                "surname": "Admin",
                "group": "admin"
            }
        }

## Internal Auth Status [/internal/auth/status]

### GET

Check user auth status and return user data if user is logged in. 

Possible response codes:
- `202` user is logged in
- `405` user is a guest

+ Response 202 (application/json)

        {
            "user": {
                "id": 1,
                "email": "admin",
                "name": "Main",
                "surname": "Admin",
                "group": "admin"
            }
        }