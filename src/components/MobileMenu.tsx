'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

const menuItems = [
  { name: 'Home', href: '/', subItems: [] },
  { name: 'Who we are?', href: '/about', subItems: [] },
  {
    name: 'Projects',
    href: '/#projects',
    subItems: [
      { name: 'Residential', href: '/#residential' },
      { name: 'Hospitality', href: '/#hospitality' },
      { name: 'Commercial', href: '/#commercial' },
    ],
  },
  { name: 'Contact', href: '#contactUs', subItems: [] },
];

const MenuItem: React.FC<{
  item: typeof menuItems[0];
  closeMenu: () => void;
  activePath: string;
}> = ({ item, closeMenu, activePath }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (item.name === 'Contact') {
      e.preventDefault();
      closeMenu();
      setTimeout(() => {
        const el = document.getElementById('contactUs');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (!item.subItems.length) {
      closeMenu();
    }
  };

  const isExpanded = item.subItems.length > 0;
  const isActive =
    item.href === '/'
      ? activePath === '/'
      : activePath.startsWith(item.href) && item.href !== '/';

  return (
    <li className="border-b border-white/10 group">
      <Link
        href={item.href || '#'}
        onClick={isExpanded ? (e) => e.preventDefault() : handleClick}
        className={`
          flex justify-between items-center font-light py-4 transition-colors
          text-2xl sm:text-3xl md:text-4xl lg:text-4xl
          ${isActive ? 'bg-[var(--brown1)] text-black' : ''}
          hover:text-white px-4
        `}
      >
        <span>{item.name}</span>
        {!isExpanded && (
          <ArrowRight
            className={`w-6 h-6 ml-4 transition-transform duration-300 ${
              isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          />
        )}
      </Link>

      {isExpanded && (
        <ul className="pl-8 text-lg sm:text-xl md:text-2xl text-white/70">
          {item.subItems.map((subItem) => {
            const subActive = activePath.startsWith(subItem.href);
            return (
              <li
                key={subItem.name}
                className={`py-2 flex justify-between items-center ${
                  subActive ? 'bg-[var(--brown1)] text-black' : ''
                }`}
              >
                <Link
                  href={subItem.href}
                  onClick={(e) => {
                    e.preventDefault();
                    closeMenu();
                    setTimeout(() => {
                      if (window.location.pathname !== '/') {
                        window.location.href = subItem.href;
                      } else {
                        const hash = subItem.href.replace('/#', '').toLowerCase();
                        const sectionMap: Record<string, string> = {
                          residential: 'Residential',
                          hospitality: 'Hospitality',
                          commercial: 'Commercial',
                        };
                        const section = sectionMap[hash];
                        if (section && (window as WindowWithScroll).scrollToProjectCategory) {
                          (window as WindowWithScroll).scrollToProjectCategory?.(section);
                        } else {
                          const el = document.getElementById(hash);
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }, 100);
                  }}
                  className={`hover:text-white transition-colors font-extralight ${
                    subActive ? 'text-black' : ''
                  }`}
                >
                  {subItem.name}
                </Link>
                <ArrowRight
                  className={`w-5 h-5 ml-4 transition-opacity duration-300 ${
                    subActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                />
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSnapLogo, setShowSnapLogo] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    let rafId: number | null = null;
    let ticking = false;

    function onScroll() {
      const scrollY = window.scrollY;
      if (!ticking) {
        ticking = true;
        rafId = window.requestAnimationFrame(() => {
          setShowSnapLogo(scrollY > 20);
          ticking = false;
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Scroll to hash on load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const sectionMap: Record<string, string> = {
        residential: 'Residential',
        hospitality: 'Hospitality',
        commercial: 'Commercial',
        industrial: 'Industrial',
        landscape: 'Landscape',
      };
      const section = sectionMap[hash];
      setTimeout(() => {
        if (section && (window as WindowWithScroll).scrollToProjectCategory) {
          (window as WindowWithScroll).scrollToProjectCategory?.(section);
        } else {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, []);

  return (
    <>
      <div
        className={`fixed top-5 z-[200] transition-all duration-500 pointer-events-none px-4 sm:px-8 md:px-16 ${
          showSnapLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
        style={{ transitionProperty: 'opacity, transform' }}
      >
        <Link href="/" aria-label="Gallina Innovations Home">
          <Image
            src="https://cdn.gallinainnovations.com/uploads/GallinaLogo.png"
            alt="Gallina Innovations Logo"
            width={120}
            height={22}
            className="w-[40px] sm:w-[50px] h-auto drop-shadow-xl"
          />
        </Link>
      </div>

      <header className="fixed top-0 left-0 z-[200] p-3 lg:pr-[55px] flex flex-col items-center text-white pointer-events-auto right-0">
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={toggleMenu}
              aria-label="Open Menu"
              className="z-[61] flex items-center justify-center p-2 rounded-full cursor-pointer focus:outline-none"
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
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
            </button>
          </div>
        </div>
      </header>

      <div
        id="logo-gradient-overlay"
        className="inset-0 fixed pointer-events-none"
        style={{ zIndex: 30 }}
      />

      <div
        className={`fixed inset-0 transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } text-white flex backdrop-blur-xs`}
        style={{ zIndex: 199 }}
      >
        <div className="w-1/4 h-full sm:p-6 p-2 flex items-center justify-end">
          <button
            onClick={closeMenu}
            className="p-4 border border-white/30 bg-black/30 rounded-full hover:bg-white/10 transition"
            aria-label="Close Menu"
          >
            <X className="w-10 h-10" strokeWidth={1} />
          </button>
        </div>

        <div className="w-3/4 h-full bg-black p-4 sm:p-8 flex flex-col justify-between">
          <nav className="flex-grow">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.name}
                  item={item}
                  closeMenu={closeMenu}
                  activePath={pathname}
                />
              ))}
            </ul>
          </nav>

          <footer className="mt-8 text-xs sm:text-sm md:text-base text-white/50">
            &copy; Gallina Innovations 2025
          </footer>
        </div>
      </div>
    </>
  );
};

// Extend window type for scrollToProjectCategory
type WindowWithScroll = Window & { scrollToProjectCategory?: (section: string) => void };

export default MobileMenu;
