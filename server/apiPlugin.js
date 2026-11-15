import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  INITIAL_WORKS,
  INITIAL_BOOKS,
  INITIAL_USERS,
} from '../src/data/literaryData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, 'db');
const DB_FILE = path.join(DB_DIR, 'sahityakanon_db.json');

function getSeedData() {
  return {
    meta: {
      databaseName: 'SahityaKanon_DB',
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
    },
    users: INITIAL_USERS,
    works: INITIAL_WORKS.map((w) => ({ ...w, status: 'approved' })),
    books: INITIAL_BOOKS.map((b) => ({ ...b, inStock: true })),
    orders: [
      {
        orderId: 'SK-104829',
        date: '১৫ কার্তিক ১৪৩৩',
        customerName: 'তানভীর আহমেদ',
        phone: '01711223344',
        address: 'ধানমন্ডি, ঢাকা-১২০৫',
        paymentMethod: 'বিকাশ (bKash)',
        status: 'ডেলিভারি সম্পন্ন',
        items: [
          {
            id: 'book-1',
            title: 'রূপসী বাংলা ও বনলতা সেন সমগ্র',
            author: 'জীবনানন্দ দাশ',
            price: 320,
            quantity: 1,
          },
          {
            id: 'book-7',
            title: 'হলুদ খামের বিকেল ও অন্যান্য চিঠি',
            author: 'ফারহানা এলমা',
            price: 250,
            quantity: 1,
          },
        ],
        subtotal: 570,
        discountAmount: 0,
        deliveryCharge: 60,
        grandTotal: 630,
      },
    ],
  };
}

export function readDatabase() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getSeedData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...getSeedData(),
      ...parsed,
    };
  } catch (err) {
    console.error('Database read error, returning seed:', err);
    return getSeedData();
  }
}

export function writeDatabase(data) {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const updated = {
      ...data,
      meta: {
        ...(data.meta || {}),
        databaseName: 'SahityaKanon_DB',
        lastUpdated: new Date().toISOString(),
      },
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Database write error:', err);
    return data;
  }
}

function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify(payload));
}

export async function handleApiRequest(req, res, next) {
  if (!req.url || !req.url.startsWith('/api/')) {
    if (next) return next();
    return false;
  }

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return true;
  }

  const urlPath = req.url.split('?')[0];

  // GET /api/db -> Fetch entire database state
  if (req.method === 'GET' && urlPath === '/api/db') {
    const db = readDatabase();
    sendJson(res, 200, {
      ok: true,
      dbFile: 'server/db/sahityakanon_db.json',
      ...db,
    });
    return true;
  }

  // POST /api/db/sync -> Persist updated collections to disk database
  if (req.method === 'POST' && urlPath === '/api/db/sync') {
    const body = await parseJsonBody(req);
    const current = readDatabase();
    const updated = writeDatabase({
      ...current,
      users: Array.isArray(body.users) ? body.users : current.users,
      works: Array.isArray(body.works) ? body.works : current.works,
      books: Array.isArray(body.books) ? body.books : current.books,
      orders: Array.isArray(body.orders) ? body.orders : current.orders,
    });
    sendJson(res, 200, { ok: true, meta: updated.meta });
    return true;
  }

  // POST /api/db/reset -> Reset database to initial seed data
  if (req.method === 'POST' && urlPath === '/api/db/reset') {
    const seeded = writeDatabase(getSeedData());
    sendJson(res, 200, { ok: true, ...seeded });
    return true;
  }

  // POST /api/auth/login -> Authenticate user
  if (req.method === 'POST' && urlPath === '/api/auth/login') {
    const { email, password } = await parseJsonBody(req);
    const db = readDatabase();
    const found = db.users.find(
      (u) =>
        u.email.toLowerCase() === String(email || '').trim().toLowerCase() &&
        u.password === String(password || '')
    );
    if (!found) {
      sendJson(res, 401, {
        ok: false,
        message: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।',
      });
      return true;
    }
    const { password: _pwd, ...safeUser } = found;
    sendJson(res, 200, { ok: true, user: safeUser });
    return true;
  }

  // POST /api/auth/register -> Register new user in database
  if (req.method === 'POST' && urlPath === '/api/auth/register') {
    const { name, email, password, bio } = await parseJsonBody(req);
    const cleanEmail = String(email || '').trim().toLowerCase();
    if (!name || !cleanEmail || !password) {
      sendJson(res, 400, {
        ok: false,
        message: 'নাম, ইমেইল এবং পাসওয়ার্ড প্রদান করা আবশ্যক।',
      });
      return true;
    }
    const db = readDatabase();
    const exists = db.users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      sendJson(res, 409, {
        ok: false,
        message: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে।',
      });
      return true;
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: String(name).trim(),
      email: cleanEmail,
      password: String(password),
      role: 'writer',
      bio: String(bio || 'তরুণ লেখক ও সাহিত্যপ্রেমী').trim(),
      joinedDate: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
    const updatedDb = writeDatabase({
      ...db,
      users: [newUser, ...db.users],
    });
    const { password: _pwd, ...safeUser } = newUser;
    sendJson(res, 201, { ok: true, user: safeUser, users: updatedDb.users });
    return true;
  }

  sendJson(res, 404, { ok: false, message: 'API route not found' });
  return true;
}

export function sahityaDatabasePlugin() {
  // Initialize DB file on startup
  readDatabase();
  return {
    name: 'sahityakanon-database-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRequest(req, res, next);
      });
    },
  };
}

