# Payment Platform Microservices (Auth + Payments)

This project implements two backend services using **NestJS**:

- **Auth Service (Service A)**  
  Handles user registration, login, and JWT token validation.

- **Payment Service (Service B)**  
  Handles payment creation, status updates, provider webhooks, and enforces
  payment state transitions.

Both services are fully **dockerized**, run independently, and use **separate PostgreSQL databases**.



# How to Run the Project

## **1. Clone the repository**

```bash
git clone <git@github.com:BethMwangi/Operata.git>
cd <Operata>
```

## **2. Start all services using Docker Compose

```bash
docker compose up --build

```

- ## ** This will start:

1. auth-service on ``` http://localhost:3002 ```

2. payment-service on ``` http://localhost:4000```

3. auth-db (PostgreSQL)

4. payment-db (PostgreSQL)

5. API Documentation (Swagger)

Once the services are running:

#### Auth Service Docs

 ```http://localhost:3002/docs```
`
### Payment Service Docs

 ``` http://localhost:4000/docs```



###  Auth Service Endpoints
``` POST /api/auth/register```

###  Register a new user (phone, email, password).

```POST /api/auth/login```

###  Login using phone + password.
Returns a JWT access token.
``` GET /api/auth/validate```


Validate a JWT token (used internally by payment-service).

## **Payment Service Endpoints

All endpoints require Authorization: Bearer <token>
(Use the token returned from POST /auth/login)

``` POST /api/payments```

###  Create a payment (starts in INITIATED state).

```GET /api/payments/{reference}```

###  Fetch payment details by payment reference.
``` POST /api/payments/{reference}/status ```


###  Update payment status.
Valid transitions:

INITIATED → PENDING

PENDING → SUCCESS

PENDING → FAILED

Invalid transitions return 400 Bad Request.

```POST /api/payments/webhook/provider```

###  Simulates a provider webhook.
Includes idempotency handling by tracking webhookId.

###  Tools & Technologies Used

NestJS (TypeScript)
PostgreSQL (separate DB for each service)
JWT
bcrypt password hashing
Swagger (OpenAPI 3)
Docker
Docker Compose
TypeORM ORM
class-validator for DTO validation
Axios HTTP client for service-to-service authentication
In-memory token cache in payment-service