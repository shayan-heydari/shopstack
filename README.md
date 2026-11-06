# ShopStack

A multi-vendor marketplace I'm building to practice full-stack development
with the stack I use at work: React, Node.js/Express, and MongoDB.

**Status:** in development. The backend core (product catalog API + seed data)
is done; auth, cart, and the frontend are next.

## What it does (planned MVP)

- Buyers browse a product catalog: search, category / price filters, sorting, pagination
- Vendors manage their own products; admins can manage everything
- JWT login with three roles: buyer, vendor, admin
- Stats endpoint built on MongoDB aggregation pipelines
- Simple cart for logged-in buyers (demo checkout, no real payments)
- A Python script that imports products from a public practice API

## Tech stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React (Vite) — coming in a later session
- **Deploy plan:** GCP Cloud Run + MongoDB Atlas + Vercel

## Run the backend locally

```bash
cd server
npm install
cp .env.example .env   # then put your MongoDB connection string in .env
npm run seed           # fills the database with sample products
npm start              # API on http://localhost:5000
```

Try it:

```bash
curl "http://localhost:5000/api/products?q=shoes&maxPrice=100&sort=price&page=1"
```

## API so far

| Method | Endpoint | What it does |
|---|---|---|
| GET | /health | Health check |
| GET | /api/products | List products — `q`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit` |
| GET | /api/products/:id | One product |

## What I'd add next

- Register / login with JWT + role-based middleware
- Product create / edit / delete for vendors
- Stats endpoint (aggregations), cart endpoints
- React frontend, then deployment
