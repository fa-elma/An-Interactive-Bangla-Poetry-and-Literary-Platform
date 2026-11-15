import { useState } from 'react';
import {
  BookOpen,
  Feather,
  ShoppingBag,
  Bookmark,
  Menu,
  X,
  PenTool,
  Library,
  Sparkles,
  PackageCheck,
  ShieldCheck,
  LogIn,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { toBanglaNumber } from '../data/literaryData';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  onOpenCart,
  bookmarksCount,
  ordersCount,
  onOpenOrders,
  currentUser,
  onOpenAuth,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'সাহিত্য পাঠশালা', icon: BookOpen },
    { id: 'bookshop', label: 'গ্রন্থবিপণি (বই কিনুন)', icon: Library },
    { id: 'submit', label: 'লেখা সাবমিট করুন', icon: PenTool },
    {
      id: 'bookmarks',
      label: 'সংরক্ষিত পাঠ',
      icon: Bookmark,
      badge: bookmarksCount > 0 ? toBanglaNumber(bookmarksCount) : null,
    },
    {
      id: 'admin',
      label: 'অ্যাডমিন প্যানেল',
      icon: ShieldCheck,
    },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E5DCCB] shadow-xs">
      {/* Top literary ribbon */}
      <div className="bg-[#9E2A2B] text-[#FAF6F0] text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#F3C663] shrink-0" />
            <span>
              বাংলা কবিতা, চিঠি, গল্প ও বইয়ের উন্মুক্ত সাহিত্য মঞ্চ — আপনার লেখা প্রকাশ করতে লগইন করুন
            </span>
          </p>
          <div className="hidden md:flex items-center gap-4 text-xs text-[#F5EBE6]">
            <span>
              কুপন কোড:{' '}
              <strong className="text-[#F3C663] tracking-wider">BOIMELA20</strong> (বই ক্রয়ে ২০% ছাড়)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('explore')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#9E2A2B] to-[#6E1A1B] flex items-center justify-center text-[#FAF6F0] shadow-md group-hover:scale-105 transition-transform">
              <Feather className="w-6 h-6 text-[#F3C663]" />
            </div>
            <div>
              <span className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18] group-hover:text-[#9E2A2B] transition-colors block leading-none">
                সাহিত্যকানন
              </span>
              <span className="text-xs text-[#6E655F] font-medium block mt-1">
                কবিতা • পত্র • গল্প • গ্রন্থবিপণি
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#9E2A2B] text-[#FAF6F0] shadow-sm'
                      : 'text-[#3D352E] hover:bg-[#EFE6D5] hover:text-[#9E2A2B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.5 text-xs rounded-full font-bold ${
                        isActive
                          ? 'bg-[#F3C663] text-[#1E1B18]'
                          : 'bg-[#9E2A2B]/15 text-[#9E2A2B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons: Orders, Book Cart & Hamburger Menu */}
          <div className="flex items-center gap-2.5">
            {ordersCount > 0 && (
              <button
                onClick={onOpenOrders}
                title="আমার অর্ডারসমূহ"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#D8CBB8] bg-[#FDFBF7] hover:bg-[#EFE6D5] text-[#3D352E] text-xs font-semibold transition-colors cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-[#2E5A44]" />
                <span>অর্ডার ({toBanglaNumber(ordersCount)})</span>
              </button>
            )}

            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#332D27] text-[#FAF6F0] text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#F3C663]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#9E2A2B] text-white text-[11px] font-bold flex items-center justify-center border border-[#FAF6F0]">
                    {toBanglaNumber(cartCount)}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">বইয়ের ঝুড়ি</span>
              {cartTotal > 0 && (
                <span className="hidden md:inline-block text-xs bg-[#FAF6F0]/15 px-2 py-0.5 rounded-md text-[#F3C663]">
                  ৳ {toBanglaNumber(cartTotal)}
                </span>
              )}
            </button>

            {/* Hamburger Menu Button (Always accessible for Login / Account & Navigation) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              className="relative p-2.5 rounded-xl border border-[#D8CBB8] bg-[#FDFBF7] text-[#1E1B18] hover:bg-[#EFE6D5] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {currentUser && (
                <span
                  title={`লগইনকৃত: ${currentUser.name}`}
                  className=" -top-1 -right-1 absolute w-3 h-3 rounded-full bg-[#2E5A44] border-2 border-[#FAF6F0]"
                />
              )}
            </button>
          </div>
        </div>

        {/* Hamburger Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:absolute xl:right-8 xl:top-20 xl:w-80 xl:rounded-2xl xl:border xl:border-[#D8CBB8] bg-[#FDFBF7] border-b border-[#E5DCCB] px-4 pt-3 pb-4 space-y-2 shadow-xl z-50">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#9E2A2B] text-[#FAF6F0]'
                        : 'text-[#3D352E] hover:bg-[#EFE6D5]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                          isActive
                            ? 'bg-[#F3C663] text-[#1E1B18]'
                            : 'bg-[#9E2A2B] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Login & User Account Section inside Hamburger */}
            <div className="pt-3 border-t border-[#E5DCCB] space-y-2">
              <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-[#7A6F66]">
                অ্যাকাউন্ট ও লগইন
              </div>
              {currentUser ? (
                <div className="p-3.5 rounded-xl bg-[#F3ECE1] border border-[#D8CBB8] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-heading font-bold text-sm text-[#1E1B18]">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-[#6E655F]">{currentUser.email}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#9E2A2B]/15 text-[#9E2A2B] text-[11px] font-bold">
                      {currentUser.role === 'admin' ? '🛡️ অ্যাডমিন' : '✍️ লেখক'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>লগআউট করুন</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>লগইন</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="py-2.5 px-3 rounded-xl bg-[#1F4E5B] hover:bg-[#163A44] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>নিবন্ধন</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
