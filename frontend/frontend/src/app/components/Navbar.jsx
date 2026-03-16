'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function Navbar({ title = 'Butcher Weight Scale Display', onTitleClick }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    // เปลี่ยนหน้าให้ปิดเมนู
    setMenuOpen(false);
  }, [pathname]);

  // ปิดเมนูเมื่อคลิกนอกเมนู
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/Login');
  };

  const goConfig = () => {
    setMenuOpen(false);
    router.push('/config');
  };

  return (
    <nav className="bg-[#333] text-white p-5">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <span
              className="font-bold cursor-pointer hover:underline"
              onClick={onTitleClick}
            >
              {title}
            </span>
          </div>

          {/* ด้านขวา */}
          <div className="relative" ref={menuRef}>
            {/* ถ้าเป็นหน้าแรกและยังไม่ล็อกอิน แสดงปุ่ม Sign In */}
            {pathname === '/' && !isLoggedIn && (
              <Link href="/Login" className="hover:underline">
                Sign In
              </Link>
            )}

            {/* ถ้าล็อกอินแล้ว (และไม่ใช่หน้า Login) แสดง hamburger */}
            {isLoggedIn && pathname !== '/Login' && (
              <>
                <button
                  aria-label="Open menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-2 rounded hover:bg-gray-700 focus:outline-none"
                >
                  {/* ไอคอนแฮมเบอร์เกอร์ (SVG) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-lg overflow-hidden z-50">
                    <button
                      onClick={goConfig}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Upgrade firmware
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
