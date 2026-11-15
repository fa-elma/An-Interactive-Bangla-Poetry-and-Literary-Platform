import { useState } from 'react';
import {
  ShieldCheck,
  Database,
  BookOpen,
  Library,
  ShoppingBag,
  Users,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Plus,
  Download,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
} from 'lucide-react';
import {
  BOOK_GENRES,
  COVER_PRESETS,
  toBanglaNumber,
} from '../data/literaryData';

export default function AdminDashboard({
  currentUser,
  onAdminLogin,
  works,
  books,
  orders,
  users,
  dbConnected,
  onToggleFeaturedWork,
  onToggleApproveWork,
  onDeleteWork,
  onReadWork,
  onAddBook,
  onDeleteBook,
  onUpdateOrderStatus,
  onDeleteOrder,
  onToggleUserRole,
  onDeleteUser,
  onResetDatabase,
}) {
  const [adminSubTab, setAdminSubTab] = useState('works'); // 'works' | 'books' | 'orders' | 'users'
  const [searchQuery, setSearchQuery] = useState('');

  // Secured Admin Login Form state
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // New Book Form state inside Admin Panel
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCategory, setBookCategory] = useState('কাব্যগ্রন্থ');
  const [bookPrice, setBookPrice] = useState(300);
  const [bookOriginalPrice, setBookOriginalPrice] = useState(380);
  const [bookPublisher, setBookPublisher] = useState('সাহিত্যকানন প্রকাশনী');
  const [bookPages, setBookPages] = useState(160);
  const [bookBadge, setBookBadge] = useState('নতুন প্রকাশনা');
  const [bookCover, setBookCover] = useState(COVER_PRESETS[1].url);
  const [bookDesc, setBookDesc] = useState('');
  const [bookExcerpt, setBookExcerpt] = useState('');

  const handleAdminAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await onAdminLogin(adminEmail, adminPassword);
      if (!res.ok) {
        setAuthError(res.message || 'অ্যাডমিন ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
      } else if (res.user?.role !== 'admin') {
        setAuthError(
          'প্রবেশাধিকার সংরক্ষিত: এই অ্যাকাউন্টের অ্যাডমিন প্যানেলে প্রবেশের অনুমতি নেই।'
        );
      } else {
        setAdminEmail('');
        setAdminPassword('');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Secured Admin Access Gate: Require authenticated user with role === 'admin'
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <section className="max-w-md mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-[#FDFBF7] border-2 border-[#D8CBB8] overflow-hidden shadow-xl">
          <div className="px-6 py-6 bg-gradient-to-r from-[#1E1B18] to-[#1F4E5B] text-white text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-[#F3C663] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            <span className="inline-block px-3 py-0.5 rounded-full bg-[#9E2A2B] text-white text-[11px] font-bold">
              সুরক্ষিত প্রশাসনিক প্রবেশদ্বার
            </span>
            <h1 className="font-heading text-2xl font-extrabold">
              অ্যাডমিন প্যানেল লগইন
            </h1>
            <p className="text-xs text-white/80">
              শুধুমাত্র অনুমোদিত প্রশাসকের (Admin) ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন
            </p>
          </div>

          <form onSubmit={handleAdminAuthSubmit} className="p-6 sm:p-8 space-y-4">
            {currentUser && currentUser.role !== 'admin' && !authError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  আপনি বর্তমানে সাধারণ লেখক ({currentUser.name}) হিসেবে লগইন আছেন। অ্যাডমিন প্যানেলের জন্য অ্যাডমিন ক্রেডেনশিয়াল প্রয়োজন।
                </span>
              </div>
            )}

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#2B2622] mb-1.5">
                অ্যাডমিন ইমেইল *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="অ্যাডমিন ইমেইল লিখুন"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2B2622] mb-1.5">
                অ্যাডমিন পাসওয়ার্ড *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6F66] hover:text-[#1E1B18] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-[#1F4E5B] hover:bg-[#163A44] text-white font-heading font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-[#F3C663]" />
              <span>
                {authLoading
                  ? 'যাচাই করা হচ্ছে...'
                  : 'নিরাপদভাবে অ্যাডমিন প্যানেলে প্রবেশ করুন'}
              </span>
            </button>
          </form>
        </div>
      </section>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'বাতিল' ? sum + (Number(o.grandTotal) || 0) : sum),
    0
  );

  const handleExportDatabase = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      users,
      works,
      books,
      orders,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahityakanon_database_backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateBook = (e) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookAuthor.trim()) return;
    const newBook = {
      id: `book-${Date.now()}`,
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      category: bookCategory,
      price: Number(bookPrice) || 280,
      originalPrice: Number(bookOriginalPrice) || 350,
      rating: 5.0,
      reviewsCount: 1,
      publisher: bookPublisher.trim() || 'সাহিত্যকানন প্রকাশনী',
      pages: Number(bookPages) || 160,
      edition: 'নতুন সংস্করণ ১৪৩৩',
      binding: 'হার্ডকভার',
      badge: bookBadge.trim() || 'নতুন বই',
      accentColor: '#9E2A2B',
      coverImage: bookCover || COVER_PRESETS[1].url,
      description:
        bookDesc.trim() ||
        'সাহিত্যকানন গ্রন্থবিপণিতে প্রকাশিত বিশেষ সংগ্রাহক সংস্করণ।',
      excerpt:
        bookExcerpt.trim() ||
        bookDesc.trim() ||
        'বইটির নির্বাচিত অংশ শীঘ্রই যুক্ত হবে।',
      inStock: true,
    };
    onAddBook(newBook);
    setBookTitle('');
    setBookAuthor('');
    setBookDesc('');
    setBookExcerpt('');
    setShowAddBookForm(false);
  };

  const filteredWorks = works.filter((w) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      w.title.toLowerCase().includes(q) ||
      w.author.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q)
    );
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Admin Control Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1E1B18] via-[#2B241E] to-[#1F4E5B] text-white p-6 sm:p-8 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3C663] text-[#1E1B18] text-xs font-extrabold">
              <ShieldCheck className="w-4 h-4" />
              অ্যাডমিন ড্যাশবোর্ড
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              {dbConnected
                ? 'Cloudflare D1 ডাটাবেস সচল (sahityakanon-db)'
                : 'লোকাল ডাটাবেস সিঙ্ক সচল'}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold">
            সাহিত্যকানন কেন্দ্রীয় ব্যবস্থাপনা ও ডাটাবেস প্যানেল
          </h1>
          <p className="text-xs sm:text-sm text-white/80">
            স্বাগতম, <strong>{currentUser.name}</strong> ({currentUser.email}) — এখান থেকে সকল পোস্ট, বই, অর্ডার ও ইউজার ডাটাবেস নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportDatabase}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#F3C663]" />
            <span>ডাটাবেস ব্যাকআপ (JSON)</span>
          </button>
          <button
            onClick={onResetDatabase}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-400/30 text-red-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>ডিফল্ট ডাটা রিসেট</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] shadow-2xs">
          <div className="text-xs font-bold text-[#6E655F]">মোট সাহিত্য রচনা</div>
          <div className="font-heading text-3xl font-extrabold text-[#9E2A2B] mt-1">
            {toBanglaNumber(works.length)}টি
          </div>
          <div className="text-[11px] text-[#2E5A44] mt-1 font-semibold">
            কবিতা, পত্র, গল্প ও বই
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] shadow-2xs">
          <div className="text-xs font-bold text-[#6E655F]">গ্রন্থবিপণির মোট বই</div>
          <div className="font-heading text-3xl font-extrabold text-[#1F4E5B] mt-1">
            {toBanglaNumber(books.length)}টি
          </div>
          <div className="text-[11px] text-[#6E655F] mt-1">বিক্রয়যোগ্য ক্যাটালগ</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] shadow-2xs">
          <div className="text-xs font-bold text-[#6E655F]">গ্রাহকের বই অর্ডার</div>
          <div className="font-heading text-3xl font-extrabold text-[#B45309] mt-1">
            {toBanglaNumber(orders.length)}টি
          </div>
          <div className="text-[11px] text-[#6E655F] mt-1">সকল অর্ডার রেকর্ড</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] shadow-2xs">
          <div className="text-xs font-bold text-[#6E655F]">মোট বই বিক্রয় আয়</div>
          <div className="font-heading text-3xl font-extrabold text-[#2E5A44] mt-1">
            ৳ {toBanglaNumber(totalRevenue)}
          </div>
          <div className="text-[11px] text-[#2E5A44] mt-1 font-semibold">
            ডেলিভারিসহ সর্বমোট
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-[#6E655F]">নিবন্ধিত লেখক ও পাঠক</div>
          <div className="font-heading text-3xl font-extrabold text-[#1E1B18] mt-1">
            {toBanglaNumber(users.length)} জন
          </div>
          <div className="text-[11px] text-[#6E655F] mt-1">ডাটাবেস ইউজার টেবিল</div>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5DCCB] pb-4">
        {[
          {
            id: 'works',
            label: `রচনা ব্যবস্থাপনা (${toBanglaNumber(works.length)})`,
            icon: BookOpen,
          },
          {
            id: 'books',
            label: `বই ও স্টোর ব্যবস্থাপনা (${toBanglaNumber(books.length)})`,
            icon: Library,
          },
          {
            id: 'orders',
            label: `বইয়ের অর্ডারসমূহ (${toBanglaNumber(orders.length)})`,
            icon: ShoppingBag,
          },
          {
            id: 'users',
            label: `ব্যবহারকারী ও লেখক (${toBanglaNumber(users.length)})`,
            icon: Users,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = adminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setAdminSubTab(tab.id)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-heading text-sm font-bold transition-all cursor-pointer ${
                active
                  ? 'bg-[#9E2A2B] text-white shadow-sm'
                  : 'bg-[#FDFBF7] text-[#3D352E] border border-[#E5DCCB] hover:bg-[#EFE6D5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Manage Literary Works */}
      {adminSubTab === 'works' && (
        <div className="rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-6 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1E1B18]">
                প্রকাশিত কবিতা, পত্র, গল্প ও বইয়ের তালিকা
              </h2>
              <p className="text-xs text-[#6E655F]">
                অ্যাডমিন হিসেবে যেকোনো রচনা হোমপেজে ফিচার্ড করতে, অনুমোদন/স্থগিত করতে অথবা মুছে ফেলতে পারবেন।
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#7A6F66] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="রচনা বা লেখক খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-xs focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E5DCCB] text-xs text-[#6E655F] bg-[#F5EFE6]">
                  <th className="py-3 px-4 rounded-tl-xl">শিরোনাম ও লেখক</th>
                  <th className="py-3 px-4">বিভাগ</th>
                  <th className="py-3 px-4">ভালোবাসা ও মন্তব্য</th>
                  <th className="py-3 px-4">অবস্থা (Status)</th>
                  <th className="py-3 px-4 text-right rounded-tr-xl">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE6D5]">
                {filteredWorks.map((work) => {
                  const isHidden = work.status === 'hidden';
                  return (
                    <tr key={work.id} className="hover:bg-[#FAF6F0]">
                      <td className="py-3.5 px-4">
                        <div className="font-heading font-bold text-[#1E1B18]">
                          {work.title}
                        </div>
                        <div className="text-xs text-[#6E655F]">
                          {work.author} • {work.date}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-[#9E2A2B]/10 text-[#9E2A2B] text-xs font-bold">
                          {work.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#4A423B]">
                        ❤️ {toBanglaNumber(work.likes || 0)} • 💬{' '}
                        {toBanglaNumber(work.comments?.length || 0)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isHidden
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isHidden ? 'স্থগিত (Hidden)' : 'প্রকাশিত (Approved)'}
                          </span>
                          {work.featured && (
                            <span className="px-2 py-0.5 rounded-full bg-[#F3C663] text-[#1E1B18] text-[11px] font-bold">
                              ★ নির্বাচিত
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onReadWork(work)}
                            title="পাঠ করুন"
                            className="p-2 rounded-lg bg-[#F3ECE1] hover:bg-[#E2D5C1] text-[#1E1B18] cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onToggleFeaturedWork(work.id)}
                            title="হোমপেজে নির্বাচিত হিসেবে সেট করুন"
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              work.featured
                                ? 'bg-[#F3C663] text-[#1E1B18]'
                                : 'bg-[#F3ECE1] text-[#6E655F] hover:text-[#1E1B18]'
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                work.featured ? 'fill-current' : ''
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => onToggleApproveWork(work.id)}
                            title={
                              isHidden
                                ? 'প্রকাশের অনুমোদন দিন'
                                : 'রচনাটি সাময়িকভাবে লুকান'
                            }
                            className={`p-2 rounded-lg cursor-pointer ${
                              isHidden
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isHidden ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => onDeleteWork(work.id)}
                            title="ডাটাবেস থেকে মুছে ফেলুন"
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Manage Bookstore Inventory */}
      {adminSubTab === 'books' && (
        <div className="rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-6 space-y-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#1E1B18]">
                গ্রন্থবিপণির বই তালিকা ও নতুন বই সংযোজন
              </h2>
              <p className="text-xs text-[#6E655F]">
                নতুন বই স্টোরে যুক্ত করুন অথবা বিদ্যমান বই ক্যাটালগ থেকে নিয়ন্ত্রণ করুন।
              </p>
            </div>
            <button
              onClick={() => setShowAddBookForm(!showAddBookForm)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E5A44] hover:bg-[#234735] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddBookForm ? 'ফর্ম বন্ধ করুন' : 'নতুন বই যুক্ত করুন'}</span>
            </button>
          </div>

          {showAddBookForm && (
            <form
              onSubmit={handleCreateBook}
              className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#D8CBB8] space-y-4"
            >
              <h3 className="font-heading text-base font-bold text-[#9E2A2B]">
                + গ্রন্থবিপণিতে নতুন বই যুক্ত করুন
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">বইয়ের নাম *</label>
                  <input
                    type="text"
                    required
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="যেমন: সোনালী ডানার চিল"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">লেখকের নাম *</label>
                  <input
                    type="text"
                    required
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    placeholder="লেখকের নাম"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">বিভাগ</label>
                  <select
                    value={bookCategory}
                    onChange={(e) => setBookCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  >
                    {BOOK_GENRES.filter((g) => g !== 'সকল বই').map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">বিক্রয় মূল্য (৳)</label>
                  <input
                    type="number"
                    value={bookPrice}
                    onChange={(e) => setBookPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">পূর্বমূল্য (৳)</label>
                  <input
                    type="number"
                    value={bookOriginalPrice}
                    onChange={(e) => setBookOriginalPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">প্রকাশনী</label>
                  <input
                    type="text"
                    value={bookPublisher}
                    onChange={(e) => setBookPublisher(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">পৃষ্ঠা সংখ্যা ও ব্যাজ</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bookPages}
                      onChange={(e) => setBookPages(e.target.value)}
                      className="w-20 px-2.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={bookBadge}
                      onChange={(e) => setBookBadge(e.target.value)}
                      placeholder="ব্যাজ"
                      className="flex-1 px-2.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">প্রচ্ছদ ছবির লিংক</label>
                  <input
                    type="url"
                    value={bookCover}
                    onChange={(e) => setBookCover(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <input
                    type="text"
                    value={bookDesc}
                    onChange={(e) => setBookDesc(e.target.value)}
                    placeholder="বইটি সম্পর্কে এক-দুই বাক্যে লিখুন..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold mb-1">
                    বইয়ের নির্বাচিত অংশ (পাঠক ‘একটু পড়ুন’ বাটনে ক্লিক করলে যা দেখবেন)
                  </label>
                  <textarea
                    rows={3}
                    value={bookExcerpt}
                    onChange={(e) => setBookExcerpt(e.target.value)}
                    placeholder="বইটির প্রথম কয়েক লাইন বা একটি স্তবক..."
                    className="w-full p-3 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#9E2A2B] text-white font-bold text-xs cursor-pointer"
              >
                ডাটাবেসে বইটি সংরক্ষণ করুন
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E5DCCB] text-xs text-[#6E655F] bg-[#F5EFE6]">
                  <th className="py-3 px-4 rounded-tl-xl">বই ও লেখক</th>
                  <th className="py-3 px-4">বিভাগ ও প্রকাশনী</th>
                  <th className="py-3 px-4">মূল্য</th>
                  <th className="py-3 px-4 text-right rounded-tr-xl">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE6D5]">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-[#FAF6F0]">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded border border-[#D8CBB8]"
                      />
                      <div>
                        <div className="font-heading font-bold text-[#1E1B18]">
                          {book.title}
                        </div>
                        <div className="text-xs text-[#6E655F]">{book.author}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="font-bold text-[#9E2A2B]">{book.category}</span>
                      <div className="text-[#6E655F]">{book.publisher}</div>
                    </td>
                    <td className="py-3 px-4 font-heading font-extrabold text-[#9E2A2B]">
                      ৳ {toBanglaNumber(book.price)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteBook(book.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                        title="বইটি মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Manage Book Orders */}
      {adminSubTab === 'orders' && (
        <div className="rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-6 space-y-5 shadow-2xs">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#1E1B18]">
              গ্রাহকদের বইয়ের অর্ডার ব্যবস্থাপনা
            </h2>
            <p className="text-xs text-[#6E655F]">
              অর্ডারের ডেলিভারি স্ট্যাটাস পরিবর্তন করলে গ্রাহকের অর্ডার ট্র্যাকিংয়ে তা সাথে সাথে আপডেট হবে।
            </p>
          </div>

          {orders.length === 0 ? (
            <p className="text-center py-10 text-sm text-[#6E655F]">
              এখনো কোনো অর্ডার জমা পড়েনি।
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#DFC9A6] flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-[#9E2A2B] text-white">
                        #{order.orderId}
                      </span>
                      <span className="text-xs text-[#6E655F]">{order.date}</span>
                      <span className="text-xs font-bold text-[#1F4E5B]">
                        • পেমেন্ট: {order.paymentMethod}
                      </span>
                    </div>
                    <div className="font-heading text-base font-bold text-[#1E1B18]">
                      গ্রাহক: {order.customerName} ({order.phone})
                    </div>
                    <div className="text-xs text-[#4A423B]">
                      ঠিকানা: {order.address}
                    </div>
                    <div className="text-xs text-[#9E2A2B] font-semibold pt-1">
                      বইসমূহ:{' '}
                      {order.items
                        ?.map((i) => `${i.title} (${toBanglaNumber(i.quantity)}টি)`)
                        .join(', ')}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#E5DCCB]">
                    <div className="text-right mr-2">
                      <span className="text-[11px] text-[#6E655F] block">মোট বিল</span>
                      <span className="font-heading text-xl font-extrabold text-[#9E2A2B]">
                        ৳ {toBanglaNumber(order.grandTotal)}
                      </span>
                    </div>

                    <select
                      value={order.status || 'প্রক্রিয়াধীন'}
                      onChange={(e) =>
                        onUpdateOrderStatus(order.orderId, e.target.value)
                      }
                      className="px-3.5 py-2 rounded-xl border border-[#C89D54] bg-white text-xs font-bold text-[#1E1B18] focus:outline-none focus:border-[#9E2A2B]"
                    >
                      <option value="প্রক্রিয়াধীন">⏳ প্রক্রিয়াধীন (Pending)</option>
                      <option value="প্যাকেজিং চলছে">📦 প্যাকেজিং চলছে</option>
                      <option value="কুরিয়ারে পাঠানো হয়েছে">🚚 কুরিয়ারে পাঠানো হয়েছে</option>
                      <option value="ডেলিভারি সম্পন্ন">✅ ডেলিভারি সম্পন্ন</option>
                      <option value="বাতিল">❌ বাতিল (Cancelled)</option>
                    </select>

                    <button
                      onClick={() => onDeleteOrder(order.orderId)}
                      title="অর্ডার মুছে ফেলুন"
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Manage Registered Users */}
      {adminSubTab === 'users' && (
        <div className="rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-6 space-y-5 shadow-2xs">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#1E1B18]">
              নিবন্ধিত ব্যবহারকারী ও লেখক তালিকা (Users Database Table)
            </h2>
            <p className="text-xs text-[#6E655F]">
              যেকোনো ব্যবহারকারীকে অ্যাডমিন বা লেখক ভূমিকা প্রদান করুন।
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E5DCCB] text-xs text-[#6E655F] bg-[#F5EFE6]">
                  <th className="py-3 px-4 rounded-tl-xl">নাম ও পরিচিতি</th>
                  <th className="py-3 px-4">ইমেইল</th>
                  <th className="py-3 px-4">ভূমিকা (Role)</th>
                  <th className="py-3 px-4">যোগদানের তারিখ</th>
                  <th className="py-3 px-4 text-right rounded-tr-xl">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE6D5]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF6F0]">
                    <td className="py-3.5 px-4">
                      <div className="font-heading font-bold text-[#1E1B18]">
                        {u.name}
                      </div>
                      <div className="text-xs text-[#6E655F]">{u.bio}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          u.role === 'admin'
                            ? 'bg-[#1F4E5B] text-white'
                            : 'bg-[#2E5A44]/15 text-[#2E5A44]'
                        }`}
                      >
                        {u.role === 'admin' ? '🛡️ অ্যাডমিন' : '✍️ লেখক / ইউজার'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#6E655F]">
                      {u.joinedDate || '১৪৩৩ বঙ্গাব্দ'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onToggleUserRole(u.id)}
                          className="px-3 py-1.5 rounded-lg border border-[#D8CBB8] hover:bg-[#EFE6D5] text-xs font-bold cursor-pointer"
                        >
                          {u.role === 'admin' ? 'লেখক বানান' : 'অ্যাডমিন বানান'}
                        </button>
                        {u.email !== 'admin@sahityakanon.com' && (
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
                            title="ইউজার মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
