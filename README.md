# E-Commerce Platform

A full-stack e-commerce application built with a backend-focused architecture using Node.js, Express, TypeScript,
PostgreSQL, Redis, and Stripe, with a modern Next.js frontend.

The platform covers the complete shopping flow from authentication and product discovery to cart management,
payments, order processing, stock synchronization, and administration.

## Key Features

### Authentication & Security

- User registration and login
- JWT access and refresh tokens
- Refresh-token rotation and revocation
- Role-based authorization
- Email verification
- Password recovery and reset
- Session invalidation after password changes
- Request validation with Zod
- API rate limiting
- Security headers with Helmet

### Product Catalog

- Product creation and management
- Product images with primary-image support
- Hierarchical categories
- Search and filtering
- Price filtering
- Availability filtering
- Sorting by price and creation date
- Pagination
- Category-based product discovery

### Cart & Orders

- Add, update, and remove cart items
- Stock validation before checkout
- Server-side order total validation
- Transactional order creation
- Atomic stock reduction and cart cleanup
- Automatic stock restoration when orders are cancelled
- Paginated order history

### Payments

- Stripe PaymentIntent integration
- Payment ownership validation
- Server-side payment status verification
- Validation of the paid amount against the current cart total
- Stripe webhook signature verification
- Payment success and failure handling

### Performance

- Redis caching for product queries
- Cached individual product responses
- Query-aware cache keys for filtered product lists
- Automatic cache invalidation after product changes
- Parallel database queries where appropriate

### API & Observability

- REST API organized by business modules
- Swagger API documentation
- Structured application logging with Winston
- HTTP request logging
- Centralized error handling
- Global and authentication-specific rate limits

## Architecture

The application is separated into independent frontend and backend applications.

```text
┌─────────────────────────────┐
│        Next.js Client       │
│                             │
│ TanStack Query · Zustand    │
└──────────────┬──────────────┘
               │ REST
               ▼
┌─────────────────────────────┐
│      Express REST API       │
│                             │
│ Auth · Products · Cart      │
│ Orders · Payments · Users   │
│ Categories · Cities         │
└───────┬─────────┬───────────┘
        │         │
        ▼         ▼
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │    Redis    │
│   Prisma    │  │    Cache    │
└─────────────┘  └─────────────┘
        │
        ▼
┌─────────────────────────────┐
│       External Services     │
│                             │
│     Stripe · Mailtrap       │
└─────────────────────────────┘
```

## Backend Design

The backend follows a modular structure where each business domain owns its routes, controllers, validation,
services, and related logic.

Main modules include:

- Authentication
- Users
- Products
- Categories
- Cart
- Orders
- Payments
- Cities

Shared infrastructure handles concerns such as caching, validation, pagination, filtering, logging,
email delivery, and error handling.

## Order Processing

Order creation is protected by server-side validation and database transactions.

Before an order is persisted, the backend:

1. Verifies the payment status.
2. Confirms that the payment belongs to the authenticated user.
3. Recalculates the cart total on the server.
4. Verifies that the paid amount matches the current cart value.
5. Rechecks current product stock.
6. Creates the order, updates inventory, and clears the cart inside one database transaction.

If the transaction fails, the order-related database changes are rolled back together.

Order cancellation restores the purchased quantities and updates the order status within another transaction.

## Caching Strategy

Redis is used with a cache-aside approach for frequently requested product data.

Product lists use cache keys based on:

- Page
- Page size
- Active filters
- Sorting options

Individual products are cached separately.

After product creation, update, or deletion, affected cache entries are invalidated so subsequent requests receive
fresh database data.

## Authentication Flow

Authentication uses short-lived JWT access tokens together with persistent refresh tokens.

- Access tokens expire after 15 minutes.
- Refresh tokens expire after 7 days.
- Refresh tokens are stored server-side.
- A used refresh token is revoked before a replacement is issued.
- Logout revokes the current refresh token.
- Logout from all devices revokes all active refresh tokens.
- Password reset invalidates existing sessions.

This provides session control without requiring long-lived access tokens.

## Tech Stack

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis / ioredis
- Stripe
- Zod
- JWT
- Winston
- Nodemailer / Mailtrap
- Swagger
- Helmet
- Vitest
- Supertest

### Frontend

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Stripe React
- Framer Motion
- Lucide React

## Project Structure

```text
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── *.prisma
│   │
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── modules/
│       │   ├── auth/
│       │   ├── cart/
│       │   ├── category/
│       │   ├── city/
│       │   ├── order/
│       │   ├── payment/
│       │   ├── product/
│       │   └── user/
│       ├── prisma/
│       ├── routes/
│       ├── shared/
│       │   ├── cache/
│       │   ├── email/
│       │   ├── errors/
│       │   ├── filters/
│       │   ├── logger/
│       │   ├── pagination/
│       │   └── validation/
│       ├── tests/
│       ├── app.ts
│       └── index.ts
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── services/
│   ├── store/
│   └── types/
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure the following services are available locally:

- Node.js
- PostgreSQL
- Redis
- Stripe test account
- Mailtrap account

### 1. Clone the Repository

```bash
git clone git@github.com:StoyanStoyanov1/E-Commerce-NodeJS-.git
cd E-Commerce-NodeJS-
```

## Backend Setup

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=4000

DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

JWT_SECRET="your_jwt_secret"

FRONTEND_URL="http://localhost:3000"

REDIS_HOST="127.0.0.1"
REDIS_PORT=6379

MAILTRAP_PASSWORD="your_mailtrap_password"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Initialize the Database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the Backend

```bash
npm run dev
```

The REST API will be available under:

```text
http://localhost:4000/api
```

Swagger documentation:

```text
http://localhost:4000/api-docs
```

## Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

Start the frontend:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## API Areas

The backend exposes REST endpoints under `/api` for:

```text
/api/auth
/api/users
/api/categories
/api/products
/api/cart
/api/orders
/api/cities
/api/payments
```

## Testing

Backend integration tests are written with Vitest and Supertest.

Current test areas include:

- Authentication
- Cart
- Categories
- Products
- Orders

Run the test suite:

```bash
cd backend
npm test
```

Watch mode:

```bash
npm run test:watch
```

Coverage:

```bash
npm run test:coverage
```

## Available Scripts

### Backend

```bash
npm run dev
npm run build
npm start
npm test
npm run test:watch
npm run test:coverage
```

### Frontend

```bash
npm run dev
npm run build
npm start
npm run lint
```

## License

This project is licensed under the ISC License.
