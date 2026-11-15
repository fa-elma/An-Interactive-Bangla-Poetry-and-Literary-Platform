# SahityaKanon (সাহিত্যকানন) — An Interactive Bangla Poetry & Literary Platform

**SahityaKanon (সাহিত্যকানন)** is a full-stack Bangla literary publishing platform and online bookshop built with **React**, **Tailwind CSS**, **Cloudflare Workers**, and **Cloudflare D1 (SQLite)**.

Readers can explore Bangla poetry (*কবিতা*), epistolary letters (*পত্র/চিঠি*), short stories (*ছোটগল্প*), and book excerpts (*বই*), customize their reading experience, purchase books from the online bookstore, and—once logged in—submit their own literary works or publish books directly to the catalog. Administrators have a dedicated, role-protected Admin Dashboard to manage content, inventory, orders, and users.

- **Live Deployment:** https://an-interactive-bangla-poetry-and-literary-platform.fa-elma011.workers.dev
- **Repository:** https://github.com/fa-elma/An-Interactive-Bangla-Poetry-and-Literary-Platform

---

## Table of Contents

1. [Features](#features)
2. [Default Accounts & Admin Credentials](#default-accounts--admin-credentials)
3. [Typography & Design System](#typography--design-system)
4. [Tech Stack](#tech-stack)
5. [Project Architecture & Full Workflow](#project-architecture--full-workflow)
6. [Database Schema & API Endpoints](#database-schema--api-endpoints)
7. [Project Structure](#project-structure)
8. [Local Development & Deployment](#local-development--deployment)

---

## Features

### 1. Literary Reading Feed & Distraction-Free Reader
- **Category Filtering:** Browse all works or filter by *কবিতা* (Poetry), *পত্র ও চিঠি* (Letters), *ছোটগল্প* (Short Stories), and *বই ও পাণ্ডুলিপি* (Books & Manuscripts).
- **Search & Sorting:** Search by title, author name, body text, or hashtags (`#`), and sort by newest or most liked.
- **Customizable Reader Modal (`ReaderModal.jsx`):**
  - Adjustable Bangla font size (`অ-` / `অ+` from `15px` to `27px`).
  - Three reading themes: **Parchment (Sepia)**, **Light**, and **Dark**.
  - **Audio Recitation (`শ্রুতিপাঠ`):** Browser Web Speech API (`bn-BD`) read-aloud support.
  - **Epistolary Letter Styling:** Postmark stamp, recipient header, and ruled vintage paper styling for letters.
  - **Engagement:** Likes, personal reading bookmarks, quote copy/share, and live reader comments.

### 2. Authenticated Writing & Publishing (`SubmitWorkSection.jsx`)
- **Login Required to Post:** Public visitors can read all approved works and shop for books, while submitting new works requires authentication via the **Hamburger Menu (`☰`) → Login / Sign Up** or the submission gate.
- **Dynamic Category Fields:**
  - *পত্র (Letter):* Recipient name and postmark location/date.
  - *বই (Book):* Price (`৳`), genre, publisher, page count, and an option to automatically list the book in the **Bookshop** catalog upon publishing.
- **Instant Live Preview:** Real-time card preview alongside the submission editor, plus a one-click sample filler (`নমুনা লেখা দিয়ে ফর্ম পূরণ করুন`) for quick demonstrations.

### 3. Online Bookshop & Checkout (`BookShopSection.jsx`, `CartDrawer.jsx`, `OrdersModal.jsx`)
- **Catalog & Filters:** Search by title/author/publisher, filter by genre, and sort by price or rating.
- **Sample Excerpt Modal (`একটু পড়ুন`):** Preview book metadata and an excerpt before adding to cart.
- **Shopping Cart & Checkout:**
  - Quantity adjustments (`+` / `-`) and item removal.
  - Coupon support: `BOIMELA20` (20% off) and `SAHITYA10` (10% off).
  - Delivery zone calculation (Inside Dhaka `৳ 60` / Outside Dhaka `৳ 100`).
  - Payment options: Cash on Delivery, bKash, and Nagad, generating an instant order receipt and saving orders to D1.

### 4. Secured Admin Panel (`AdminDashboard.jsx`)
- **Role-Protected Access Gate:** Requires signing in with an account where `role === 'admin'`. Standard writer accounts are blocked from administrative access.
- **Content Moderation:** View all works, toggle **Featured** status (highlighted in the Hero section), **Approve/Hide** works, preview, or delete entries.
- **Bookstore Inventory:** Add new books directly to the store catalog or remove existing ones.
- **Order Management:** Update customer order statuses (`প্রক্রিয়াধীন`, `প্যাকেজিং চলছে`, `কুরিয়ারে পাঠানো হয়েছে`, `ডেলিভারি সম্পন্ন`, `বাতিল`) with live reflection in the customer order modal.
- **User Role Control:** Promote/demote users between `writer` and `admin`, or remove accounts.
- **Database Utilities:** Export the full database state as a JSON backup or reset to initial seed data.

---

## Default Accounts & Admin Credentials

The database is automatically seeded on first startup with the following accounts:

| Role | Name | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | ফারহানা এলমা (অ্যাডমিন) | `admin@sahityakanon.com` | `admin123` | Full Admin Dashboard, database controls, posting, bookshop |
| **Writer** | ফারহানা এলমা | `elma@sahityakanon.com` | `user123` | Submit poetry/letters/stories/books, delete own posts |
| **Writer** | আরিফ চৌধুরী | `arif@sahityakanon.com` | `user123` | Submit works, delete own posts |
| **Writer** | তানভীর আহমেদ | `tanvir@sahityakanon.com` | `user123` | Submit works, delete own posts |

> **Security Note:** Change the default admin password or remove demo seed users before using this platform for a real production audience.

---

## Typography & Design System

Configured in `index.html` (via Google Fonts) and `src/index.css`:

- **Main Font (Body):** `Hind Siliguri`
- **Heading Font (`h1`–`h6`, `.font-heading`):** `Anek Bangla`
- **Fallback Font:** `Noto Sans Bengali`, `sans-serif`
- **Palette:** Warm parchment background (`#FAF6F0`), literary crimson (`#9E2A2B`), antique gold (`#C89D54`), deep ink (`#1E1B18`), and teal accent (`#1F4E5B`).

---

## Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React (`lucide-react`)
- **Backend Runtime:** Cloudflare Workers (`worker/index.js`) with `@cloudflare/vite-plugin`
- **Database:** Cloudflare D1 (`sahityakanon-db`, SQLite) with automatic schema initialization and `localStorage` client caching/fallback
- **CI/CD & Hosting:** GitHub → Cloudflare Workers Builds (`npm run build` → `npx wrangler deploy`)

---

## Project Architecture & Full Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Browser (React 19 SPA)                          │
│  • Hero & Literary Feed   • ReaderModal   • Bookshop & CartDrawer       │
│  • AuthModal (Hamburger)  • SubmitWork    • AdminDashboard              │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
             Static Assets      │     API Requests (/api/*)
             (dist/client)      │     (run_worker_first: ["/api/*"])
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   Cloudflare Worker (worker/index.js)                   │
│  • GET  /api/db             → Fetch users, works, books, orders         │
│  • POST /api/db/sync        → Batch sync state changes to D1            │
│  • POST /api/db/reset       → Reset D1 tables to seed data              │
│  • POST /api/auth/login     → Verify email & password against D1        │
│  • POST /api/auth/register  → Create new writer account in D1           │
│  • Non-/api/* requests      → Served via env.ASSETS.fetch(request)      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                          env.DB Binding
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  Cloudflare D1 Database (sahityakanon-db)               │
│  Tables:  users  |  works  |  books  |  orders                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### End-to-End Application Flow

1. **Initial Boot & Data Hydration:**
   - On page load, `App.jsx` requests `GET /api/db`.
   - The Cloudflare Worker checks if the D1 tables (`users`, `works`, `books`, `orders`) exist and seeds initial literary works, books, users, and a sample order if empty.
   - Safe user profiles (excluding passwords) and collections are returned to the client and cached in `localStorage`.
2. **Reading & Reader Interactions:**
   - Visitors read works, adjust reader font/theme, listen via speech synthesis, bookmark works, like posts, or add comments.
   - Likes and comments update React state and sync to D1 via `POST /api/db/sync`.
3. **Authentication & Publishing Workflow:**
   - Opening **লেখা সাবমিট করুন** while logged out prompts the user to log in or register via **Hamburger Menu (`☰`)** or the submission gate.
   - `POST /api/auth/login` validates credentials against the D1 `users` table; `POST /api/auth/register` creates a new `writer` account in D1.
   - Once logged in, submitting a poem, letter, story, or book persists it to `works` (and optionally `books` if "list in bookshop" is checked) and syncs to D1.
4. **Book Purchasing Workflow:**
   - Users preview book excerpts, add books to `CartDrawer`, apply discount coupons (`BOIMELA20` / `SAHITYA10`), choose delivery zone and payment method, and place an order.
   - Orders are persisted to the D1 `orders` table and viewable under **অর্ডার** in the header and **বইয়ের অর্ডারসমূহ** in the Admin Dashboard.
5. **Admin Moderation Workflow:**
   - Navigating to **অ্যাডমিন প্যানেল** renders a dedicated login form unless logged in as an `admin`.
   - Changes to work visibility (`approved`/`hidden`), featured flag, bookstore inventory, order delivery statuses, and user roles sync directly to Cloudflare D1.
6. **GitHub → Cloudflare CI/CD Deployment Workflow:**
   - Every push to the `main` branch triggers Cloudflare Workers Builds (`npm run build` followed by `npx wrangler deploy`), bundling `dist/client` static assets and `worker/index.js` with the `DB` D1 binding.

---

## Database Schema & API Endpoints

### D1 Tables (`migrations/0001_init.sql`)
- **`users`**: `id`, `name`, `email` (unique), `password`, `role` (`admin` | `writer`), `bio`, `joined_date`
- **`works`**: `id`, `title`, `author`, `author_id`, `author_email`, `author_role`, `category`, `recipient`, `location_date`, `book_price`, `publisher`, `pages`, `date`, `read_time`, `likes`, `views`, `featured`, `status` (`approved` | `hidden`), `is_user_submitted`, `tags_json`, `cover_image`, `excerpt`, `content`, `comments_json`, `sort_order`
- **`books`**: `id`, `title`, `author`, `category`, `price`, `original_price`, `rating`, `reviews_count`, `publisher`, `pages`, `edition`, `binding`, `badge`, `accent_color`, `cover_image`, `description`, `excerpt`, `in_stock`, `is_user_submitted`, `sort_order`
- **`orders`**: `order_id`, `date`, `customer_name`, `phone`, `address`, `payment_method`, `status`, `items_json`, `subtotal`, `discount_amount`, `delivery_charge`, `grand_total`, `sort_order`

### Worker API Endpoints (`worker/index.js`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/db` | Initializes/seeds D1 if empty and returns `users`, `works`, `books`, `orders` |
| `POST` | `/api/db/sync` | Atomically syncs updated collections to D1 using `db.batch()` |
| `POST` | `/api/db/reset` | Resets all D1 tables back to the initial seed dataset |
| `POST` | `/api/auth/login` | Authenticates user email and password against D1 |
| `POST` | `/api/auth/register` | Registers a new `writer` user in D1 |

---

## Project Structure

```text
├── migrations/
│   └── 0001_init.sql              # D1 SQLite database schema
├── public/
│   └── favicon.svg                # Platform SVG icon
├── server/                        # Standalone local Node JSON fallback server
│   ├── apiPlugin.js
│   ├── index.js
│   └── db/sahityakanon_db.json
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx     # Secured admin gate + 4 management tabs
│   │   ├── AuthModal.jsx          # Login & registration modal
│   │   ├── BookShopSection.jsx    # Book catalog, filters & excerpt modal
│   │   ├── CartDrawer.jsx         # Cart, coupons, delivery & checkout
│   │   ├── Footer.jsx             # Footer & newsletter subscription
│   │   ├── HeroSection.jsx        # Hero banner & featured work spotlight
│   │   ├── Navbar.jsx             # Navigation, cart badge & hamburger menu
│   │   ├── OrdersModal.jsx        # Customer order status tracker
│   │   ├── ReaderModal.jsx        # Customizable reader + audio + comments
│   │   ├── SubmitWorkSection.jsx  # Authenticated submission form + live preview
│   │   └── WorkCard.jsx           # Poetry, letter, story & book cards
│   ├── data/
│   │   └── literaryData.js        # Initial works, books, users & Bangla helpers
│   ├── App.jsx                    # Root state, D1 sync & view switching
│   ├── index.css                  # Tailwind v4 + Bangla font & paper styles
│   └── main.jsx                   # React entry point
├── worker/
│   └── index.js                   # Cloudflare Worker API + D1 + asset handler
├── index.html                     # Google Fonts (Hind Siliguri, Anek Bangla, Noto Sans Bengali)
├── package.json
├── vite.config.js                 # Vite + React + Tailwind + @cloudflare/vite-plugin
└── wrangler.jsonc                 # Cloudflare Workers & D1 configuration
```

---

## Local Development & Deployment

### Prerequisites
- Node.js `>= 22.18`
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally (with Local Cloudflare Worker & D1 Simulation)
```bash
npm run dev
```
This runs Vite together with `@cloudflare/vite-plugin`, executing `worker/index.js` and a local Miniflare D1 database automatically.

### 3. Lint & Production Build
```bash
npm run lint
npm run build
```

### 4. Apply D1 Migrations & Deploy via Wrangler CLI (Optional Manual Deploy)
```bash
# Apply SQL schema to local or remote D1
npx wrangler d1 migrations apply sahityakanon-db --local
npx wrangler d1 migrations apply sahityakanon-db --remote

# Deploy Worker + Static Assets to Cloudflare
npx wrangler deploy
```

> **Note:** Since this repository is connected to **Cloudflare Workers Builds**, pushing to `main` automatically executes `npm run build` and `npx wrangler deploy`.
