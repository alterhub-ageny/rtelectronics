import React from 'react';
import { LayoutDashboard, ShoppingBag, Settings } from 'lucide-react';

export default function Layout({ children, currentRoute, onNavigate }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <nav className="border-b border-red-900/50 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('showcase')}>
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white">RT</div>
            <span className="font-black tracking-tighter text-xl">ELECTRONICS</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('showcase')}
              className={`p-2 rounded-full ${currentRoute === 'showcase' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
            >
              <ShoppingBag size={20} />
            </button>
            <button 
              onClick={() => onNavigate('admin')}
              className={`p-2 rounded-full ${currentRoute === 'admin' ? 'bg-red-600' : 'hover:bg-gray-800'}`}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-6">{children}</main>
    </div>
  );
}
