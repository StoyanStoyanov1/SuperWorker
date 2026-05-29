# SuperWorker - Modern E-Commerce Platform

This is a full-featured modern e-commerce platform built with **Node.js/Express** for the backend and **Next.js** for the frontend. The project includes hierarchical categories, advanced product filtering, Stripe payment integration, cart management, and an admin panel.

## 🚀 Tech Stack

### Backend
- **Node.js & Express** - Server environment and application framework.
- **TypeScript** - Static typing for safer code.
- **Prisma ORM** - Database management (PostgreSQL/MySQL).
- **Redis** - Data caching for higher performance.
- **Stripe API** - Secure payment processing.
- **Zod** - Data validation.
- **Mailtrap** - Email sending simulation.
- **Vitest** - Testing.

### Frontend
- **Next.js 15 (App Router)** - React framework for the modern web.
- **TanStack Query (React Query)** - Server state management and caching.
- **Zustand** - Lightweight local state management.
- **Tailwind CSS & Shadcn/UI** - Modern and responsive design.
- **React Hook Form & Zod** - Form management and validation.
- **Lucide React** - Icon set.

---

## ✨ Key Features

- **Authentication & Authorization:** Registration, login, protected routes, and roles (User/Admin).
- **Product Catalog:**
  - Real-time search.
  - Hierarchical filtering by categories.
  - Filtering by price and availability.
  - Sorting by price and date.
- **Cart:** Add, remove, and change quantity with automatic synchronization and stock check.
- **Payments:** **Stripe** integration for a secure checkout process.
- **Admin Panel:** Category hierarchy management (CRUD operations).
- **Stock Management:** Automatic stock reduction on order and restoration on cancellation.
- **Caching:** Optimized speed through Redis.

---

## 🛠️ Installation and Setup

### Initial Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd E-Commerce-NodeJS-
   ```

### Backend Setup
1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the template:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://user:password@localhost:5432/db_name"
   JWT_SECRET="your_jwt_secret"
   MAILTRAP_PASSWORD="your_mailtrap_password"
   FRONTEND_URL="http://localhost:5173"
   REDIS_HOST="127.0.0.1"
   REDIS_PORT=6379
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```
4. Run Prisma migrations and seeding:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Go to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
4. Start the application:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
├── backend/
│   ├── prisma/             # DB schema and migrations
│   ├── src/
│   │   ├── modules/        # Modular business logic (Auth, Order, Product, etc.)
│   │   ├── shared/         # Shared services (Cache, Email, Logger)
│   │   ├── middleware/     # Auth, Error handling, Rate limiting
│   │   └── config/         # Configuration files
│   └── tests/              # Tests
├── frontend/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   ├── components/         # UI components
│   ├── services/           # API communication
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript definitions
└── README.md
```

---

## 🧪 Testing
To run tests in the backend:
```bash
cd backend
npm test
```

---

## 📝 License
This project is open-source and distributed under the **ISC** license.
