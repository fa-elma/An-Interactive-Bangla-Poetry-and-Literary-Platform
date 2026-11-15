import { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Tag,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { toBanglaNumber, createOrderId } from '../data/literaryData';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) {
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, percent }
  const [couponError, setCouponError] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('inside'); // 'inside' (60) | 'outside' (100)

  // Customer checkout fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'bkash' | 'nagad'
  const [txId, setTxId] = useState('');
  const [lastOrder, setLastOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon
    ? Math.round((subtotal * appliedCoupon.percent) / 100)
    : 0;
  const deliveryCharge = cart.length > 0 ? (deliveryZone === 'inside' ? 60 : 100) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === 'BOIMELA20') {
      setAppliedCoupon({ code: 'BOIMELA20', percent: 20 });
      setCouponError('');
    } else if (code === 'SAHITYA10') {
      setAppliedCoupon({ code: 'SAHITYA10', percent: 10 });
      setCouponError('');
    } else {
      setCouponError('সঠিক কুপন কোড দিন (যেমন: BOIMELA20)');
    }
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    const newOrder = {
      orderId: createOrderId(),
      date: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      paymentMethod:
        paymentMethod === 'cod'
          ? 'ক্যাশ অন ডেলিভারি'
          : paymentMethod === 'bkash'
          ? 'বিকাশ (bKash)'
          : 'নগদ (Nagad)',
      items: cart.map((i) => ({
        id: i.id,
        title: i.title,
        author: i.author,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      discountAmount,
      deliveryCharge,
      grandTotal,
    };

    onPlaceOrder(newOrder);
    setLastOrder(newOrder);
    onClearCart();
    setStep('success');
  };

  const handleCloseDrawer = () => {
    setStep('cart');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      onClick={handleCloseDrawer}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FAF6F0] h-full shadow-2xl border-l border-[#D8CBB8] flex flex-col justify-between overflow-hidden"
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-[#1E1B18] text-[#FAF6F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#F3C663]" />
            <h2 className="font-heading text-xl font-bold">
              {step === 'cart'
                ? 'আপনার বইয়ের ঝুড়ি'
                : step === 'checkout'
                ? 'অর্ডার ও ডেলিভারি তথ্য'
                : 'অর্ডার সফল হয়েছে!'}
            </h2>
          </div>
          <button
            onClick={handleCloseDrawer}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#EFE6D5] text-[#9E2A2B] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#1E1B18]">
                    আপনার ঝুড়িতে এখনো কোনো বই নেই
                  </h3>
                  <p className="text-sm text-[#6E655F] max-w-xs mx-auto">
                    গ্রন্থবিপণি থেকে আপনার পছন্দের কবিতা, উপন্যাস বা গল্পের বই ঝুড়িতে যুক্ত করুন।
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] flex items-center gap-3.5 shadow-2xs"
                      >
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-14 h-20 object-cover rounded-md border border-[#D8CBB8] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-heading font-bold text-sm text-[#1E1B18] truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#6E655F] truncate">{item.author}</p>
                          <p className="text-sm font-extrabold text-[#9E2A2B] mt-1">
                            ৳ {toBanglaNumber(item.price * item.quantity)}{' '}
                            <span className="text-xs font-normal text-[#7A6F66]">
                              (৳ {toBanglaNumber(item.price)} × {toBanglaNumber(item.quantity)})
                            </span>
                          </p>
                        </div>

                        {/* Qty Controls */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                            className="p-1.5 rounded-lg border border-[#D8CBB8] hover:bg-[#EFE6D5] cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold">
                            {toBanglaNumber(item.quantity)}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="p-1.5 rounded-lg border border-[#D8CBB8] hover:bg-[#EFE6D5] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 rounded-lg text-red-700 hover:bg-red-100 ml-1 cursor-pointer"
                            title="সরান"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Box */}
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#4A423B]">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#9E2A2B]" />
                        ডিসকাউন্ট কুপন কোড
                      </span>
                      <button
                        type="button"
                        onClick={() => setCouponInput('BOIMELA20')}
                        className="text-[#9E2A2B] underline cursor-pointer"
                      >
                        BOIMELA20 ব্যবহার করুন
                      </button>
                    </div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="কুপন কোড লিখুন (BOIMELA20)"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-[#D8CBB8] bg-[#FAF6F0] text-xs uppercase font-mono focus:outline-none focus:border-[#9E2A2B]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-[#1F4E5B] hover:bg-[#163A44] text-white text-xs font-bold cursor-pointer"
                      >
                        প্রয়োগ
                      </button>
                    </form>
                    {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                    {appliedCoupon && (
                      <p className="text-xs font-bold text-[#2E5A44]">
                        ✓ ‘{appliedCoupon.code}’ কুপনে {toBanglaNumber(appliedCoupon.percent)}% ছাড় যুক্ত হয়েছে!
                      </p>
                    )}
                  </div>

                  {/* Delivery Area Selection */}
                  <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] space-y-2.5">
                    <span className="text-xs font-bold text-[#4A423B] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#9E2A2B]" />
                      ডেলিভারি এলাকা নির্বাচন করুন
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('inside')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          deliveryZone === 'inside'
                            ? 'bg-[#9E2A2B]/10 border-[#9E2A2B] text-[#9E2A2B]'
                            : 'bg-[#FAF6F0] border-[#D8CBB8] text-[#4A423B]'
                        }`}
                      >
                        <div>ঢাকার ভেতরে</div>
                        <div className="text-[11px] opacity-80">চার্জ: ৳ ৬০</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('outside')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                          deliveryZone === 'outside'
                            ? 'bg-[#9E2A2B]/10 border-[#9E2A2B] text-[#9E2A2B]'
                            : 'bg-[#FAF6F0] border-[#D8CBB8] text-[#4A423B]'
                        }`}
                      >
                        <div>ঢাকার বাইরে (সারাদেশ)</div>
                        <div className="text-[11px] opacity-80">চার্জ: ৳ ১০০</div>
                      </button>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="p-4 rounded-2xl bg-[#F3ECE1] border border-[#DFC9A6] space-y-2 text-sm">
                    <div className="flex justify-between text-[#4A423B]">
                      <span>বইয়ের মোট মূল্য:</span>
                      <span className="font-bold">৳ {toBanglaNumber(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#2E5A44] font-semibold">
                        <span>কুপন ছাড় ({appliedCoupon?.code}):</span>
                        <span>- ৳ {toBanglaNumber(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[#4A423B]">
                      <span>কুরিয়ার ডেলিভারি চার্জ:</span>
                      <span className="font-bold">৳ {toBanglaNumber(deliveryCharge)}</span>
                    </div>
                    <div className="pt-2 border-t border-[#D8CBB8] flex justify-between font-heading text-lg font-extrabold text-[#9E2A2B]">
                      <span>সর্বমোট প্রদেয়:</span>
                      <span>৳ {toBanglaNumber(grandTotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9E2A2B] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ঝুড়িতে ফিরে যান</span>
              </button>

              <div>
                <label className="block text-xs font-bold text-[#2B2622] mb-1">
                  প্রাপকের পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-white text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2622] mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8CBB8] bg-white text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2B2622] mb-1">
                  বিস্তারিত ডেলিভারি ঠিকানা *
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাসা/রোড নম্বর, এলাকা, থানা ও জেলা..."
                  className="w-full p-3.5 rounded-xl border border-[#D8CBB8] bg-white text-sm focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#2B2622] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#9E2A2B]" />
                  পেমেন্ট পদ্ধতি নির্বাচন করুন
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'cod', label: 'ক্যাশ অন ডেলিভারি', sub: 'বই হাতে পেয়ে পরিশোধ' },
                    { id: 'bkash', label: 'বিকাশ (bKash)', sub: 'মোবাইল পেমেন্ট' },
                    { id: 'nagad', label: 'নগদ (Nagad)', sub: 'মোবাইল পেমেন্ট' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'bg-[#9E2A2B] text-white border-[#9E2A2B]'
                          : 'bg-white text-[#2B2622] border-[#D8CBB8]'
                      }`}
                    >
                      <div className="font-heading font-bold text-xs">{pm.label}</div>
                      <div className="text-[10px] opacity-80 mt-0.5">{pm.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="p-3.5 rounded-xl bg-[#FCF7EB] border border-[#C89D54] space-y-2">
                  <p className="text-xs text-[#78350F]">
                    আমাদের মার্চেন্ট নম্বর <strong>০১৭০০-০০০০০০</strong>-এ{' '}
                    <strong>৳ {toBanglaNumber(grandTotal)}</strong> সেন্ড মানি করে নিচে ট্রানজেকশন আইডি দিন:
                  </p>
                  <input
                    type="text"
                    required
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="Transaction ID (যেমন: 9H7K2L...)"
                    className="w-full px-3 py-2 rounded-lg border border-[#D8CBB8] bg-white text-xs"
                  />
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#F3ECE1] border border-[#D8CBB8] flex items-center justify-between">
                <span className="text-sm font-bold text-[#1E1B18]">সর্বমোট পরিশোধযোগ্য:</span>
                <span className="font-heading text-2xl font-extrabold text-[#9E2A2B]">
                  ৳ {toBanglaNumber(grandTotal)}
                </span>
              </div>
            </form>
          )}

          {step === 'success' && lastOrder && (
            <div className="p-6 rounded-2xl bg-[#FDFBF7] border-2 border-[#2E5A44] space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[#2E5A44]/15 text-[#2E5A44] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E5A44]">
                  অর্ডার রসিদ • {lastOrder.orderId}
                </span>
                <h3 className="font-heading text-2xl font-extrabold text-[#1E1B18]">
                  ধন্যবাদ, {lastOrder.customerName}!
                </h3>
                <p className="text-xs sm:text-sm text-[#5E544C]">
                  আপনার বইয়ের অর্ডারটি সফলভাবে গৃহীত হয়েছে। খুব শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
                </p>
              </div>

              <div className="text-left p-4 rounded-xl bg-[#F5EFE6] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6E655F]">অর্ডার আইডি:</span>
                  <span className="font-bold">{lastOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E655F]">মোবাইল:</span>
                  <span className="font-bold">{lastOrder.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E655F]">পেমেন্ট মাধ্যম:</span>
                  <span className="font-bold">{lastOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E655F]">ঠিকানা:</span>
                  <span className="font-bold">{lastOrder.address}</span>
                </div>
                <div className="pt-2 border-t border-[#D8CBB8] space-y-1">
                  {lastOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.title} × {toBanglaNumber(item.quantity)}
                      </span>
                      <span className="font-semibold">
                        ৳ {toBanglaNumber(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#D8CBB8] flex justify-between text-sm font-extrabold text-[#9E2A2B]">
                  <span>সর্বমোট বিল:</span>
                  <span>৳ {toBanglaNumber(lastOrder.grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCloseDrawer}
                className="w-full py-3 rounded-xl bg-[#9E2A2B] text-white font-bold text-sm cursor-pointer"
              >
                সাহিত্যকাননে ফিরে যান
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer Buttons */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-5 bg-[#FDFBF7] border-t border-[#D8CBB8]">
            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-xl bg-[#9E2A2B] hover:bg-[#7D2021] text-white font-heading text-base font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>অর্ডার প্রক্রিয়ায় এগিয়ে যান (৳ {toBanglaNumber(grandTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full py-3.5 rounded-xl bg-[#2E5A44] hover:bg-[#234735] text-white font-heading text-base font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5 text-[#F3C663]" />
                <span>অর্ডার নিশ্চিত করুন (৳ {toBanglaNumber(grandTotal)})</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
