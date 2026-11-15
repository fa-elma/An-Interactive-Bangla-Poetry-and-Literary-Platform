import { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Send,
  MessageSquare,
  Feather,
  Mail,
  BookOpen,
  Check,
  Clock,
} from 'lucide-react';
import { toBanglaNumber } from '../data/literaryData';

export default function ReaderModal({
  work,
  onClose,
  onToggleLike,
  isLiked,
  onToggleBookmark,
  isBookmarked,
  onAddComment,
}) {
  const [fontSize, setFontSize] = useState(19); // px
  const [readerTheme, setReaderTheme] = useState('sepia'); // 'sepia' | 'light' | 'dark'
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!work) return null;

  const themeClasses = {
    sepia: {
      modalBg: 'bg-[#FAF3E3] text-[#241E18]',
      headerBg: 'bg-[#F3E8D0] border-[#DFC9A6]',
      contentBox:
        work.category === 'পত্র'
          ? 'letter-ruled-paper border-[#D8BE8E]'
          : 'bg-[#FDF9F0] border-[#E5D5B5]',
      muted: 'text-[#6E6053]',
    },
    light: {
      modalBg: 'bg-white text-[#18181B]',
      headerBg: 'bg-gray-50 border-gray-200',
      contentBox: 'bg-gray-50/70 border-gray-200',
      muted: 'text-gray-600',
    },
    dark: {
      modalBg: 'bg-[#181615] text-[#EDE6DC]',
      headerBg: 'bg-[#221F1D] border-[#38322E]',
      contentBox: 'bg-[#211E1C] border-[#38322E]',
      muted: 'text-[#A89E93]',
    },
  };

  const currentTheme = themeClasses[readerTheme];

  const handleCopyShare = () => {
    const shareString = `“${work.title}” — ${work.author}\n\n${work.excerpt || work.content.slice(0, 180)}...`;
    navigator.clipboard?.writeText(shareString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSpeechToggle = () => {
    if (!('speechSynthesis' in window)) {
      alert('আপনার ব্রাউজারে অডিও পাঠ সুবিধাটি সমর্থিত নয়।');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${work.title}। লিখেছেন ${work.author}। ${work.content}`);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.92;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(work.id, {
      id: `c-${Date.now()}`,
      user: commentAuthor.trim() || 'সাহিত্যপ্রেমী পাঠক',
      date: 'এইমাত্র',
      text: commentText.trim(),
    });
    setCommentText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-[#D8CBB8] flex flex-col overflow-hidden transition-colors ${currentTheme.modalBg}`}
      >
        {/* Top Control Toolbar */}
        <div
          className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${currentTheme.headerBg}`}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E2A2B] text-white text-xs font-bold">
              {work.category === 'পত্র' ? (
                <Mail className="w-3.5 h-3.5" />
              ) : work.category === 'কবিতা' ? (
                <Feather className="w-3.5 h-3.5" />
              ) : (
                <BookOpen className="w-3.5 h-3.5" />
              )}
              <span>{work.category}</span>
            </span>
            <span className={`text-xs font-medium flex items-center gap-1 ${currentTheme.muted}`}>
              <Clock className="w-3.5 h-3.5" />
              {work.readTime || '৩ মিনিট'} পাঠ
            </span>
          </div>

          {/* Reader Customization Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Font size adjuster */}
            <div className="flex items-center rounded-xl border border-[#C89D54]/50 overflow-hidden text-xs font-bold">
              <button
                onClick={() => setFontSize((s) => Math.max(15, s - 2))}
                className="px-2.5 py-1.5 hover:bg-[#9E2A2B]/15 transition-colors cursor-pointer"
                title="অক্ষরের আকার ছোট করুন"
              >
                অ-
              </button>
              <span className="px-2 py-1.5 border-x border-[#C89D54]/40 text-[11px]">
                {toBanglaNumber(fontSize)}px
              </span>
              <button
                onClick={() => setFontSize((s) => Math.min(27, s + 2))}
                className="px-2.5 py-1.5 hover:bg-[#9E2A2B]/15 transition-colors cursor-pointer"
                title="অক্ষরের আকার বড় করুন"
              >
                অ+
              </button>
            </div>

            {/* Theme switcher */}
            <div className="flex items-center gap-1 bg-black/5 p-1 rounded-xl">
              {[
                { id: 'sepia', label: 'পার্চমেন্ট', dot: 'bg-[#F3E2C3]' },
                { id: 'light', label: 'সাদা', dot: 'bg-white' },
                { id: 'dark', label: 'রাত্রি', dot: 'bg-[#1E1B18]' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setReaderTheme(t.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    readerTheme === t.id
                      ? 'bg-[#9E2A2B] text-white shadow-xs'
                      : 'hover:bg-black/10'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full border border-gray-400 ${t.dot}`} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Audio Recitation Button */}
            <button
              onClick={handleSpeechToggle}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-[#9E2A2B] text-white border-[#9E2A2B]'
                  : 'border-[#C89D54] hover:bg-[#C89D54]/20'
              }`}
              title="ধ্বনি পাঠ / আবৃত্তি শুনুন"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden md:inline">{isSpeaking ? 'পাঠ থামান' : 'শ্রুতিপাঠ'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#9E2A2B]/15 hover:bg-[#9E2A2B] text-[#9E2A2B] hover:text-white transition-colors cursor-pointer"
              aria-label="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reading Body */}
        <div className="overflow-y-auto p-5 sm:p-8 md:p-10 space-y-8">
          {/* Literary Title & Author Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 border-b border-dashed border-[#C89D54]/50 pb-6">
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
              {work.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
              <span className="font-bold text-[#9E2A2B]">{work.author}</span>
              {work.authorRole && (
                <span className={currentTheme.muted}>• {work.authorRole}</span>
              )}
              {work.date && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border border-[#C89D54]/40 ${currentTheme.muted}`}>
                  {work.date}
                </span>
              )}
            </div>
          </div>

          {/* Main Literary Canvas */}
          <div
            className={`max-w-2xl mx-auto rounded-2xl border p-6 sm:p-10 shadow-inner transition-all ${currentTheme.contentBox}`}
          >
            {/* If it's a Letter (পত্র), show Postmark & Recipient header */}
            {work.category === 'পত্র' && (
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-4 border-b border-[#C89D54]/40">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#8B5E3C] font-bold block">
                    প্রাপক
                  </span>
                  <p className="font-heading text-lg font-bold text-[#9E2A2B]">
                    {work.recipient || 'প্রিয় পাঠক'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded-md border-2 border-dashed border-[#9E2A2B]/60 text-xs font-bold text-[#9E2A2B] rotate-[-2deg]">
                    ✉️ ডাকঘর সাহিত্যকানন • {work.locationDate || work.date}
                  </div>
                </div>
              </div>
            )}

            {/* Main Text Content */}
            <div
              style={{ fontSize: `${fontSize}px`, lineHeight: work.category === 'কবিতা' ? '1.95' : '1.85' }}
              className={`whitespace-pre-line ${
                work.category === 'কবিতা' ? 'sm:pl-6 border-l-2 border-[#C89D54]/50' : ''
              }`}
            >
              {work.content}
            </div>

            {/* Decorative Ornament Footer */}
            <div className="mt-10 pt-6 border-t border-dashed border-[#C89D54]/40 flex items-center justify-between text-xs opacity-75">
              <span>❦ সাহিত্যকানন সংকলন</span>
              <span>রচনাকাল: {work.date || '১৪৩৩ বঙ্গাব্দ'}</span>
            </div>
          </div>

          {/* Action Bar: Like, Bookmark, Copy/Share */}
          <div className="max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#9E2A2B]/8 border border-[#9E2A2B]/20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleLike(work.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-[#9E2A2B] text-white shadow-sm'
                    : 'bg-white text-[#1E1B18] border border-[#D8CBB8] hover:border-[#9E2A2B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : 'text-[#9E2A2B]'}`} />
                <span>ভালোবাসা জানান ({toBanglaNumber(work.likes || 0)})</span>
              </button>

              <button
                onClick={() => onToggleBookmark(work.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-[#F3C663] text-[#1E1B18]'
                    : 'bg-white text-[#1E1B18] border border-[#D8CBB8]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'সংরক্ষিত আছে' : 'সংরক্ষণ করুন'}</span>
              </button>
            </div>

            <button
              onClick={handleCopyShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F4E5B] hover:bg-[#163A44] text-white font-bold text-sm transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#F3C663]" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'উদ্ধৃতি কপি হয়েছে!' : 'উদ্ধৃতি শেয়ার করুন'}</span>
            </button>
          </div>

          {/* Reader Comments Section */}
          <div className="max-w-2xl mx-auto space-y-5 pt-4">
            <h3 className="font-heading text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#9E2A2B]" />
              <span>পাঠকের অনুভূতি ও মন্তব্য ({toBanglaNumber(work.comments?.length || 0)})</span>
            </h3>

            {/* Add Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              className={`p-4 rounded-2xl border space-y-3 ${currentTheme.contentBox}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder="আপনার নাম (ঐচ্ছিক)"
                  className="px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-transparent text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
                <div className="sm:col-span-2 flex gap-2">
                  <input
                    type="text"
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="এই রচনাটি পড়ে আপনার অনুভূতি লিখুন..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-transparent text-sm focus:outline-none focus:border-[#9E2A2B]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white font-bold text-sm inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>প্রকাশ</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {work.comments && work.comments.length > 0 ? (
                work.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border ${currentTheme.contentBox} flex items-start justify-between gap-3`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-[#9E2A2B]">
                          {c.user}
                        </span>
                        <span className={`text-xs ${currentTheme.muted}`}>• {c.date}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-sm italic ${currentTheme.muted}`}>
                  এখনো কোনো মন্তব্য যুক্ত হয়নি। প্রথম পাঠক হিসেবে আপনার অনুভূতি জানান!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
