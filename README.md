# Pow-er Tickets API

NestJS 10 backend for the Pow-er Tickets platform. Provides JWT authentication, event and ticket management, order processing with 10-minute checkout windows, payment capture, and sales reporting with CSV/PDF exports.

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL 15+

## Installation

```bash
npm install
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL credentials.

## Database

The API uses TypeORM with automatic schema synchronization in development. All entities from the Pow-er Tickets ERD are implemented, including users, organizers, events, ticket types and instances, orders, order lines, payment methods, payments, and reports.

## Running the app

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api` and Swagger documentation at `http://localhost:3000/api/docs`.

## Key Features

- **Authentication** – User registration and login with JWT Bearer tokens.
- **Organizer Verification (CU4)** – Admins can approve or reject organizer accounts.
- **Event Management** – Organizers create events with ticket types and automatic ticket instance generation.
- **Ticket Purchase (CU12)** – Buyers create orders that reserve tickets for 10 minutes. A scheduler automatically releases expired reservations. Payments finalize orders and issue tickets.
- **Ticket Validation** – Organizers validate ticket QR codes at the gate.
- **Sales Reports (CU16)** – Organizers retrieve aggregated sales data or download CSV/PDF reports. Files are stored locally using the path defined in `STORAGE_BASE_PATH`.

## Scripts

- `npm run start` – Start in production mode.
- `npm run start:dev` – Start with file watching.
- `npm run build` – Build the project.
- `npm run lint` – Run ESLint with auto-fix.

## Testing the flow

1. Register users via `/api/auth/register` and promote roles directly in the database if necessary.
2. Admin verifies organizers with `PATCH /api/organizers/:id/verify`.
3. Organizers create events and ticket types at `/api/events`.
4. Buyers create orders with `/api/orders` and finalize using `/api/payments`.
5. Organizers validate tickets at `/api/tickets/:qr/validate`.
6. Organizers fetch reports via `/api/reports/sales` or `/api/reports/sales/download`.

## Deployment

Deploy the project to Railway or Render using Node 18. Configure environment variables according to `.env.example`. Use `npm run start:prod` as the start command.
