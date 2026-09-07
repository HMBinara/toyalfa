import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BarChart3, Edit3, Package, Plus, Trash2, X } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Navbar from '../components/layout/Navbar';
import { useProductStore } from '../store/productStore';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { MOCK_USERS, MONTHLY_REVENUE } from '../data/mockData';

export default function AdminPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const products = useProductStore((state) => state.products);
  const addProduct = useProductStore((state) => state.addProduct);
  const editProduct = useProductStore((state) => state.editProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const orders = useOrderStore((state) => state.orders);
  const updateOrderStatus = useOrderStore((state) => state.updateOrderStatus);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Toys & Games', price: '', stock: '', image: '', description: '' });

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access Denied: Admin privileges required.');
      navigate('/', { replace: true });
    }
  }, [navigate, user?.role]);

  if (user?.role !== 'admin') return null;

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lowStock = products.filter((product) => product.stock < 10).length;
  const openForm = (product = null) => {
    setEditingProduct(product);
    setFormOpen(true);
    setForm(product ? { name: product.name, category: product.category, price: product.price, stock: product.stock, image: product.image, description: product.description || '' } : { name: '', category: 'Toys & Games', price: '', stock: '', image: '', description: '' });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const updates = { ...form, price: Number(form.price), stock: Number(form.stock), image: form.image || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=600' };
    if (editingProduct) editProduct(editingProduct.id, updates); else addProduct(updates);
    setEditingProduct(null);
    setFormOpen(false);
  };
  const advanceOrder = (order) => {
    const nextStatus = { Processing: 'Shipped', Shipped: 'Delivered', Delivered: 'Processing' }[order.status] || 'Processing';
    updateOrderStatus(order.id, nextStatus);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800"><Navbar /><main className="max-w-7xl mx-auto px-6 py-10"><div className="flex items-center justify-between mb-8"><div><p className="text-sm text-rose-500 font-semibold">Management</p><h1 className="text-3xl font-bold text-gray-900 mt-1">Admin dashboard</h1></div><span className="text-sm text-gray-500">{products.length} products · {orders.length} orders</span></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{[['Total sales', `$${totalSales.toFixed(2)}`, 'text-rose-500'], ['Total orders', orders.length, 'text-blue-500'], ['Active customers', MOCK_USERS.filter((item) => item.role === 'customer').length, 'text-emerald-500'], ['Low stock alert', lowStock, 'text-amber-500']].map(([label, value, color]) => <div key={label} className="bg-white border border-gray-100 rounded-xl p-5"><BarChart3 size={19} className={color} /><p className="text-xs text-gray-500 mt-4">{label}</p><p className="text-2xl font-bold text-gray-900 mt-1">{value}</p></div>)}</div>
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8 mb-8"><section className="bg-white border border-gray-100 rounded-xl p-6"><div className="flex items-center justify-between mb-5"><h2 className="font-semibold text-gray-900">Revenue overview</h2><span className="text-xs text-gray-400">Last 7 months</span></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={MONTHLY_REVENUE}><CartesianGrid vertical={false} stroke="#f3f4f6" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(value) => `$${value / 1000}k`} /><Tooltip formatter={(value) => [`$${value}`, 'Revenue']} /><Bar dataKey="revenue" fill="#f43f5e" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></section><section className="bg-white border border-gray-100 rounded-xl p-6"><h2 className="font-semibold text-gray-900 mb-5">Order management</h2><div className="space-y-3">{orders.map((order) => <div key={order.id} className="border border-gray-100 rounded-lg p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold text-gray-900">{order.id}</p><p className="text-xs text-gray-500 mt-1">{order.name || order.email || 'Customer'}</p></div><Package size={17} className="text-rose-500" /></div><div className="flex items-center justify-between mt-3"><span className="font-semibold text-sm">${Number(order.total).toFixed(2)}</span><button onClick={() => advanceOrder(order)} className="text-xs font-semibold text-rose-600 hover:text-rose-700">{order.status} <span className="text-gray-400">→</span></button></div></div>)}</div></section></div>
      <section className="bg-white border border-gray-100 rounded-xl p-6"><div className="flex items-center justify-between mb-5"><h2 className="font-semibold text-gray-900">Product catalog</h2><button onClick={() => openForm()} className="flex items-center gap-2 text-sm bg-gray-900 hover:bg-rose-600 text-white rounded-lg px-3 py-2 transition"><Plus size={15} /> Add product</button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100"><th className="pb-3">Product</th><th className="pb-3">Category</th><th className="pb-3">Price</th><th className="pb-3">Stock</th><th className="pb-3 text-right">Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id} className="border-b border-gray-50 last:border-0"><td className="py-3"><div className="flex items-center gap-3"><img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover" /><span className="font-semibold text-gray-900 min-w-48">{product.name}</span></div></td><td className="py-3 text-gray-500">{product.category}</td><td className="py-3 font-semibold">${product.price.toFixed(2)}</td><td className="py-3"><span className={product.stock < 10 ? 'text-amber-600' : 'text-gray-500'}>{product.stock}</span></td><td className="py-3"><div className="flex justify-end gap-3"><button onClick={() => openForm(product)} className="text-gray-400 hover:text-rose-600" title="Edit product"><Edit3 size={16} /></button><button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500" title="Delete product"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></section>
    </main>{formOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/40" onClick={() => { setEditingProduct(null); setFormOpen(false); setForm({ name: '', category: 'Toys & Games', price: '', stock: '', image: '', description: '' }); }} /><form onSubmit={handleSubmit} className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4"><button type="button" onClick={() => { setEditingProduct(null); setFormOpen(false); setForm({ name: '', category: 'Toys & Games', price: '', stock: '', image: '', description: '' }); }} className="absolute top-4 right-4 text-gray-400"><X size={18} /></button><h2 className="text-lg font-bold text-gray-900">{editingProduct ? 'Edit product' : 'Add product'}</h2><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Product name" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><div className="grid grid-cols-2 gap-3"><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm"><option>Toys & Games</option><option>STEM & Learning</option><option>Action Figures</option><option>Outdoor Play</option><option>Plush Toys</option><option>Baby & Toddler</option></select><input required type="number" min="0" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Price" className="border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div><input required type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="Stock quantity" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} placeholder="Image URL (optional)" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /><textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-20" /><button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg py-2.5">{editingProduct ? 'Save changes' : 'Create product'}</button></form></div> : null}</div>
  );
}