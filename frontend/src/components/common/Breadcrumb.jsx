import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  // items = [{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Product Name' }]
  return (
    <nav className="flex items-center gap-1 text-xs text-gray-400" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={13} className="text-gray-300 flex-shrink-0" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-rose-500 transition font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium truncate max-w-[200px]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
