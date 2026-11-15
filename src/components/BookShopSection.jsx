import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Star,
  BookOpen,
  Sparkles,
  Check,
  SlidersHorizontal,
  X,
  Building2,
  FileText,
  Award,
} from 'lucide-react';
import { BOOK_GENRES, toBanglaNumber } from '../data/literaryData';

export default function BookShopSection({
  books,
  cart,
  onAddToCart,
  onOpenCart,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('সকল বই');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'price-asc' | 'price-desc' | 'rating'
  const [selectedBook, setSelectedBook] = useState(null);
  const [justAddedId, setJustAddedId] = useState(null);

  const filteredBooks = useMemo(() => {
    let list = books.filter((book) => {
      const matchesGenre =
        selectedGenre === 'সকল বই' || book.category === selectedGenre;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q) ||
        (book.publisher && book.publisher.toLowerCase().includes(q));
      return matchesGenre && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }
    return list;
  }, [books, selectedGenre, searchQuery, sortBy]);

  const handleAdd = (book) => {
    onAddToCart(book);
    setJustAddedId(book.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  const getCartQuantity = (bookId) => {
    const item = cart.find((i) => i.id === bookId);
    return item ? item.quantity : 0;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Bookstore Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1F4E5B] via-[#183B45] to-[#9E2A2B] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-8 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 text-[#F3C663] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              সাহিত্যকানন অনলাইন গ্রন্থবিপণি ও বইমেলা
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold leading-tight">
              মলাটবদ্ধ শব্দের ঘ্রাণ নিন — আপনার প্রিয় বই অর্ডার করুন ঘরে বসেই
            </h1>
            <p className="text-sm sm:text-base text-[#F5EFE6]/90 max-w-2xl">
              চিরায়ত কাব্যগ্রন্থ, উপন্যাস, পত্রসাহিত্য ও সমকালীন লেখকদের নতুন বই সংগ্রহ করুন বিশেষ ছাড়ে। প্রতিটি বইয়ের কিয়দংশ পড়ে দেখার সুবিধা রয়েছে।
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2 text-center sm:text-left">
              <div className="text-xs uppercase tracking-wider text-[#F3C663] font-bold">
                বইমেলা বিশেষ উপহার
              </div>
              <div className="font-heading text-xl font-extrabold">
                ২০% ফ্ল্যাট ডিসকাউন্ট!
              </div>
              <p className="text-xs text-white/85">
                চেকআউটের সময় ব্যবহার করুন কুপন কোড:{' '}
                <span className="px-2 py-0.5 rounded bg-[#F3C663] text-[#1E1B18] font-mono font-bold">
                  BOIMELA20
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-7 relative">
            <Search className="w-4 h-4 text-[#7A6F66] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="বইয়ের নাম, লেখক অথবা প্রকাশনীর নাম লিখে খুঁজুন..."
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

          {/* Sort Dropdown */}
          <div className="md:col-span-5 flex items-center justify-end gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#9E2A2B] shrink-0" />
            <span className="text-xs font-bold text-[#5E544C] shrink-0">সাজান:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#9E2A2B]"
            >
              <option value="default">নির্বাচিত ও জনপ্রিয়</option>
              <option value="price-asc">মূল্য: কম থেকে বেশি</option>
              <option value="price-desc">মূল্য: বেশি থেকে কম</option>
              <option value="rating">সর্বোচ্চ পাঠক রেটিং</option>
            </select>
          </div>
        </div>

        {/* Genre Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EFE6D5]">
          {BOOK_GENRES.map((genre) => {
            const active = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#9E2A2B] text-white shadow-xs'
                    : 'bg-[#F3ECE1] text-[#4A423B] hover:bg-[#E6DBC8]'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-8 space-y-3">
          <p className="font-heading text-xl font-bold text-[#1E1B18]">
            দুঃখিত, আপনার অনুসন্ধানের সাথে মিলে এমন কোনো বই পাওয়া যায়নি।
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('সকল বই');
            }}
            className="px-4 py-2 rounded-xl bg-[#9E2A2B] text-white text-sm font-bold cursor-pointer"
          >
            সকল বই দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const qtyInCart = getCartQuantity(book.id);
            const discountPercent = book.originalPrice
              ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
              : 0;

            return (
              <div
                key={book.id}
                className="group rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] hover:border-[#C89D54] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Book Cover Visual */}
                  <div className="relative h-64 bg-[#EFE6D5] p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-44 object-cover rounded-r-lg rounded-l-xs shadow-[6px_8px_16px_rgba(0,0,0,0.28)] border-l-4 border-[#F3C663] group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Badge */}
                    {book.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#9E2A2B] text-white text-[11px] font-bold shadow-xs">
                        {book.badge}
                      </span>
                    )}

                    {/* Discount Tag */}
                    {discountPercent > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-[#2E5A44] text-white text-[11px] font-bold">
                        {toBanglaNumber(discountPercent)}% ছাড়
                      </span>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-[#6E655F]">
                      <span className="px-2 py-0.5 rounded bg-[#F3ECE1] font-semibold text-[#9E2A2B]">
                        {book.category}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-[#B45309]">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        {toBanglaNumber(book.rating || 4.9)} ({toBanglaNumber(book.reviewsCount || 42)})
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedBook(book)}
                      className="font-heading text-lg font-bold text-[#1E1B18] group-hover:text-[#9E2A2B] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {book.title}
                    </h3>

                    <p className="text-sm font-semibold text-[#5E544C]">
                      লেখক: <span className="text-[#1E1B18]">{book.author}</span>
                    </p>

                    <p className="text-xs text-[#6E655F] line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Price & Buttons Footer */}
                <div className="p-5 pt-3 border-t border-[#EFE6D5] space-y-3 bg-[#FAF6F0]/60">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-heading text-2xl font-extrabold text-[#9E2A2B]">
                        ৳ {toBanglaNumber(book.price)}
                      </span>
                      {book.originalPrice && (
                        <span className="ml-2 text-xs text-[#8C827A] line-through">
                          ৳ {toBanglaNumber(book.originalPrice)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-[#2E5A44]">
                      ✓ স্টকে আছে
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedBook(book)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#C89D54] bg-white hover:bg-[#F3ECE1] text-[#1E1B18] text-xs font-bold transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#9E2A2B]" />
                      <span>একটু পড়ুন</span>
                    </button>

                    <button
                      onClick={() => handleAdd(book)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        justAddedId === book.id
                          ? 'bg-[#2E5A44] text-white'
                          : 'bg-[#9E2A2B] hover:bg-[#7D2021] text-white shadow-xs'
                      }`}
                    >
                      {justAddedId === book.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>যুক্ত হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>
                            {qtyInCart > 0
                              ? `ঝুড়িতে (${toBanglaNumber(qtyInCart)})`
                              : 'ঝুড়িতে নিন'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Sample Excerpt & Detail Modal */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
          onClick={() => setSelectedBook(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-2xl bg-[#FDFBF7] border-2 border-[#D8CBB8] shadow-2xl overflow-hidden my-8"
          >
            <div className="flex items-center justify-between px-6 py-4 bg-[#F3ECE1] border-b border-[#D8CBB8]">
              <span className="font-heading font-bold text-base text-[#9E2A2B] flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                গ্রন্থ পরিচিতি ও নির্বাচিত পাঠাংশ (একটু পড়ে দেখুন)
              </span>
              <button
                onClick={() => setSelectedBook(null)}
                className="p-1.5 rounded-lg hover:bg-[#E2D5C1] text-[#1E1B18] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="w-36 h-52 object-cover rounded-lg shadow-lg border-l-4 border-[#9E2A2B] shrink-0"
                />
                <div className="space-y-3 text-center sm:text-left">
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#9E2A2B]/15 text-[#9E2A2B] text-xs font-bold">
                    {selectedBook.category}
                  </span>
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1E1B18]">
                    {selectedBook.title}
                  </h2>
                  <p className="text-base font-bold text-[#9E2A2B]">
                    লেখক: {selectedBook.author}
                  </p>
                  <p className="text-sm text-[#4A423B] leading-relaxed">
                    {selectedBook.description}
                  </p>

                  {/* Book Metadata Pills */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1 text-xs text-[#5E544C]">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F3ECE1]">
                      <Building2 className="w-3.5 h-3.5 text-[#9E2A2B]" />
                      প্রকাশনী: {selectedBook.publisher || 'সাহিত্যকানন'}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F3ECE1]">
                      <FileText className="w-3.5 h-3.5 text-[#9E2A2B]" />
                      পৃষ্ঠা: {toBanglaNumber(selectedBook.pages || 160)}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F3ECE1]">
                      <Award className="w-3.5 h-3.5 text-[#9E2A2B]" />
                      বাঁধাই: {selectedBook.binding || 'হার্ডকভার'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sample Excerpt Box */}
              <div className="p-5 rounded-2xl bg-[#FAF3E3] border border-[#DFC9A6] space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#9E2A2B]">
                  📖 বইয়ের ভেতর থেকে নির্বাচিত অংশ:
                </div>
                <blockquote className="text-base text-[#241E18] leading-relaxed whitespace-pre-line italic">
                  “{selectedBook.excerpt || selectedBook.description}”
                </blockquote>
              </div>

              {/* Modal Footer CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5DCCB]">
                <div>
                  <span className="text-xs text-[#6E655F] block">বিক্রয় মূল্য:</span>
                  <span className="font-heading text-3xl font-extrabold text-[#9E2A2B]">
                    ৳ {toBanglaNumber(selectedBook.price)}
                  </span>
                  {selectedBook.originalPrice && (
                    <span className="ml-2 text-sm text-[#8C827A] line-through">
                      ৳ {toBanglaNumber(selectedBook.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      handleAdd(selectedBook);
                    }}
                    className="px-5 py-3 rounded-xl border-2 border-[#9E2A2B] text-[#9E2A2B] hover:bg-[#9E2A2B]/10 font-bold text-sm transition-colors cursor-pointer"
                  >
                    ঝুড়িতে যোগ করুন
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(selectedBook);
                      setSelectedBook(null);
                      onOpenCart();
                    }}
                    className="px-6 py-3 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white font-bold text-sm shadow-md transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#F3C663]" />
                    <span>এখনই অর্ডার করুন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
