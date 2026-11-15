import {
  INITIAL_WORKS,
  INITIAL_BOOKS,
  INITIAL_USERS,
} from '../src/data/literaryData.js';

const DEFAULT_ORDERS = [
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
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function safeJsonParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

async function ensureSchema(db) {
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'writer',
      bio TEXT DEFAULT '',
      joined_date TEXT DEFAULT ''
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS works (
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
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS books (
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
    )`),
    db.prepare(`CREATE TABLE IF NOT EXISTS orders (
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
    )`),
  ]);
}

function buildWorkInsertStmt(db, w, index) {
  return db
    .prepare(
      `INSERT INTO works (
        id, title, author, author_id, author_email, author_role, category,
        recipient, location_date, book_price, publisher, pages, date, read_time,
        likes, views, featured, status, is_user_submitted, tags_json, cover_image,
        excerpt, content, comments_json, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      String(w.id),
      String(w.title || ''),
      String(w.author || ''),
      w.authorId ?? null,
      w.authorEmail ?? null,
      w.authorRole ?? null,
      String(w.category || 'কবিতা'),
      w.recipient ?? null,
      w.locationDate ?? null,
      w.bookPrice !== undefined && w.bookPrice !== null ? Number(w.bookPrice) : null,
      w.publisher ?? null,
      w.pages !== undefined && w.pages !== null ? Number(w.pages) : null,
      w.date ?? null,
      w.readTime ?? null,
      Number(w.likes || 0),
      Number(w.views || 0),
      w.featured ? 1 : 0,
      w.status || 'approved',
      w.isUserSubmitted ? 1 : 0,
      JSON.stringify(Array.isArray(w.tags) ? w.tags : []),
      w.coverImage ?? null,
      w.excerpt ?? null,
      String(w.content || ''),
      JSON.stringify(Array.isArray(w.comments) ? w.comments : []),
      index
    );
}

function buildBookInsertStmt(db, b, index) {
  return db
    .prepare(
      `INSERT INTO books (
        id, title, author, category, price, original_price, rating, reviews_count,
        publisher, pages, edition, binding, badge, accent_color, cover_image,
        description, excerpt, in_stock, is_user_submitted, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      String(b.id),
      String(b.title || ''),
      String(b.author || ''),
      String(b.category || 'কাব্যগ্রন্থ'),
      Number(b.price || 0),
      b.originalPrice !== undefined && b.originalPrice !== null ? Number(b.originalPrice) : null,
      Number(b.rating ?? 5.0),
      Number(b.reviewsCount ?? 0),
      b.publisher ?? null,
      b.pages !== undefined && b.pages !== null ? Number(b.pages) : null,
      b.edition ?? null,
      b.binding ?? null,
      b.badge ?? null,
      b.accentColor ?? null,
      b.coverImage ?? null,
      b.description ?? null,
      b.excerpt ?? null,
      b.inStock === false ? 0 : 1,
      b.isUserSubmitted ? 1 : 0,
      index
    );
}

function buildOrderInsertStmt(db, o, index) {
  return db
    .prepare(
      `INSERT INTO orders (
        order_id, date, customer_name, phone, address, payment_method, status,
        items_json, subtotal, discount_amount, delivery_charge, grand_total, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      String(o.orderId),
      o.date ?? null,
      String(o.customerName || ''),
      String(o.phone || ''),
      String(o.address || ''),
      o.paymentMethod ?? null,
      o.status || 'প্রক্রিয়াধীন',
      JSON.stringify(Array.isArray(o.items) ? o.items : []),
      Number(o.subtotal || 0),
      Number(o.discountAmount || 0),
      Number(o.deliveryCharge || 0),
      Number(o.grandTotal || 0),
      index
    );
}

async function seedIfEmpty(db, forceReset = false) {
  await ensureSchema(db);
  if (forceReset) {
    const stmts = [
      db.prepare('DELETE FROM users'),
      db.prepare('DELETE FROM works'),
      db.prepare('DELETE FROM books'),
      db.prepare('DELETE FROM orders'),
      ...INITIAL_USERS.map((u) =>
        db
          .prepare(
            'INSERT INTO users (id, name, email, password, role, bio, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(u.id, u.name, u.email.toLowerCase(), u.password, u.role, u.bio || '', u.joinedDate || '')
      ),
      ...INITIAL_WORKS.map((w, i) => buildWorkInsertStmt(db, { ...w, status: 'approved' }, i)),
      ...INITIAL_BOOKS.map((b, i) => buildBookInsertStmt(db, { ...b, inStock: true }, i)),
      ...DEFAULT_ORDERS.map((o, i) => buildOrderInsertStmt(db, o, i)),
    ];
    await db.batch(stmts);
    return;
  }

  const countRow = await db.prepare('SELECT COUNT(*) AS cnt FROM users').first();
  if (!countRow || countRow.cnt === 0) {
    const stmts = [
      ...INITIAL_USERS.map((u) =>
        db
          .prepare(
            'INSERT OR IGNORE INTO users (id, name, email, password, role, bio, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(u.id, u.name, u.email.toLowerCase(), u.password, u.role, u.bio || '', u.joinedDate || '')
      ),
      ...INITIAL_WORKS.map((w, i) => buildWorkInsertStmt(db, { ...w, status: 'approved' }, i)),
      ...INITIAL_BOOKS.map((b, i) => buildBookInsertStmt(db, { ...b, inStock: true }, i)),
      ...DEFAULT_ORDERS.map((o, i) => buildOrderInsertStmt(db, o, i)),
    ];
    await db.batch(stmts);
  }
}

async function fetchAllFromDb(db) {
  await seedIfEmpty(db, false);
  const [usersRes, worksRes, booksRes, ordersRes] = await db.batch([
    db.prepare('SELECT id, name, email, role, bio, joined_date FROM users'),
    db.prepare('SELECT * FROM works ORDER BY sort_order ASC'),
    db.prepare('SELECT * FROM books ORDER BY sort_order ASC'),
    db.prepare('SELECT * FROM orders ORDER BY sort_order ASC'),
  ]);

  const users = (usersRes.results || []).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    bio: u.bio,
    joinedDate: u.joined_date,
  }));

  const works = (worksRes.results || []).map((w) => ({
    id: w.id,
    title: w.title,
    author: w.author,
    authorId: w.author_id || undefined,
    authorEmail: w.author_email || undefined,
    authorRole: w.author_role || undefined,
    category: w.category,
    recipient: w.recipient || undefined,
    locationDate: w.location_date || undefined,
    bookPrice: w.book_price !== null ? w.book_price : undefined,
    publisher: w.publisher || undefined,
    pages: w.pages !== null ? w.pages : undefined,
    date: w.date || undefined,
    readTime: w.read_time || undefined,
    likes: w.likes,
    views: w.views,
    featured: Boolean(w.featured),
    status: w.status || 'approved',
    isUserSubmitted: Boolean(w.is_user_submitted),
    tags: safeJsonParse(w.tags_json, []),
    coverImage: w.cover_image || undefined,
    excerpt: w.excerpt || undefined,
    content: w.content,
    comments: safeJsonParse(w.comments_json, []),
  }));

  const books = (booksRes.results || []).map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    category: b.category,
    price: b.price,
    originalPrice: b.original_price !== null ? b.original_price : undefined,
    rating: b.rating,
    reviewsCount: b.reviews_count,
    publisher: b.publisher || undefined,
    pages: b.pages !== null ? b.pages : undefined,
    edition: b.edition || undefined,
    binding: b.binding || undefined,
    badge: b.badge || undefined,
    accentColor: b.accent_color || undefined,
    coverImage: b.cover_image || undefined,
    description: b.description || undefined,
    excerpt: b.excerpt || undefined,
    inStock: Boolean(b.in_stock),
    isUserSubmitted: Boolean(b.is_user_submitted),
  }));

  const orders = (ordersRes.results || []).map((o) => ({
    orderId: o.order_id,
    date: o.date || undefined,
    customerName: o.customer_name,
    phone: o.phone,
    address: o.address,
    paymentMethod: o.payment_method || undefined,
    status: o.status || 'প্রক্রিয়াধীন',
    items: safeJsonParse(o.items_json, []),
    subtotal: o.subtotal,
    discountAmount: o.discount_amount,
    deliveryCharge: o.delivery_charge,
    grandTotal: o.grand_total,
  }));

  return { users, works, books, orders };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (!pathname.startsWith('/api/')) {
      return env.ASSETS.fetch(request);
    }

    try {
      const db = env.DB;
      if (!db) {
        return jsonResponse(
          { ok: false, message: 'D1 database binding (DB) is not configured.' },
          500
        );
      }

      if (request.method === 'GET' && pathname === '/api/db') {
        const data = await fetchAllFromDb(db);
        return jsonResponse({
          ok: true,
          provider: 'Cloudflare D1',
          database: 'sahityakanon-db',
          ...data,
        });
      }

      if (request.method === 'POST' && pathname === '/api/db/sync') {
        await seedIfEmpty(db, false);
        const body = await request.json().catch(() => ({}));
        const stmts = [];

        if (Array.isArray(body.users)) {
          const existingUsers = await db
            .prepare('SELECT id, password FROM users')
            .all();
          const pwdMap = new Map(
            (existingUsers.results || []).map((u) => [u.id, u.password])
          );
          stmts.push(db.prepare('DELETE FROM users'));
          for (const u of body.users) {
            const preservedPwd =
              u.password || pwdMap.get(u.id) || 'user123';
            stmts.push(
              db
                .prepare(
                  'INSERT INTO users (id, name, email, password, role, bio, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
                )
                .bind(
                  String(u.id),
                  String(u.name || ''),
                  String(u.email || '').toLowerCase(),
                  String(preservedPwd),
                  String(u.role || 'writer'),
                  String(u.bio || ''),
                  String(u.joinedDate || '')
                )
            );
          }
        }

        if (Array.isArray(body.works)) {
          stmts.push(db.prepare('DELETE FROM works'));
          body.works.forEach((w, i) => {
            stmts.push(buildWorkInsertStmt(db, w, i));
          });
        }

        if (Array.isArray(body.books)) {
          stmts.push(db.prepare('DELETE FROM books'));
          body.books.forEach((b, i) => {
            stmts.push(buildBookInsertStmt(db, b, i));
          });
        }

        if (Array.isArray(body.orders)) {
          stmts.push(db.prepare('DELETE FROM orders'));
          body.orders.forEach((o, i) => {
            stmts.push(buildOrderInsertStmt(db, o, i));
          });
        }

        if (stmts.length > 0) {
          await db.batch(stmts);
        }

        return jsonResponse({
          ok: true,
          meta: {
            databaseName: 'sahityakanon-db',
            lastUpdated: new Date().toISOString(),
          },
        });
      }

      if (request.method === 'POST' && pathname === '/api/db/reset') {
        await seedIfEmpty(db, true);
        const data = await fetchAllFromDb(db);
        return jsonResponse({ ok: true, ...data });
      }

      if (request.method === 'POST' && pathname === '/api/auth/login') {
        await seedIfEmpty(db, false);
        const { email, password } = await request.json().catch(() => ({}));
        const cleanEmail = String(email || '').trim().toLowerCase();
        const found = await db
          .prepare('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?')
          .bind(cleanEmail, String(password || ''))
          .first();

        if (!found) {
          return jsonResponse(
            {
              ok: false,
              message:
                'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।',
            },
            401
          );
        }

        return jsonResponse({
          ok: true,
          user: {
            id: found.id,
            name: found.name,
            email: found.email,
            role: found.role,
            bio: found.bio,
            joinedDate: found.joined_date,
          },
        });
      }

      if (request.method === 'POST' && pathname === '/api/auth/register') {
        await seedIfEmpty(db, false);
        const { name, email, password, bio } = await request
          .json()
          .catch(() => ({}));
        const cleanEmail = String(email || '').trim().toLowerCase();

        if (!name || !cleanEmail || !password) {
          return jsonResponse(
            {
              ok: false,
              message: 'নাম, ইমেইল এবং পাসওয়ার্ড প্রদান করা আবশ্যক।',
            },
            400
          );
        }

        const exists = await db
          .prepare('SELECT id FROM users WHERE LOWER(email) = ?')
          .bind(cleanEmail)
          .first();

        if (exists) {
          return jsonResponse(
            {
              ok: false,
              message: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে।',
            },
            409
          );
        }

        const newUser = {
          id: `user-${Date.now()}`,
          name: String(name).trim(),
          email: cleanEmail,
          role: 'writer',
          bio: String(bio || 'তরুণ লেখক ও সাহিত্যপ্রেমী').trim(),
          joinedDate: new Date().toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        };

        await db
          .prepare(
            'INSERT INTO users (id, name, email, password, role, bio, joined_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
          )
          .bind(
            newUser.id,
            newUser.name,
            newUser.email,
            String(password),
            newUser.role,
            newUser.bio,
            newUser.joinedDate
          )
          .run();

        const data = await fetchAllFromDb(db);
        return jsonResponse({ ok: true, user: newUser, users: data.users }, 201);
      }

      return jsonResponse({ ok: false, message: 'API route not found' }, 404);
    } catch (error) {
      console.error(
        JSON.stringify({
          level: 'error',
          path: pathname,
          message: error?.message || 'Internal Worker Error',
        })
      );
      return jsonResponse(
        {
          ok: false,
          message: 'সার্ভার ডাটাবেসে সমস্যা হয়েছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
        },
        500
      );
    }
  },
};
