# Services Documentation

## Architecture:
- NestJS microservices
- RabbitMQ messaging
- WebSockets
- REST APIs
- Prisma ORM

## Services connection map
* auth-service --> user-service
    register user

* session-service -->statistics-service
    session data aggregation

* session-service --> notification-service
    watering reminders


## List of Services

---

## auth-service

### Description

* Service responsible for authentication and JWT token lifecycle
* Handles login, registration, refresh tokens and logout
* Communicates with user-service to create users
* **PORT:** `3002`

### Endpoints

1. `/auth/login` — login user and return access token
2. `/auth/register` — register new user
3. `/auth/refresh` — refresh user access token
4. `/auth/logout` — logout user and invalidate tokens

---

## user-service

### Description

* Service responsible for managing user data
* Used internally by **auth-service** when registering users
* Provides user information retrieval
* **PORT:** `3001`


### Endpoints

1. `/user/create` — internal endpoint used by auth-service to create a new user
2. `/user/get/:id` — returns user information by id

---

## plant-service

### Description

* Service responsible for managing plants owned by users
* Handles plant creation and retrieving plants belonging to a user
* **PORT:** `3005`

### Endpoints

1. `/plant/create` — creates a new plant for a user
2. `/plant/get/:id` — returns all plants belonging to a specific user

---

## session-service

### Description

* Service responsible for plant watering sessions
* Tracks when a watering session starts and ends
* Sessions are created and controlled through WebSocket communication
* **PORT:** `3000`


### Endpoints

1. `/sessions/:id` — returns all sessions for a specific user

### WebSocket Events

1. `start` — starts a new watering session
2. `end` — ends an existing watering session
3. `test` — test websocket event

### Emitted Events

1. `sessionStarted` — emitted when a session starts
2. `sessionEnded` — emitted when a session ends

---

## statistics-service

### Description

* Service responsible for generating statistics related to user sessions
* Aggregates session data for analytics and dashboards
* **PORT:** `3003`

### Endpoints

1. `/statistics/:id` — returns aggregated statistics for a user

---

## notification-service

### Description

* Service responsible for sending email notifications to users
* Consumes events from the message broker
* Handles reminder and statistics emails
* **PORT:** `3007`

### Message Events

1. `missed-watering` — sends email when a user misses a watering day
2. `weekly-statistics` — sends weekly statistics email
