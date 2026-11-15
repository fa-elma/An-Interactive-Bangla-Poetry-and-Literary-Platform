import { useState } from 'react';
import { Feather, Heart, BookOpen, PenTool, Library, Send, Check } from 'lucide-react';

export default function Footer({ onNavigate, onSelectCategory }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#1E1B18] text-[#EDE6DC] border-t-4 border-[#9E2A2B] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9E2A2B] flex items-center justify-center text-white">
                <Feather className="w-5 h-5 text-[#F3C663]" />
              </div>
              <div>
                <span className="font-heading text-2xl font-bold text-white block leading-none">
                  সাহিত্যকানন
                </span>
                <span className="text-xs text-[#C89D54]">
                  বাংলা কবিতা, পত্র, গল্প ও গ্রন্থ মঞ্চ
                </span>
              </div>
            </div>
            <p className="text-sm text-[#B8AFA6] leading-relaxed">
              সাহিত্যকানন একটি উন্মুক্ত বাংলা সাহিত্য ও গ্রন্থ প্ল্যাটফর্ম। এখানে পাঠক ও লেখকের মেলবন্ধনে রচিত হয় কবিতা, চিঠি, গল্প এবং প্রিয় বইয়ের সংগ্রহশালা।
            </p>
            <div className="text-xs text-[#9E948A] italic border-l-2 border-[#C89D54] pl-3">
              “মানুষের যা কিছু শ্রেষ্ঠ, তা তার সাহিত্যের মধ্যেই বেঁচে থাকে।”
            </div>
          </div>

          {/* Literary Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-base font-bold text-[#F3C663]">
              সাহিত্য বিভাগ
            </h4>
            <ul className="space-y-2 text-sm text-[#CBC2B8]">
              {['কবিতা', 'পত্র', 'গল্প', 'বই'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      onNavigate('explore');
                    }}
                    className="hover:text-[#F3C663] transition-colors cursor-pointer"
                  >
                    • {cat === 'পত্র' ? 'পত্র ও চিঠি' : cat === 'গল্প' ? 'ছোটগল্প' : cat === 'বই' ? 'বই ও পাণ্ডুলিপি' : 'কবিতা সমগ্র'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-base font-bold text-[#F3C663]">
              দ্রুত লিংকসমূহ
            </h4>
            <ul className="space-y-2.5 text-sm text-[#CBC2B8]">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="inline-flex items-center gap-2 hover:text-[#F3C663] transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#9E2A2B]" />
                  <span>সাহিত্য পাঠশালা (হোম)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submit')}
                  className="inline-flex items-center gap-2 hover:text-[#F3C663] transition-colors cursor-pointer"
                >
                  <PenTool className="w-4 h-4 text-[#9E2A2B]" />
                  <span>নতুন লেখা ও বই সাবমিট করুন</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bookshop')}
                  className="inline-flex items-center gap-2 hover:text-[#F3C663] transition-colors cursor-pointer"
                >
                  <Library className="w-4 h-4 text-[#9E2A2B]" />
                  <span>অনলাইন গ্রন্থবিপণি (বই কিনুন)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('bookmarks')}
                  className="inline-flex items-center gap-2 hover:text-[#F3C663] transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-[#9E2A2B]" />
                  <span>আমার সংরক্ষিত পাঠতালিকা</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Literary Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-base font-bold text-[#F3C663]">
              সাপ্তাহিক সাহিত্যপত্র
            </h4>
            <p className="text-xs text-[#B8AFA6] leading-relaxed">
              প্রতি সপ্তাহে নির্বাচিত সেরা কবিতা, চিঠি ও নতুন বইয়ের খবর ইমেইলে পেতে যুক্ত হোন:
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#F3C663]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2.5 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#F3C663]">
                  ✓ ধন্যবাদ! সাপ্তাহিক সাহিত্যপত্রে আপনার ইমেইল যুক্ত হয়েছে।
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E948A]">
          <p>
            © {new Date().getFullYear()} <strong>সাহিত্যকানন (SahityaKanon)</strong> — সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="flex items-center gap-1.5">
            <span>ফন্ট: Hind Siliguri • Anek Bangla • Noto Sans Bengali</span>
            <span>|</span>
            <span>React + Tailwind CSS Final Project</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
