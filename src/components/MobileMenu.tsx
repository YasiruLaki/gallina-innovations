'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react'; // Using lucide-react for icons

// Define the menu structure
const menuItems = [
    { name: 'Home', href: '/', subItems: [] },
    { name: 'Who we are?', href: '/about', subItems: [] },
    {
        name: 'Projects',
        href: '/projects',
        subItems: [
            { name: 'Residential', href: '/projects/residential' },
            { name: 'Industrial', href: '/projects/industrial' },
            { name: 'Landscape', href: '/projects/landscape' },
        ],
    },
    { name: 'Contact', href: '#contactUs', subItems: [] },
];

// Helper component for the Menu Items (including sub-items)
const MenuItem: React.FC<{
  item: typeof menuItems[0];
  closeMenu: () => void;
}> = ({ item, closeMenu }) => {
  const isExpanded = item.subItems.length > 0;

  // Render the main link/title
  const mainLink = (
    <Link
      href={item.href || '#'}
      onClick={isExpanded ? (e) => e.preventDefault() : closeMenu}
      className={`
        flex justify-between items-center font-light py-4 transition-colors
        text-2xl sm:text-3xl md:text-4xl lg:text-4xl
        ${item.name === 'Home' ? 'bg-[var(--brown1)] text-black' : ''}
        hover:text-white px-4
      `}
    >
      <span>{item.name}</span>
      {!isExpanded && (
        <ArrowRight
          className={`
            w-6 h-6 ml-4 transition-transform duration-300
            ${item.name === 'Home' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}
        />
      )}
    </Link>
  );

  return (
    <li className="border-b border-white/10 group">
      {mainLink}
      {/* Sub-menu items */}
      {isExpanded && (
        <ul className="pl-8 text-lg sm:text-xl md:text-2xl text-white/70">
          {item.subItems.map((subItem) => (
            <li key={subItem.name} className="py-2 flex justify-between items-center">
              <Link
                href={subItem.href}
                onClick={closeMenu}
                className="hover:text-white transition-colors font-extralight"
              >
                {subItem.name}
              </Link>
              <ArrowRight className="w-5 h-5 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

// Main Mobile Menu Component
const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* 1. Navbar Header (Visible always) */}
    <header className="fixed top-0 left-0 z-[60] p-3 pr-[55px] flex flex-col items-center text-white pointer-events-auto right-0">
      <div className="flex items-center justify-end w-full">
        {/* Rounded border around text + icon */}
        <div className="flex items-center gap-6">

        {/* Animated Hamburger Icon */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Open Menu"
          className="z-[61] flex items-center justify-center p-2 rounded-full hover:bg-white/5 focus:outline-none"
        >
          <span className="block">
            <svg width="40" height="40" viewBox="0 0 40 40" className="cursor-pointer">
            <rect
              x="8"
              y="12"
              width="35"
              height="2"
              rx="1.5"
              fill="white"
              style={{
                transition: 'all 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
                transform: isOpen ? 'translateY(9px) rotate(45deg)' : 'none',
              }}
            />
            <rect
              x="8"
              y="22"
              width="35"
              height="2"
              rx="1.5"
              fill="white"
              style={{
                transition: 'all 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
                opacity: isOpen ? 0 : 1,
              }}
            />
            <rect
              x="8"
              y="32"
              width="35"
              height="2"
              rx="1.5"
              fill="white"
              style={{
                transition: 'all 0.4s cubic-bezier(.68,-0.55,.27,1.55)',
                transform: isOpen ? 'translateY(-9px) rotate(-45deg)' : 'none',
              }}
            />
            </svg>
          </span>
        </button>
        </div>
      </div>
    </header>

      {/* 2. Full-screen Menu Overlay (Conditional visibility) */}
      <div
        className={`
          fixed inset-0 z-100 transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0 ' : 'translate-x-full'}  text-white flex backdrop-blur-xs transition-colors
        `}
      >
        {/* Left Sidebar (Dark, 25% width) */}
        <div className="w-1/4 h-full sm:p-6 p-2 flex items-center justify-end">
            <button
              onClick={closeMenu}
              className="p-4 border-1 border-white/30 bg-black/30 rounded-full hover:bg-white/10 transition"
              aria-label="Close Menu"
            >
              <X className="w-10 h-10" strokeWidth={1} />
            </button>
        </div>

        {/* Right Menu Content (Darker, 75% width) */}
        <div className="w-3/4 h-full bg-black p-4 sm:p-8 flex flex-col justify-between">
          <nav className="flex-grow">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.name} item={item} closeMenu={closeMenu} />
              ))}
            </ul>
          </nav>

          {/* Footer/Copyright */}
          <footer className="mt-8 text-xs sm:text-sm md:text-base text-white/50">
            &copy; Galina Innovations 2025
          </footer>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;