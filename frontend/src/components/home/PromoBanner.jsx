
export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-4 my-6">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-rose-950 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest">Limited Offer</span>
          <h3 className="text-2xl font-bold">Get 20% Off Your First Purchase</h3>
          <p className="text-xs text-gray-300">Use promo code <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-white font-bold">TOYALFA20</span> at checkout.</p>
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs px-6 py-3 rounded-xl transition whitespace-nowrap shadow-sm">
          Claim Discount
        </button>
      </div>
    </section>
  );
}