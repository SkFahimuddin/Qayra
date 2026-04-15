# ITAR — Arabian Perfumes E-Commerce

A full-stack luxury Arabic perfume store. Gold on black aesthetic. Built with Node.js + Express + MongoDB + React.

## Features
- 🛍️ **Shop** — Browse Attar, Oud & Bakhoor, Gift Sets, Accessories
- 🔍 **Search** — Full-text search across products
- ❤️ **Wishlist** — Save favorite fragrances
- ⭐ **Reviews** — Star ratings and written reviews per product
- 🏷️ **Coupons** — Percentage or fixed discount codes at checkout
- 🛒 **Cart + Checkout** — Persistent cart, coupon field, international shipping
- 📦 **Order History** — Track all your orders
- 🔐 **Admin Panel** — Products, Orders, Customers, Coupons management

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit with your MongoDB URI
npm run dev            # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start              # http://localhost:3000
```

### Default Admin
- **Email:** admin@itar.com
- **Password:** Admin@123
- Logs in → redirected to `/admin` automatically

## Sample Data
6 sample products are auto-seeded on first run:
- Oud Al Layl (Oud & Bakhoor)
- Rose Taifi (Attar)
- Musk Al Haramain (Attar)
- Bakhoor Malaki (Oud & Bakhoor)
- Amber Oud Gift Set (Gift Sets)
- Crystal Attar Bottle (Accessories)

## Project Structure
```
itar-perfume/
├── backend/
│   ├── models/          User, Product, Order, Review, Coupon
│   ├── routes/          auth, products, cart, orders, wishlist, reviews, coupons, admin
│   ├── middleware/       auth.js (JWT + adminOnly)
│   └── server.js
└── frontend/src/
    ├── context/          AuthContext, CartContext, WishlistContext
    ├── components/       Navbar, Footer, ProductCard
    └── pages/
        ├── Home, Shop, ProductDetail, Cart, Checkout, Orders, Wishlist
        ├── Login, Register
        └── admin/        Dashboard, Products, Orders, Users, Coupons
```


just commit
