# Exclusive — E-Commerce Platform

A modern full-stack e-commerce web app built with the **MERN Stack** (MongoDB, Express.js, React + Vite, Node.js).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router DOM |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| UI | Heroicons, Recharts, Axios |



## Quick Start


-- Pages & Features

**🏠 Home** — Hero banner with animated stats, category carousel, featured products grid, flash sale countdown, FAQ section, and newsletter signup

**📦 Products** — Full catalog with category, price & rating filters, sort options, search by name, discount toggle, and mobile filter drawer

**📄 Product Detail** — Image gallery, discount badge, stock status, color selector, quantity controls, add to cart, wishlist, related products, and recently viewed (localStorage)

**🛒 Cart** — Item management, quantity adjust, coupon code (SAVE10 = 10% off), price breakdown with shipping, and empty cart state

**🔐 Auth** — Login with validation, register with confirm password, JWT session management, protected routes

**👤 Profile** — User avatar with initials, account info, and link to order history

**📋 Orders** — Order list with status badges, dates, totals, and delivery tracking

---

## Admin Panel

**Dashboard** — Revenue & orders KPIs, 7-day revenue chart, recent orders table

**Products** — Full CRUD with image, name, description, category, price, and stock management

**Categories** — Add, edit, delete categories (protected if products exist), with product count display

**Orders** — View all orders with full details, mark as delivered

---

## Environment Setup

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/ecomm
JWT_SECRET=your-secret-key
NODE_ENV=development
```

---

```Setup 
npm install                    # Install all dependencies
npm start                      # Backend → http://localhost:5000
cd frontend && npm run dev     # Frontend → http://localhost:5173


✨ **Features**

- **Product Browsing** — Filters, search, sorting, detailed pages with gallery & reviews
- **Shopping Cart** — Add/remove, quantity adjust, coupon codes, real-time price calculation
- **Checkout & Orders** — Shipping address, order placement, history, delivery tracking
- **User Auth** — Register, login, profile, JWT session management
- **Admin Panel** — Full CRUD for products, categories & orders with analytics dashboard
- **Responsive Design** — Fully optimized for mobile and desktop
- **Dynamic Data** — All content fetched live from MongoDB via REST API