import {
  Heart,
  Bookmark,
  BookOpen,
  Clock,
  MessageSquare,
  Feather,
  Mail,
  Library,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { toBanglaNumber } from '../data/literaryData';

const categoryStyles = {
  কবিতা: {
    badgeBg: 'bg-[#9E2A2B]/12 text-[#9E2A2B] border-[#9E2A2B]/25',
    icon: Feather,
  },
  পত্র: {
    badgeBg: 'bg-[#B45309]/12 text-[#B45309] border-[#B45309]/25',
    icon: Mail,
  },
  গল্প: {
    badgeBg: 'bg-[#1F4E5B]/12 text-[#1F4E5B] border-[#1F4E5B]/25',
    icon: BookOpen,
  },
  বই: {
    badgeBg: 'bg-[#2E5A44]/12 text-[#2E5A44] border-[#2E5A44]/25',
    icon: Library,
  },
};

export default function WorkCard({
  work,
  onRead,
  onToggleLike,
  isLiked,
  onToggleBookmark,
  isBookmarked,
  onDelete,
  onGoToBookshop,
}) {
  const style = categoryStyles[work.category] || categoryStyles['কবিতা'];
  const CategoryIcon = style.icon;

  return (
    <article
      className={`group rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-xl ${
        work.category === 'পত্র'
          ? 'bg-[#FCF8EE] border-[#DFC99B] hover:border-[#B45309]'
          : 'bg-[#FDFBF7] border-[#E5DCCB] hover:border-[#C89D54]'
      }`}
    >
      <div>
        {/* Image Header */}
        <div className="relative h-48 overflow-hidden bg-[#EADBC8]">
          <img
            src={
              work.coverImage ||
              'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80'
            }
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18]/80 via-[#1E1B18]/20 to-transparent" />

          {/* Top Bar Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAF6F0]/95 text-[#1E1B18] shadow-xs">
              <CategoryIcon className="w-3.5 h-3.5 text-[#9E2A2B]" />
              <span>{work.category}</span>
            </span>

            <div className="flex items-center gap-1.5">
              {work.isUserSubmitted && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#2E5A44] text-white shadow-xs">
                  আমার রচনা
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(work.id);
                }}
                title={isBookmarked ? 'সংরক্ষিত তালিকা থেকে সরান' : 'সংরক্ষণ করুন'}
                className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#F3C663] text-[#1E1B18]'
                    : 'bg-black/40 text-white hover:bg-black/65'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bottom Meta inside Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-[#F5EFE6]">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#F3C663]" />
              {work.readTime || '৩ মিনিট'} পাঠ
            </span>
            <span>{work.date}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 space-y-3">
          {/* Special Recipient Banner if it's a Letter (পত্র) */}
          {work.category === 'পত্র' && work.recipient && (
            <div className="px-3 py-1.5 rounded-lg bg-[#F5E8C7]/70 border border-dashed border-[#C89D54] text-xs text-[#78350F] flex items-center justify-between">
              <span>✉️ প্রাপক: <strong>{work.recipient}</strong></span>
              {work.locationDate && <span className="text-[11px] opacity-80">{work.locationDate.split('•')[0]}</span>}
            </div>
          )}

          {/* Special Book Price Banner if it's a Book (বই) */}
          {work.category === 'বই' && work.bookPrice && (
            <div className="px-3 py-1.5 rounded-lg bg-[#2E5A44]/10 border border-[#2E5A44]/25 text-xs text-[#2E5A44] flex items-center justify-between font-semibold">
              <span>📚 মুদ্রিত মূল্য: ৳ {toBanglaNumber(work.bookPrice)}</span>
              {work.publisher && <span>প্রকাশনী: {work.publisher}</span>}
            </div>
          )}

          <div>
            <h3
              onClick={() => onRead(work)}
              className="font-heading text-xl font-bold text-[#1E1B18] group-hover:text-[#9E2A2B] transition-colors cursor-pointer line-clamp-2"
            >
              {work.title}
            </h3>
            <p className="text-sm font-semibold text-[#6E655F] mt-1">
              কলমে: <span className="text-[#9E2A2B]">{work.author}</span>
              {work.authorRole && (
                <span className="text-xs text-[#8C827A] font-normal"> • {work.authorRole}</span>
              )}
            </p>
          </div>

          <p className="text-sm text-[#4A423B] line-clamp-3 leading-relaxed whitespace-pre-line">
            {work.excerpt || work.content}
          </p>

          {/* Tags */}
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {work.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-[#F3ECE1] text-[#5E544C] text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3.5 bg-[#F6F0E6]/70 border-t border-[#E5DCCB] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleLike(work.id)}
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isLiked
                ? 'bg-[#9E2A2B]/15 text-[#9E2A2B]'
                : 'text-[#5E544C] hover:bg-[#E8DFD1]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#9E2A2B] text-[#9E2A2B]' : ''}`} />
            <span>{toBanglaNumber(work.likes || 0)}</span>
          </button>

          <button
            onClick={() => onRead(work)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5E544C] hover:text-[#1E1B18] cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{toBanglaNumber(work.comments?.length || 0)} মন্তব্য</span>
          </button>

          {work.isUserSubmitted && onDelete && (
            <button
              onClick={() => onDelete(work.id)}
              title="রচনাটি মুছে ফেলুন"
              className="p-1.5 rounded-lg text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {work.category === 'বই' && onGoToBookshop && (
            <button
              onClick={onGoToBookshop}
              title="বইটি কিনুন"
              className="p-2 rounded-xl bg-[#2E5A44] hover:bg-[#234735] text-white transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onRead(work)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>সম্পূর্ণ পড়ুন</span>
          </button>
        </div>
      </div>
    </article>
  );
}
