import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Sparkles,
  Feather,
  Mail,
  BookOpen,
  Library,
  Bookmark,
  ShoppingBag,
  PenTool,
  ArrowRight,
  Users,
  X,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import WorkCard from './components/WorkCard';
import ReaderModal from './components/ReaderModal';
import SubmitWorkSection from './components/SubmitWorkSection';
import BookShopSection from './components/BookShopSection';
import CartDrawer from './components/CartDrawer';
import OrdersModal from './components/OrdersModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import {
  INITIAL_WORKS,
  INITIAL_BOOKS,
  INITIAL_USERS,
  FEATURED_AUTHORS,
  toBanglaNumber,
} from './data/literaryData';

export default function App() {
  // Core Database Collections State (Synced with Backend /api/db + localStorage)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_users_v1');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [works, setWorks] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_works_v1');
      return saved ? JSON.parse(saved) : INITIAL_WORKS;
    } catch {
      return INITIAL_WORKS;
    }
  });

  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_books_v1');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_orders_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_current_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_bookmarks_v1');
      return saved ? JSON.parse(saved) : ['work-1', 'work-2'];
    } catch {
      return ['work-1', 'work-2'];
    }
  });

  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('sahityakanon_likes_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Backend DB Connection Status
  const [dbConnected, setDbConnected] = useState(false);
  const initialLoadCompleted = useRef(false);
  const skipNextSyncRef = useRef(false);

  // UI Navigation & Filter State
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'bookshop' | 'submit' | 'bookmarks' | 'admin'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'newest'
  const [readingWorkId, setReadingWorkId] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authReasonMessage, setAuthReasonMessage] = useState('');

  // 1. Initial Load from Backend Database Server (/api/db)
  useEffect(() => {
    let mounted = true;
    fetch('/api/db')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!mounted || !data.ok) return;
        skipNextSyncRef.current = true;
        if (Array.isArray(data.users) && data.users.length > 0) setUsers(data.users);
        if (Array.isArray(data.works) && data.works.length > 0) setWorks(data.works);
        if (Array.isArray(data.books) && data.books.length > 0) setBooks(data.books);
        if (Array.isArray(data.orders)) setOrders(data.orders);
        setDbConnected(true);
        initialLoadCompleted.current = true;
      })
      .catch(() => {
        initialLoadCompleted.current = true;
      });
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Sync Database Collections to Backend (/api/db/sync) & localStorage
  useEffect(() => {
    localStorage.setItem('sahityakanon_users_v1', JSON.stringify(users));
    localStorage.setItem('sahityakanon_works_v1', JSON.stringify(works));
    localStorage.setItem('sahityakanon_books_v1', JSON.stringify(books));
    localStorage.setItem('sahityakanon_orders_v1', JSON.stringify(orders));

    if (!initialLoadCompleted.current) return;
    if (skipNextSyncRef.current) {
      skipNextSyncRef.current = false;
      return;
    }
    fetch('/api/db/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users, works, books, orders }),
    })
      .then((r) => {
        if (r.ok) setDbConnected(true);
      })
      .catch(() => {});
  }, [users, works, books, orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        'sahityakanon_current_user_v1',
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem('sahityakanon_current_user_v1');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sahityakanon_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sahityakanon_bookmarks_v1', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('sahityakanon_likes_v1', JSON.stringify(likedIds));
  }, [likedIds]);

  // Authentication Handlers
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        return { ok: true, user: data.user };
      }
    } catch {
      // Fallback to local users array if offline
    }

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === String(email || '').trim().toLowerCase() &&
        u.password === String(password || '')
    );
    if (!found) {
      return {
        ok: false,
        message: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে আবার চেষ্টা করুন।',
      };
    }
    const { password: _pwd, ...safeUser } = found;
    setCurrentUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const handleAdminLogin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user?.role !== 'admin') {
          return {
            ok: false,
            message:
              'প্রবেশাধিকার সংরক্ষিত: এই অ্যাকাউন্টের অ্যাডমিন প্যানেলে প্রবেশের অনুমতি নেই।',
          };
        }
        setCurrentUser(data.user);
        return { ok: true, user: data.user };
      }
    } catch {
      // Fallback to local users array if offline
    }

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === String(email || '').trim().toLowerCase() &&
        u.password === String(password || '')
    );
    if (!found) {
      return {
        ok: false,
        message: 'অ্যাডমিন ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।',
      };
    }
    if (found.role !== 'admin') {
      return {
        ok: false,
        message:
          'প্রবেশাধিকার সংরক্ষিত: এই অ্যাকাউন্টের অ্যাডমিন প্যানেলে প্রবেশের অনুমতি নেই।',
      };
    }
    const { password: _pwd, ...safeUser } = found;
    setCurrentUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const handleRegister = async ({ name, email, password, bio }) => {
    const cleanEmail = String(email || '').trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: cleanEmail, password, bio }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (Array.isArray(data.users)) setUsers(data.users);
        setCurrentUser(data.user);
        return { ok: true, user: data.user };
      }
      if (!res.ok && data.message) {
        return { ok: false, message: data.message };
      }
    } catch {
      // Fallback to local registration
    }

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        ok: false,
        message: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট খোলা হয়েছে।',
      };
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
    setUsers((prev) => [newUser, ...prev]);
    const { password: _pwd, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (activeTab === 'admin') {
      setActiveTab('explore');
    }
  };

  const openAuthModal = (mode = 'login', reason = '') => {
    setAuthModalMode(mode);
    setAuthReasonMessage(reason);
    setIsAuthModalOpen(true);
  };

  // Visible public works (exclude works hidden by Admin)
  const visibleWorks = useMemo(
    () => works.filter((w) => w.status !== 'hidden'),
    [works]
  );

  // Derived values
  const activeReadingWork = useMemo(
    () => works.find((w) => w.id === readingWorkId) || null,
    [works, readingWorkId]
  );

  const featuredWork = useMemo(
    () => visibleWorks.find((w) => w.featured) || visibleWorks[0],
    [visibleWorks]
  );

  const filteredWorks = useMemo(() => {
    let list = visibleWorks.filter((w) => {
      const matchesCat =
        selectedCategory === 'all' || w.category === selectedCategory;
      const matchesAuthor =
        !authorFilter || w.author.toLowerCase().includes(authorFilter.toLowerCase());
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.author.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q) ||
        (w.tags && w.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesCat && matchesAuthor && matchesSearch;
    });

    if (sortBy === 'popular') {
      list = [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return list;
  }, [visibleWorks, selectedCategory, authorFilter, searchQuery, sortBy]);

  const bookmarkedWorks = useMemo(
    () => visibleWorks.filter((w) => bookmarks.includes(w.id)),
    [visibleWorks, bookmarks]
  );

  // Handlers for Works
  const handleToggleLike = (workId) => {
    const alreadyLiked = likedIds.includes(workId);
    setLikedIds((prev) =>
      alreadyLiked ? prev.filter((id) => id !== workId) : [...prev, workId]
    );
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workId
          ? { ...w, likes: Math.max(0, (w.likes || 0) + (alreadyLiked ? -1 : 1)) }
          : w
      )
    );
  };

  const handleToggleBookmark = (workId) => {
    setBookmarks((prev) =>
      prev.includes(workId)
        ? prev.filter((id) => id !== workId)
        : [...prev, workId]
    );
  };

  const handleAddComment = (workId, newComment) => {
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workId
          ? { ...w, comments: [newComment, ...(w.comments || [])] }
          : w
      )
    );
  };

  const handleAddWork = (newWork) => {
    setWorks((prev) => [newWork, ...prev]);
  };

  const handleDeleteWork = (workId) => {
    setWorks((prev) => prev.filter((w) => w.id !== workId));
  };

  // Admin Handlers
  const handleToggleFeaturedWork = (workId) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === workId ? { ...w, featured: !w.featured } : w))
    );
  };

  const handleToggleApproveWork = (workId) => {
    setWorks((prev) =>
      prev.map((w) =>
        w.id === workId
          ? { ...w, status: w.status === 'hidden' ? 'approved' : 'hidden' }
          : w
      )
    );
  };

  const handleAddBook = (newBook) => {
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleDeleteBook = (bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId ? { ...o, status: newStatus } : o
      )
    );
  };

  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
  };

  const handleToggleUserRole = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: u.role === 'admin' ? 'writer' : 'admin' }
          : u
      )
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleResetDatabase = async () => {
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || INITIAL_USERS);
        setWorks(data.works || INITIAL_WORKS);
        setBooks(data.books || INITIAL_BOOKS);
        setOrders(data.orders || []);
        return;
      }
    } catch {
      // Fallback local reset
    }
    setUsers(INITIAL_USERS);
    setWorks(INITIAL_WORKS);
    setBooks(INITIAL_BOOKS);
    setOrders([]);
  };

  // Handlers for Book Cart
  const handleAddToCart = (book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (bookId, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(bookId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === bookId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveCartItem = (bookId) => {
    setCart((prev) => prev.filter((item) => item.id !== bookId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (orderData) => {
    setOrders((prev) => [{ ...orderData, status: 'প্রক্রিয়াধীন' }, ...prev]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const categoryTabs = [
    { id: 'all', label: 'সকল রচনা', icon: Sparkles, count: visibleWorks.length },
    {
      id: 'কবিতা',
      label: 'কবিতা',
      icon: Feather,
      count: visibleWorks.filter((w) => w.category === 'কবিতা').length,
    },
    {
      id: 'পত্র',
      label: 'পত্র ও চিঠি',
      icon: Mail,
      count: visibleWorks.filter((w) => w.category === 'পত্র').length,
    },
    {
      id: 'গল্প',
      label: 'ছোটগল্প',
      icon: BookOpen,
      count: visibleWorks.filter((w) => w.category === 'গল্প').length,
    },
    {
      id: 'বই',
      label: 'বই ও পাণ্ডুলিপি',
      icon: Library,
      count: visibleWorks.filter((w) => w.category === 'বই').length,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#1E1B18]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        bookmarksCount={bookmarks.length}
        ordersCount={orders.length}
        onOpenOrders={() => setIsOrdersOpen(true)}
        currentUser={currentUser}
        onOpenAuth={(mode) => openAuthModal(mode)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <>
            {/* Hero Banner */}
            <HeroSection
              worksCount={visibleWorks.length}
              booksCount={books.length}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onNavigate={(tab) => setActiveTab(tab)}
              featuredWork={featuredWork}
              onReadWork={(work) => setReadingWorkId(work.id)}
            />

            {/* Main Literary Reading Feed */}
            <section
              id="literary-feed"
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8"
            >
              {/* Section Heading */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#9E2A2B] block mb-1">
                    পাঠকের আঙিনা
                  </span>
                  <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#1E1B18]">
                    কবিতা, পত্র, গল্প ও নির্বাচিত গ্রন্থপাঠ
                  </h2>
                </div>
                <button
                  onClick={() => setActiveTab('submit')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9E2A2B]/10 hover:bg-[#9E2A2B] text-[#9E2A2B] hover:text-white text-sm font-bold transition-all self-start md:self-auto cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>
                    {currentUser
                      ? 'নতুন লেখা জমা দিন'
                      : 'লেখা জমা দিন (লগইন আবশ্যক)'}
                  </span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-4 sm:p-5 shadow-xs space-y-4">
                {/* Category Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {categoryTabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = selectedCategory === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setSelectedCategory(tab.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-[#9E2A2B] text-white shadow-xs'
                            : 'bg-[#F3ECE1] text-[#3D352E] hover:bg-[#E6DBC8]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-[#E2D5C1] text-[#4A423B]'
                          }`}
                        >
                          {toBanglaNumber(tab.count)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Input & Sort Selector */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-[#EFE6D5]">
                  <div className="md:col-span-8 relative">
                    <Search className="w-4 h-4 text-[#7A6F66] absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="শিরোনাম, লেখক, কবিতার লাইন বা ট্যাগ দিয়ে খুঁজুন (যেমন: রবীন্দ্রনাথ, বৃষ্টি, চিঠি)..."
                      className="w-full pl-11 pr-9 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#1E1B18]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="md:col-span-4 flex items-center justify-end gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#9E2A2B] shrink-0" />
                    <span className="text-xs font-bold text-[#5E544C] shrink-0">ক্রম:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#9E2A2B]"
                    >
                      <option value="newest">সর্বশেষ ও নতুন সংযোজন</option>
                      <option value="popular">পাঠকপ্রিয়তা (সর্বাধিক ভালোবাসা)</option>
                    </select>
                  </div>
                </div>

                {/* Active Author Filter Pill */}
                {authorFilter && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-[#6E655F]">নির্বাচিত লেখক:</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E2A2B] text-white text-xs font-bold">
                      {authorFilter}
                      <button
                        onClick={() => setAuthorFilter('')}
                        className="hover:text-[#F3C663] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                )}
              </div>

              {/* Literary Cards Grid */}
              {filteredWorks.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-8 space-y-3">
                  <p className="font-heading text-xl font-bold text-[#1E1B18]">
                    কোনো রচনা খুঁজে পাওয়া যায়নি।
                  </p>
                  <p className="text-sm text-[#6E655F]">
                    অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার পরিবর্তন করুন।
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                      setAuthorFilter('');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#9E2A2B] text-white text-xs font-bold cursor-pointer"
                  >
                    সকল রচনা দেখুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWorks.map((work) => (
                    <WorkCard
                      key={work.id}
                      work={work}
                      onRead={(w) => setReadingWorkId(w.id)}
                      onToggleLike={handleToggleLike}
                      isLiked={likedIds.includes(work.id)}
                      onToggleBookmark={handleToggleBookmark}
                      isBookmarked={bookmarks.includes(work.id)}
                      onDelete={
                        currentUser?.role === 'admin' ||
                        (work.isUserSubmitted &&
                          currentUser &&
                          work.authorEmail === currentUser.email)
                          ? handleDeleteWork
                          : null
                      }
                      onGoToBookshop={() => {
                        setActiveTab('bookshop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Featured Bookstore Preview on Home Page */}
            <section className="bg-[#F3ECE1] border-y border-[#E2D5C1] py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E2A2B] mb-1">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      সাহিত্যকানন গ্রন্থবিপণি
                    </span>
                    <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#1E1B18]">
                      পাঠকের প্রিয় বইসমূহ ঘরে বসে সংগ্রহ করুন
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('bookshop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1F4E5B] hover:bg-[#163A44] text-white text-sm font-bold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <span>গ্রন্থবিপণির সব বই দেখুন ({toBanglaNumber(books.length)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {books.slice(0, 4).map((book) => (
                    <div
                      key={book.id}
                      className="rounded-2xl bg-[#FDFBF7] border border-[#DFC9A6] p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all"
                    >
                      <div>
                        <div className="h-52 rounded-xl bg-[#EFE6D5] flex items-center justify-center p-3 mb-4 relative">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-full w-36 object-cover rounded-r-md shadow-md border-l-4 border-[#9E2A2B]"
                            loading="lazy"
                          />
                          <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#9E2A2B] text-white text-[11px] font-bold">
                            {book.category}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-bold text-[#1E1B18] line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#6E655F] mt-0.5">
                          {book.author}
                        </p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#EFE6D5] flex items-center justify-between">
                        <div>
                          <span className="font-heading text-xl font-extrabold text-[#9E2A2B]">
                            ৳ {toBanglaNumber(book.price)}
                          </span>
                          <span className="block text-[11px] text-[#B45309] font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                            {toBanglaNumber(book.rating)}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            handleAddToCart(book);
                            setIsCartOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>ঝুড়িতে নিন</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Authors Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E2A2B]">
                  <Users className="w-4 h-4" />
                  কবি ও কথাসাহিত্যিক প্রাঙ্গণ
                </span>
                <h2 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#1E1B18]">
                  চিরায়ত ও সমকালীন লেখকদের কণ্ঠস্বর
                </h2>
                <p className="text-sm text-[#5E544C]">
                  যেকোনো লেখকের কার্ডে ক্লিক করে তাঁর লেখা কবিতা, পত্র ও গল্পগুলো একসাথে পড়ুন।
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {FEATURED_AUTHORS.map((author, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setAuthorFilter(author.name.split(' ')[0]);
                      const el = document.getElementById('literary-feed');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] hover:border-[#9E2A2B] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-2">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#9E2A2B]/10 text-[#9E2A2B] text-xs font-bold">
                        {author.badge}
                      </span>
                      <h3 className="font-heading text-xl font-bold text-[#1E1B18] group-hover:text-[#9E2A2B] transition-colors">
                        {author.name}
                      </h3>
                      <p className="text-xs text-[#6E655F] font-medium">{author.title}</p>
                      <blockquote className="text-xs italic text-[#4A423B] border-l-2 border-[#C89D54] pl-2.5 py-0.5">
                        “{author.quote}”
                      </blockquote>
                    </div>
                    <div className="pt-3 border-t border-[#EFE6D5] flex items-center justify-between text-xs font-bold text-[#9E2A2B]">
                      <span>{author.worksCount}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'bookshop' && (
          <BookShopSection
            books={books}
            cart={cart}
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {activeTab === 'submit' && (
          <SubmitWorkSection
            currentUser={currentUser}
            onOpenAuth={(mode) =>
              openAuthModal(
                mode,
                'নতুন কবিতা, পত্র, গল্প বা বই পোস্ট করার জন্য অনুগ্রহ করে লগইন করুন।'
              )
            }
            onAddWork={handleAddWork}
            onAddBook={handleAddBook}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'bookmarks' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
            <div className="rounded-3xl bg-[#FDFBF7] border border-[#E5DCCB] p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9E2A2B]">
                  <Bookmark className="w-4 h-4 fill-[#9E2A2B]" />
                  ব্যক্তিগত পাঠশালা
                </span>
                <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#1E1B18]">
                  আপনার সংরক্ষিত কবিতা, পত্র ও গল্প ({toBanglaNumber(bookmarkedWorks.length)})
                </h1>
                <p className="text-sm text-[#5E544C]">
                  আপনার প্রিয় রচনাগুলো এখানে সংরক্ষিত থাকে যেন যেকোনো সময় পুনরায় পড়তে পারেন।
                </p>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="px-5 py-3 rounded-xl bg-[#9E2A2B] text-white text-sm font-bold self-start sm:self-auto cursor-pointer"
              >
                আরও রচনা খুঁজুন
              </button>
            </div>

            {bookmarkedWorks.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-8 space-y-3">
                <p className="font-heading text-xl font-bold text-[#1E1B18]">
                  আপনার সংরক্ষিত তালিকায় এখনো কোনো রচনা নেই।
                </p>
                <p className="text-sm text-[#6E655F]">
                  যেকোনো কবিতা, চিঠি বা গল্পের কার্ডে বুকমার্ক আইকনে ক্লিক করে এখানে সংরক্ষণ করতে পারবেন।
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedWorks.map((work) => (
                  <WorkCard
                    key={work.id}
                    work={work}
                    onRead={(w) => setReadingWorkId(w.id)}
                    onToggleLike={handleToggleLike}
                    isLiked={likedIds.includes(work.id)}
                    onToggleBookmark={handleToggleBookmark}
                    isBookmarked={bookmarks.includes(work.id)}
                    onDelete={
                      currentUser?.role === 'admin' ? handleDeleteWork : null
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onAdminLogin={handleAdminLogin}
            works={works}
            books={books}
            orders={orders}
            users={users}
            dbConnected={dbConnected}
            onToggleFeaturedWork={handleToggleFeaturedWork}
            onToggleApproveWork={handleToggleApproveWork}
            onDeleteWork={handleDeleteWork}
            onReadWork={(w) => setReadingWorkId(w.id)}
            onAddBook={handleAddBook}
            onDeleteBook={handleDeleteBook}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            onToggleUserRole={handleToggleUserRole}
            onDeleteUser={handleDeleteUser}
            onResetDatabase={handleResetDatabase}
          />
        )}
      </main>

      {/* Distraction-Free Literary Reader Modal */}
      {activeReadingWork && (
        <ReaderModal
          work={activeReadingWork}
          onClose={() => setReadingWorkId(null)}
          onToggleLike={handleToggleLike}
          isLiked={likedIds.includes(activeReadingWork.id)}
          onToggleBookmark={handleToggleBookmark}
          isBookmarked={bookmarks.includes(activeReadingWork.id)}
          onAddComment={handleAddComment}
        />
      )}

      {/* Book Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Completed Orders Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />

      {/* Authentication Modal (Login & Registration) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        initialMode={authModalMode}
        reasonMessage={authReasonMessage}
      />

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />
    </div>
  );
}
