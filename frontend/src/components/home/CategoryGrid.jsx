
export default function CategoryGrid({ categories }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-gray-50 hover:bg-white rounded-xl p-4 text-center hover:shadow-md transition cursor-pointer border border-gray-100">
            <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover shadow-sm" />
            <span className="text-xs font-semibold text-gray-700">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}