-- SahityaKanon D1 Database Schema

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'writer',
  bio TEXT DEFAULT '',
  joined_date TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS works (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  author_id TEXT,
  author_email TEXT,
  author_role TEXT,
  category TEXT NOT NULL,
  recipient TEXT,
  location_date TEXT,
  book_price INTEGER,
  publisher TEXT,
  pages INTEGER,
  date TEXT,
  read_time TEXT,
  likes INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved',
  is_user_submitted INTEGER NOT NULL DEFAULT 0,
  tags_json TEXT NOT NULL DEFAULT '[]',
  cover_image TEXT,
  excerpt TEXT,
  content TEXT NOT NULL,
  comments_json TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  rating REAL NOT NULL DEFAULT 5.0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  publisher TEXT,
  pages INTEGER,
  edition TEXT,
  binding TEXT,
  badge TEXT,
  accent_color TEXT,
  cover_image TEXT,
  description TEXT,
  excerpt TEXT,
  in_stock INTEGER NOT NULL DEFAULT 1,
  is_user_submitted INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  date TEXT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  payment_method TEXT,
  status TEXT NOT NULL DEFAULT 'প্রক্রিয়াধীন',
  items_json TEXT NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL DEFAULT 0,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  delivery_charge INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

