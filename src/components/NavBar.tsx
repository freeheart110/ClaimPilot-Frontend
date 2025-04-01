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
  const prevScroll = useRef(0);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > prevScroll.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      prevScroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`bg-background shadow-md fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        isVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-primary">
          ClaimPilot
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link href="/submit-claim" className="hover:text-primary">Submit Claim</Link>
          <Link href="/my-claims" className="hover:text-primary">My Claims</Link>
          <Link href="/contact" className="hover:text-primary">Contact</Link>
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login" className="text-sm text-gray-600 hover:text-primary">Login</Link>
          <Link href="/signup" className="bg-primary text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm">Sign Up</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-4 py-2 space-y-2 text-gray-700">
            <Link href="/submit-claim" onClick={toggleMobileMenu}>Submit Claim</Link>
            <Link href="/my-claims" onClick={toggleMobileMenu}>My Claims</Link>
            <Link href="/contact" onClick={toggleMobileMenu}>Contact</Link>
            <hr />
            <Link href="/login" onClick={toggleMobileMenu}>Login</Link>
            <Link href="/signup" onClick={toggleMobileMenu}>Sign Up</Link>
          </div>
        </div>
      )}

      {/* Optional slot content */}
      {children}
    </header>
  );
};

export default NavBar;