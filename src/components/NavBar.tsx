'use client';

import React, { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  children?: ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const prevScroll = useRef(0);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`, {
          credentials: 'include',
        });
        if (res.status === 401) {
          setIsLoggedIn(false); // not logged in
        } else if (res.ok) {
          setIsLoggedIn(true);
        } else {
          console.error('Unexpected auth response:', res.status);
        }
  
      } catch (err) {
        console.error('Network error checking session:', err);
      }
    };
  
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > prevScroll.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      prevScroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-background shadow-md fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          ClaimPilot
        </Link>

        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link href="/submit-claim" className="hover:text-primary">Submit Claim</Link>
          <Link href="/track-claim" className="hover:text-primary">Track Claims</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="bg-primary text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm">Login</Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-4 py-2 space-y-2 text-gray-700">
            <Link href="/submit-claim" onClick={toggleMobileMenu}>Submit Claim</Link>
            <Link href="/track-claim" onClick={toggleMobileMenu}>Track Claim</Link>
            <Link href="/contact" onClick={toggleMobileMenu}>Contact</Link>
            <hr />
            {isLoggedIn ? (
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="text-left text-sm text-red-600">
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={toggleMobileMenu}>Login</Link>
                <Link href="/signup" onClick={toggleMobileMenu}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}

      {children}
    </header>
  );
};

export default NavBar;