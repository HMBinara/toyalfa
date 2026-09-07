import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopAnnouncement from './TopAnnouncement';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import AuthModal from '../common/AuthModal';

export default function MainLayout() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      <TopAnnouncement />
      <Navbar onOpenAuth={() => setAuthOpen(true)} />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}