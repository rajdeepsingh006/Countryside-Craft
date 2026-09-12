# Countryside Craft — Printed Tote Bag Store

MERN Stack monorepo — storefront, admin panel, and backend API.

## Structure
```
/client   → Customer-facing React storefront (Vite)
/admin    → Admin panel React app (Vite)
/server   → Express REST API (Node.js)
```

## Getting Started

### 1. Setup environment variables
Copy `.env.example` to `.env` in the `server/` folder and fill in your credentials.

### 2. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

### 3. Run development servers
```bash
# Backend
cd server && npm run dev

# Storefront
cd client && npm run dev

# Admin panel
cd admin && npm run dev
```

### 4. Seed the database (first run only)
```bash
cd server && npm run seed
```
