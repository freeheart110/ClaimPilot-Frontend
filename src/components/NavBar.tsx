'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  children?: ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-background shadow-md fixed top-0 left-0 w-full z-50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          ClaimPilot
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-8 text-foreground font-medium">
          <Link href="/submit-claim" className="hover:text-primary transition-colors duration-200">
            Submit Claim
          </Link>
          <Link href="/my-claims" className="hover:text-primary transition-colors duration-200">
            My Claims
          </Link>
          <Link href="/contact" className="hover:text-primary transition-colors duration-200">
            Contact
          </Link>
        </div>

        {/* User Actions (e.g., Login/Profile) */}
        <div className="hidden md:flex space-x-4">
          <Link href="/login" className="text-sm text-foreground hover:text-primary transition-colors duration-200">
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 text-sm font-medium"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-background border-t shadow-sm transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col px-6 py-4 space-y-3 text-foreground">
          <Link
            href="/submit-claim"
            onClick={toggleMobileMenu}
            className="hover:text-primary transition-colors duration-200"
          >
            Submit Claim
          </Link>
          <Link
            href="/my-claims"
            onClick={toggleMobileMenu}
            className="hover:text-primary transition-colors duration-200"
          >
            My Claims
          </Link>
          <Link
            href="/contact"
            onClick={toggleMobileMenu}
            className="hover:text-primary transition-colors duration-200"
          >
            Contact
          </Link>
          <hr className="border-gray-200 dark:border-gray-700" />
          <Link
            href="/login"
            onClick={toggleMobileMenu}
            className="hover:text-primary transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={toggleMobileMenu}
            className="hover:text-primary transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Optional slot content */}
      {children}
    </header>
  );
};

export default NavBar;