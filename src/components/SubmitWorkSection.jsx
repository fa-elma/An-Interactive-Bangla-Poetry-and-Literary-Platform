import { useState } from 'react';
import {
  PenTool,
  Feather,
  Mail,
  BookOpen,
  Library,
  Sparkles,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  ShoppingBag,
  Lock,
  LogIn,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { COVER_PRESETS, BOOK_GENRES, toBanglaNumber } from '../data/literaryData';

export default function SubmitWorkSection({
  currentUser,
  onOpenAuth,
  onAddWork,
  onAddBook,
  onNavigate,
}) {
  const [category, setCategory] = useState('কবিতা');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(currentUser?.name || '');
  const [authorRole, setAuthorRole] = useState(
    currentUser?.bio || 'তরুণ লেখক ও সাহিত্যপ্রেমী'
  );
  const [recipient, setRecipient] = useState('');
  const [locationDate, setLocationDate] = useState('ঢাকা • অগ্রহায়ণ ১৪৩৩');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('প্রেম, প্রকৃতি, অনুভূতি');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);

  // Book-specific fields when category === 'বই'
  const [bookPrice, setBookPrice] = useState(280);
  const [bookGenre, setBookGenre] = useState('কাব্যগ্রন্থ');
  const [publisher, setPublisher] = useState('সাহিত্যকানন প্রকাশনী');
  const [pages, setPages] = useState(128);
  const [listInBookshop, setListInBookshop] = useState(true);

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Require login before posting!
  if (!currentUser) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-[#FDFBF7] border-2 border-[#D8CBB8] p-8 sm:p-12 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#9E2A2B] text-[#F3C663] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#9E2A2B]/12 text-[#9E2A2B] text-xs font-bold">
              লেখক প্রমাণীকরণ আবশ্যক (Login Required)
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#1E1B18]">
              আপনার কবিতা, পত্র, গল্প বা বই প্রকাশ করতে লগইন করুন
            </h1>
            <p className="text-sm sm:text-base text-[#5E544C] max-w-lg mx-auto leading-relaxed">
              সাহিত্যকাননে যেকোনো পাঠক উন্মুক্তভাবে সাহিত্য পড়তে ও বই কিনতে পারেন। তবে নতুন রচনা বা বই পোস্ট করার জন্য লেখকের অ্যাকাউন্টে লগইন থাকা আবশ্যক।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-6 py-3.5 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white font-heading font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#F3C663]" />
              <span>লগইন করুন</span>
            </button>

            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3.5 rounded-xl bg-[#1F4E5B] hover:bg-[#163A44] text-white font-heading font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#F3C663]" />
              <span>নতুন অ্যাকাউন্ট খুলুন</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const effectiveAuthor = author || currentUser.name;

  const fillDemoSample = (selectedCat) => {
    const targetCat = selectedCat || category;
    setAuthor(currentUser.name);
    setAuthorRole(currentUser.bio || 'কবি ও সাহিত্যকর্মী');
    if (targetCat === 'কবিতা') {
      setTitle('শ্রাবণ সন্ধ্যায় তোমার নামে');
      setTagsInput('বৃষ্টি, সন্ধ্যা, স্মৃতি, কবিতা');
      setCoverImage(COVER_PRESETS[3].url);
      setContent(`জানালার কার্নিশে জমে আছে মেঘেদের নীরব আলাপ,
ভিজে গেছে কৃষ্ণচূড়ার পথ, নিভে গেছে শহরের তাপ।
চায়ের পেয়ালায় ওঠে ধোঁয়া, পুরাতন ডায়েরির পাতা,
তোমার নামেই লেখা হলো আজ শ্রাবণের যত না-বলা কথা।

যদি কখনো মেঘ ভাঙে, যদি নামে জোনাকির দল,
জেনো এই শহরের এক কোণে আজও কেউ বুনে গেছে ছল।`);
    } else if (targetCat === 'পত্র') {
      setTitle('ডাকবাক্সে জমা রাখা মেঘের চিরকুট');
      setRecipient('প্রিয় অরুন্ধতী');
      setLocationDate('শান্তিনিকেতন • কার্তিক ১৪৩৩');
      setTagsInput('চিঠি, হলুদ খাম, বন্ধুত্ব');
      setCoverImage(COVER_PRESETS[2].url);
      setContent(`প্রিয় অরুন্ধতী,

অনেকদিন তোমার কোনো খোঁজ পাই না। শহরের যান্ত্রিক কোলাহলে আমাদের দীর্ঘ চিঠি লেখার দিনগুলো যেন কোথায় হারিয়ে গেছে। তবু আজ সকালে বারান্দায় রোদ এসে পড়তেই তোমার কথা মনে হলো।

তোমার কি মনে আছে, আমরা কলেজ ফেরত পথে পুরনো লাইব্রেরি থেকে বই ধার নিতাম? সেই বইগুলোর ভাঁজে যে শুকনো বকুল ফুলগুলো রাখা ছিল, সেগুলো আজও তেমনি আছে। সময় পেলে এক বিকেলে চলে এসো।

ইতি,
তোমারই চিরচেনা বন্ধু`);
    } else if (targetCat === 'গল্প') {
      setTitle('শেষ ট্রেনের অচেনা সহযাত্রী');
      setTagsInput('রেলগাড়ি, রহস্য, ছোটগল্প');
      setCoverImage(COVER_PRESETS[4].url);
      setContent(`রাত দশটার কমলাপুর স্টেশনে তখন যাত্রী খুব বেশি নেই। জানালার পাশের আসনটায় বসে রুদ্র একটি পুরাতন কবিতার বই পড়ছিল। ট্রেন ছাড়ার ঠিক আগমুহূর্তে বিপরীত দিকের আসনে এসে বসলেন এক বৃদ্ধ ভদ্রলোক।

ভদ্রলোকের হাতে একটি কাঠের বাক্স আর চোখে মোটা ফ্রেমের চশমা। রুদ্রের হাতের বইটির দিকে তাকিয়ে তিনি মৃদু হেসে বললেন, “এই বইটির চব্বিশ পৃষ্ঠায় কি একটি নীল কালির দাগ আছে?” রুদ্র চমকে উঠে পৃষ্ঠা উল্টাতেই দেখল—সত্যিই সেখানে ফাউন্টেন পেনের আঁচড়ে লেখা একটি তারিখ : ১৪ই ফাল্গুন, ১৯৭৯!`);
    } else if (targetCat === 'বই') {
      setTitle('নির্জন নক্ষত্রের পাণ্ডুলিপি');
      setBookPrice(300);
      setBookGenre('কাব্যগ্রন্থ');
      setPublisher('ঐতিহ্য ও সাহিত্যকানন');
      setPages(160);
      setListInBookshop(true);
      setTagsInput('নতুন বই, বইমেলা, কাব্যগ্রন্থ');
      setCoverImage(COVER_PRESETS[1].url);
      setContent(`প্রথম অধ্যায় / ভূমিকা :

মানুষের প্রতিটি নিঃশ্বাসেই একেকটি অদৃশ্য কবিতা লুকিয়ে থাকে। শহরের কোলাহল পেরিয়ে যখন মধ্যরাতের নীরবতা নামে, তখন সেই শব্দগুলো পাণ্ডুলিপির পাতায় জোনাকির মতো জ্বলে ওঠে।

‘নির্জন নক্ষত্রের পাণ্ডুলিপি’ বইটিতে স্থান পেয়েছে লেখকের বিগত পাঁচ বছরের বাছাইকৃত ৬০টি কবিতা ও ১০টি গদ্যচিঠি। পাঠকের হৃদয়ে শব্দের এই অনুরণনটুকু পৌঁছে দেওয়াই এই গ্রন্থের মূল প্রয়াস।`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !effectiveAuthor.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const wordCount = content.trim().split(/\s+/).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 90));

    const newWork = {
      id: `work-${Date.now()}`,
      title: title.trim(),
      author: effectiveAuthor.trim(),
      authorId: currentUser.id,
      authorEmail: currentUser.email,
      authorRole: authorRole.trim() || 'সাহিত্যিক',
      category,
      recipient: category === 'পত্র' ? recipient.trim() || 'প্রিয় পাঠক' : undefined,
      locationDate: category === 'পত্র' ? locationDate.trim() : undefined,
      bookPrice: category === 'বই' ? Number(bookPrice) || 250 : undefined,
      publisher: category === 'বই' ? publisher.trim() : undefined,
      pages: category === 'বই' ? Number(pages) || 120 : undefined,
      date: 'অগ্রহায়ণ ১৪৩৩ (নতুন)',
      readTime: `${toBanglaNumber(readMinutes)} মিনিট`,
      likes: 1,
      views: 1,
      featured: false,
      status: 'approved',
      isUserSubmitted: true,
      tags: tags.length > 0 ? tags : [category, 'নতুন লেখা'],
      coverImage: coverImage || COVER_PRESETS[0].url,
      excerpt: content.trim().slice(0, 175) + (content.trim().length > 175 ? '...' : ''),
      content: content.trim(),
      comments: [],
    };

    onAddWork(newWork);

    // If category is 'বই' and listInBookshop is enabled, also add to Bookshop catalog!
    if (category === 'বই' && listInBookshop && onAddBook) {
      const priceVal = Number(bookPrice) || 250;
      const newBook = {
        id: `book-${Date.now()}`,
        title: title.trim(),
        author: effectiveAuthor.trim(),
        category: bookGenre || 'কাব্যগ্রন্থ',
        price: priceVal,
        originalPrice: Math.round(priceVal * 1.2),
        rating: 5.0,
        reviewsCount: 1,
        publisher: publisher.trim() || 'সাহিত্যকানন প্রকাশনী',
        pages: Number(pages) || 128,
        edition: 'প্রথম প্রকাশ ১৪৩৩',
        binding: 'হার্ডকভার',
        badge: 'নতুন সংযোজন',
        accentColor: '#9E2A2B',
        coverImage: coverImage || COVER_PRESETS[1].url,
        description: content.trim().slice(0, 220),
        excerpt: content.trim(),
        inStock: true,
        isUserSubmitted: true,
      };
      onAddBook(newBook);
    }

    setSubmittedSuccess(true);
    setTitle('');
    setContent('');
    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#9E2A2B] via-[#7E2122] to-[#1F4E5B] text-white p-6 sm:p-10 mb-10 shadow-lg relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#F3C663] text-xs font-bold">
              <PenTool className="w-3.5 h-3.5" />
              লেখক ও কবির সৃজনশীল মঞ্চ
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-300/30 text-emerald-200 text-xs font-bold">
              <UserCheck className="w-3.5 h-3.5" />
              লগইনকৃত লেখক: {currentUser.name}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold">
            আপনার কবিতা, পত্র, গল্প অথবা বই ডাটাবেসে প্রকাশ করুন
          </h1>
          <p className="text-sm sm:text-base text-[#F5EFE6]/90 leading-relaxed">
            আপনার ডায়েরির পাতায় জমে থাকা কবিতা, প্রিয়জনকে লেখা চিঠি, ছোটগল্প কিংবা আপনার নতুন বইটি সাহিত্যকাননের পাঠকদের জন্য উন্মুক্ত করুন। ‘বই’ বিভাগে সাবমিট করলে সেটি সরাসরি গ্রন্থবিপণিতেও বিক্রয়ের জন্য যুক্ত করার সুবিধা রয়েছে!
          </p>
        </div>
      </div>

      {/* Success Notification Toast */}
      {submittedSuccess && (
        <div className="mb-8 p-5 rounded-2xl bg-[#2E5A44] text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-7 h-7 text-[#F3C663] shrink-0" />
            <div>
              <h3 className="font-heading text-lg font-bold">
                অভিনন্দন! আপনার রচনাটি ডাটাবেসে সফলভাবে সংরক্ষিত ও প্রকাশিত হয়েছে।
              </h3>
              <p className="text-xs sm:text-sm text-white/90">
                আপনার লেখাটি সাহিত্য পাঠশালায় যুক্ত হয়েছে{' '}
                {category === 'বই' && listInBookshop
                  ? 'এবং গ্রন্থবিপণিতে বিক্রয়ের জন্য তালিকাভুক্ত করা হয়েছে!'
                  : '।'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('explore')}
              className="px-4 py-2 rounded-xl bg-white text-[#1E1B18] text-xs font-bold hover:bg-[#F3C663] transition-colors cursor-pointer"
            >
              সাহিত্য পাঠশালায় দেখুন
            </button>
            {category === 'বই' && listInBookshop && (
              <button
                onClick={() => onNavigate('bookshop')}
                className="px-4 py-2 rounded-xl bg-[#F3C663] text-[#1E1B18] text-xs font-bold hover:bg-white transition-colors cursor-pointer"
              >
                গ্রন্থবিপণিতে দেখুন
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Submission Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] p-6 sm:p-8 shadow-sm space-y-6"
        >
          {/* Step 1: Select Category & Demo Autofill */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="font-heading text-lg font-bold text-[#1E1B18]">
                ১. রচনার বিভাগ নির্বাচন করুন *
              </label>
              <button
                type="button"
                onClick={() => fillDemoSample(category)}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#C89D54]/20 hover:bg-[#C89D54]/35 text-[#78350F] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9E2A2B]" />
                <span>নমুনা লেখা দিয়ে ফর্ম পূরণ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'কবিতা', label: 'কবিতা', icon: Feather },
                { id: 'পত্র', label: 'পত্র / চিঠি', icon: Mail },
                { id: 'গল্প', label: 'ছোটগল্প', icon: BookOpen },
                { id: 'বই', label: 'বই প্রকাশ', icon: Library },
              ].map((cat) => {
                const Icon = cat.icon;
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-xl border-2 font-heading font-bold text-sm transition-all cursor-pointer ${
                      active
                        ? 'bg-[#9E2A2B] text-white border-[#9E2A2B] shadow-sm'
                        : 'bg-[#FAF6F0] text-[#3D352E] border-[#E5DCCB] hover:border-[#C89D54]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-[#F3C663]' : 'text-[#9E2A2B]'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Title & Author Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-[#2B2622] mb-1.5">
                রচনার শিরোনাম / বইয়ের নাম *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  category === 'কবিতা'
                    ? 'যেমন: শ্রাবণ সন্ধ্যায় তোমার নামে'
                    : category === 'পত্র'
                    ? 'যেমন: হলুদ খামের না-পাঠানো চিঠি'
                    : category === 'গল্প'
                    ? 'যেমন: নীলক্ষেতের পুরাতন মলাট'
                    : 'যেমন: নির্জন নক্ষত্রের পাণ্ডুলিপি'
                }
                className="w-full px-4 py-3 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-base focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2B2622] mb-1.5">
                লেখক / কবির নাম *
              </label>
              <input
                type="text"
                required
                value={effectiveAuthor}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2B2622] mb-1.5">
                লেখক পরিচিতি (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="যেমন: তরুণ কবি / কথাসাহিত্যিক"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>
          </div>

          {/* Conditional Fields for Letter (পত্র) */}
          {category === 'পত্র' && (
            <div className="p-4 rounded-2xl bg-[#FCF7EB] border border-dashed border-[#C89D54] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#78350F] mb-1">
                  ✉️ প্রাপকের নাম / সম্বোধন
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="যেমন: প্রিয় নীলকণ্ঠ / কল্যাণীয়াষু"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#78350F] mb-1">
                  📍 স্থান ও তারিখ (ডাকঘরের ছাপ)
                </label>
                <input
                  type="text"
                  value={locationDate}
                  onChange={(e) => setLocationDate(e.target.value)}
                  placeholder="যেমন: ঢাকা • ১৫ কার্তিক ১৪৩৩"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>
            </div>
          )}

          {/* Conditional Fields for Book (বই) */}
          {category === 'বই' && (
            <div className="p-5 rounded-2xl bg-[#2E5A44]/8 border border-[#2E5A44]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-sm text-[#2E5A44] flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" />
                  গ্রন্থ প্রকাশনা ও বিক্রয় তথ্য
                </span>
                <label className="inline-flex items-center gap-2 text-xs font-bold text-[#1E1B18] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={listInBookshop}
                    onChange={(e) => setListInBookshop(e.target.checked)}
                    className="w-4 h-4 accent-[#2E5A44] rounded"
                  />
                  <span>গ্রন্থবিপণিতে (Bookshop) বিক্রয়ের জন্য যুক্ত করুন</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2622] mb-1">মূল্য (৳)</label>
                  <input
                    type="number"
                    min="50"
                    value={bookPrice}
                    onChange={(e) => setBookPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2622] mb-1">বইয়ের ধরন</label>
                  <select
                    value={bookGenre}
                    onChange={(e) => setBookGenre(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  >
                    {BOOK_GENRES.filter((g) => g !== 'সকল বই').map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2622] mb-1">প্রকাশনী</label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2622] mb-1">পৃষ্ঠা সংখ্যা</label>
                  <input
                    type="number"
                    min="16"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8CBB8] bg-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Main Literary Content */}
          <div>
            <label className="block text-sm font-bold text-[#2B2622] mb-1.5">
              {category === 'কবিতা'
                ? 'মূল কবিতা (স্তবক সাজিয়ে লিখুন) *'
                : category === 'পত্র'
                ? 'চিঠির মূল বক্তব্য *'
                : category === 'গল্প'
                ? 'মূল গল্প *'
                : 'বইয়ের সংক্ষিপ্তসার ও নির্বাচিত পাঠাংশ *'}
            </label>
            <textarea
              rows={9}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="এখানে আপনার মূল বাংলা লেখাটি টাইপ করুন অথবা পেস্ট করুন..."
              className="w-full p-4 rounded-2xl border border-[#D8CBB8] bg-[#FAF6F0] text-base leading-relaxed focus:outline-none focus:border-[#9E2A2B]"
            />
          </div>

          {/* Step 4: Cover Photo Selection & Tags */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#2B2622] mb-2 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#9E2A2B]" />
                <span>প্রচ্ছদ ছবি নির্বাচন করুন (অথবা কাস্টম লিংক দিন)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2.5">
                {COVER_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      coverImage === preset.url
                        ? 'bg-[#9E2A2B] text-white border-[#9E2A2B]'
                        : 'bg-[#FAF6F0] text-[#4A423B] border-[#D8CBB8] hover:border-[#9E2A2B]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="প্রচ্ছদ ছবির URL..."
                className="w-full px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-xs focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2B2622] mb-1">
                ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="প্রেম, প্রকৃতি, বইমেলা, স্মৃতি"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-sm focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white font-heading text-lg font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <PenTool className="w-5 h-5 text-[#F3C663]" />
            <span>রচনাটি সাহিত্যকাননে প্রকাশ করুন</span>
          </button>
        </form>

        {/* Right 5 Cols: Instant Live Preview */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-[#1E1B18] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#9E2A2B]" />
              <span>তাৎক্ষণিক প্রিভিউ (Live Preview)</span>
            </h3>
            <span className="text-xs font-semibold text-[#7A6F66]">পাঠক যেমন দেখবেন</span>
          </div>

          <div className="rounded-2xl border-2 border-[#DFC9A6] bg-[#FDFBF7] overflow-hidden shadow-md">
            <div className="relative h-44 bg-[#EADBC8]">
              <img
                src={coverImage || COVER_PRESETS[0].url}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#FAF6F0] text-[#9E2A2B] text-xs font-bold">
                {category}
              </span>
              {category === 'বই' && (
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#2E5A44] text-white text-xs font-bold">
                  মূল্য: ৳ {toBanglaNumber(bookPrice || 250)}
                </span>
              )}
            </div>

            <div className="p-6 space-y-3">
              {category === 'পত্র' && (
                <div className="px-3 py-1.5 rounded-lg bg-[#FCF7EB] border border-dashed border-[#C89D54] text-xs text-[#78350F]">
                  ✉️ প্রাপক: <strong>{recipient || 'প্রিয় পাঠক'}</strong> • {locationDate}
                </div>
              )}

              <h4 className="font-heading text-2xl font-bold text-[#1E1B18]">
                {title || 'আপনার রচনার শিরোনাম এখানে দেখা যাবে'}
              </h4>
              <p className="text-sm font-semibold text-[#9E2A2B]">
                কলমে: {effectiveAuthor || 'লেখকের নাম'}{' '}
                <span className="text-xs text-[#7A6F66] font-normal">({authorRole})</span>
              </p>

              <div className="p-4 rounded-xl bg-[#F6EFE2] border-l-4 border-[#9E2A2B] text-sm text-[#2B2622] whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
                {content ||
                  'আপনি বাম পাশের ফর্মে যা লিখবেন, তার তাৎক্ষণিক রূপ এখানে দেখতে পাবেন। উপরে “নমুনা লেখা দিয়ে ফর্ম পূরণ করুন” বাটনে ক্লিক করেও পরীক্ষা করতে পারেন।'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
