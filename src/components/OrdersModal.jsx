import { X, PackageCheck, Calendar, MapPin, CreditCard } from 'lucide-react';
import { toBanglaNumber } from '../data/literaryData';

export default function OrdersModal({ isOpen, onClose, orders }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-[#FAF6F0] border border-[#D8CBB8] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="px-6 py-4 bg-[#1E1B18] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#F3C663]" />
            <h3 className="font-heading text-lg font-bold">
              আমার সম্পন্ন অর্ডারসমূহ ({toBanglaNumber(orders.length)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <p className="text-center text-sm text-[#6E655F] py-8">
              এখনো কোনো অর্ডার করা হয়নি।
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.orderId}
                className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5DCCB] space-y-3 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFE6D5]">
                  <div>
                    <span className="text-xs font-bold text-[#9E2A2B] block">
                      অর্ডার আইডি: #{order.orderId}
                    </span>
                    <span className="text-xs text-[#6E655F] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" /> {order.date}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#2E5A44]/15 text-[#2E5A44] text-xs font-bold">
                    ✓ {order.status || 'অর্ডার গৃহীত ও প্রক্রিয়াধীন'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A423B]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9E2A2B] shrink-0" />
                    <span>
                      <strong>{order.customerName}</strong> ({order.phone}) — {order.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:justify-end">
                    <CreditCard className="w-3.5 h-3.5 text-[#1F4E5B]" />
                    <span>মাধ্যম: {order.paymentMethod}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#F5EFE6] space-y-1 text-xs">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.title} × {toBanglaNumber(item.quantity)}
                      </span>
                      <span className="font-bold">
                        ৳ {toBanglaNumber(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1.5 mt-1.5 border-t border-[#D8CBB8] flex justify-between font-heading text-sm font-extrabold text-[#9E2A2B]">
                    <span>সর্বমোট বিল (ডেলিভারিসহ):</span>
                    <span>৳ {toBanglaNumber(order.grandTotal)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
