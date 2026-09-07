import { ArrowRight } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-rose-50/50 rounded-2xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 border border-rose-100/50">
        <div className="max-w-md space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-rose-600 bg-white px-3 py-1 rounded-full border border-rose-100 shadow-sm">
            New Collection
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Elevate Your Lifestyle with Premium Products
          </h1>
          <p className="text-gray-600 text-sm">
            Discover carefully curated products designed for quality, style, and everyday comfort.
          </p>
          <div className="pt-2">
            <button className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-6 py-3 rounded-lg text-sm flex items-center gap-2 shadow-sm hover:shadow transition">
              Shop Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 h-72 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-medium overflow-hidden">
          <img src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=800" alt="Hero Banner" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}