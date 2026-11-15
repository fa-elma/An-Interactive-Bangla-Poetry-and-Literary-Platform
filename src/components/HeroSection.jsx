import {
  Feather,
  BookOpen,
  PenTool,
  ShoppingBag,
  Sparkles,
  Quote,
  ArrowRight,
  Mail,
  Library,
} from 'lucide-react';
import { toBanglaNumber } from '../data/literaryData';

export default function HeroSection({
  worksCount,
  booksCount,
  onSelectCategory,
  onNavigate,
  featuredWork,
  onReadWork,
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#E5DCCB] bg-gradient-to-b from-[#F5EFE6] via-[#FAF6F0] to-[#FAF6F0]">
      {/* Decorative subtle background circles */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#9E2A2B]/8 blur-3xl" />
      <div className="pointer-events-none absolute top-12 right-0 w-96 h-96 rounded-full bg-[#C89D54]/15 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Main Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#9E2A2B]/10 border border-[#9E2A2B]/25 text-[#9E2A2B] text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>বাংলা ভাষা ও সাহিত্যের সৃজনশীল ডিজিটাল প্রাঙ্গণ</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#1E1B18] tracking-tight leading-[1.22]">
              শব্দের বুননে জমে উঠুক{' '}
              <span className="text-[#9E2A2B] underline decoration-[#C89D54]/60 decoration-wavy underline-offset-8">
                কবিতা, পত্র, গল্প
              </span>{' '}
              ও প্রিয় বইয়ের ভুবন
            </h1>

            <p className="text-base sm:text-lg text-[#4A423B] max-w-2xl leading-relaxed">
              সাহিত্যকাননে স্বাগতম। এখানে আপনি চিরায়ত ও সমকালীন বাংলা কবিতা, হলুদ খামের চিঠি, ছোটগল্প এবং বইয়ের নির্বাচিত অংশ পড়তে পারবেন; নিজের লেখা সাবমিট করে পাঠকের কাছে পৌঁছে দিতে পারবেন এবং গ্রন্থবিপণি থেকে প্রিয় বই অর্ডার করতে পারবেন।
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                onClick={() => {
                  const el = document.getElementById('literary-feed');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#9E2A2B] hover:bg-[#7E2021] text-[#FAF6F0] font-semibold text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <BookOpen className="w-5 h-5 text-[#F3C663]" />
                <span>সাহিত্য পাঠ শুরু করুন</span>
              </button>

              <button
                onClick={() => onNavigate('submit')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FDFBF7] hover:bg-[#EFE6D5] text-[#1E1B18] border-2 border-[#C89D54] font-semibold text-base shadow-xs transition-all cursor-pointer"
              >
                <PenTool className="w-5 h-5 text-[#9E2A2B]" />
                <span>আপনার লেখা সাবমিট করুন</span>
              </button>

              <button
                onClick={() => onNavigate('bookshop')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#1F4E5B] hover:bg-[#163A44] text-white font-semibold text-base shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-[#F3C663]" />
                <span>বই কিনুন</span>
              </button>
            </div>

            {/* Category Quick Pills */}
            <div className="pt-3 border-t border-[#E5DCCB]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A6F66] mb-3">
                বিভাগ অনুযায়ী সরাসরি দেখুন:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'কবিতা', title: 'কবিতা সমগ্র', sub: 'ছন্দ ও পঙক্তিমালা', icon: Feather, color: 'text-[#9E2A2B]' },
                  { id: 'পত্র', title: 'পত্র ও চিঠি', sub: 'হলুদ খামের কথা', icon: Mail, color: 'text-[#B45309]' },
                  { id: 'গল্প', title: 'ছোটগল্প', sub: 'জীবনের আখ্যান', icon: BookOpen, color: 'text-[#1F4E5B]' },
                  { id: 'বই', title: 'বই ও পাণ্ডুলিপি', sub: 'নির্বাচিত পাঠাংশ', icon: Library, color: 'text-[#2E5A44]' },
                ].map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        const el = document.getElementById('literary-feed');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FDFBF7] hover:bg-[#EFE6D5]/80 border border-[#E5DCCB] hover:border-[#C89D54] text-left transition-all group cursor-pointer"
                    >
                      <div className="p-2 rounded-lg bg-[#F5EFE6] group-hover:bg-white transition-colors">
                        <Icon className={`w-4 h-4 ${cat.color}`} />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#1E1B18] group-hover:text-[#9E2A2B]">
                          {cat.title}
                        </div>
                        <div className="text-[11px] text-[#7A6F66]">{cat.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Featured Literary Card / Quote of the Day */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#FDFBF7] border-2 border-[#E2D5C1] p-6 sm:p-7 shadow-xl paper-texture">
              {/* Top corner stamp */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-dashed border-[#D8CBB8]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E2A2B] text-white text-xs font-semibold">
                  <Quote className="w-3.5 h-3.5 text-[#F3C663]" />
                  আজকের নির্বাচিত পাঠ
                </span>
                <span className="text-xs font-medium text-[#7A6F66]">
                  বিভাগ: <strong className="text-[#1E1B18]">{featuredWork?.category || 'কবিতা'}</strong>
                </span>
              </div>

              {featuredWork && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1E1B18] mb-1">
                      {featuredWork.title}
                    </h2>
                    <p className="text-sm font-semibold text-[#9E2A2B]">
                      — {featuredWork.author}{' '}
                      <span className="text-[#7A6F66] font-normal">({featuredWork.authorRole})</span>
                    </p>
                  </div>

                  <blockquote className="p-4 rounded-xl bg-[#F6EFE2]/90 border-l-4 border-[#9E2A2B] text-[#2B2622] text-base leading-relaxed whitespace-pre-line font-normal">
                    {featuredWork.content.split('\n').slice(0, 6).join('\n')}
                  </blockquote>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 text-xs text-[#6E655F]">
                      <span>⏱ পাঠের সময়: {featuredWork.readTime}</span>
                      <span>•</span>
                      <span>❤️ {toBanglaNumber(featuredWork.likes)} পাঠকের ভালোলাগা</span>
                    </div>

                    <button
                      onClick={() => onReadWork(featuredWork)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-[#9E2A2B] hover:text-[#6E1A1B] group cursor-pointer"
                    >
                      <span>সম্পূর্ণ পড়ুন</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Mini Platform Stats */}
              <div className="mt-6 pt-5 border-t border-[#E5DCCB] grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-[#F5EFE6]">
                  <div className="font-heading text-xl font-extrabold text-[#9E2A2B]">
                    {toBanglaNumber(worksCount)}+
                  </div>
                  <div className="text-xs text-[#5E544C]">প্রকাশিত রচনা</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5EFE6]">
                  <div className="font-heading text-xl font-extrabold text-[#1F4E5B]">
                    {toBanglaNumber(booksCount)}+
                  </div>
                  <div className="text-xs text-[#5E544C]">সংগ্রাহক গ্রন্থ</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5EFE6]">
                  <div className="font-heading text-xl font-extrabold text-[#8B5E3C]">
                    ১০০%
                  </div>
                  <div className="text-xs text-[#5E544C]">উন্মুক্ত পাঠ ও প্রকাশ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
