"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';
import {
  Boxes,
  Sliders,
  Sparkles,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { NavItem } from '../../types/landing';
import { UserAuthMenu } from '../visual-editor/components/UserAuthMenu';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface HeaderProps {
  onOpenIdePreferences: () => void;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onOpenDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenIdePreferences,
  onOpenAuthModal,
  onOpenDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { data: sessionData, isPending } = useSession();
  const isLoggedIn = !!sessionData?.user;

  const navItems: NavItem[] = [
    { label: 'Editor & Nodes', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Curriculum Progression', href: '#curriculum', badge: 'Levels 1-8 🐾' },
    { label: 'In-Browser IDE', href: '#interactive-demo-playground' },
  ];

  return (
    <header
      id="logicpup-main-header"
      className="sticky top-0 z-50 bg-[#F4F1EA]/90 backdrop-blur-xl border-b border-[#D8D4CC] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <BrandLogo size="lg" />

        {/* Desktop Navigation Links */}
        <nav
          id="logicpup-desktop-nav"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3.5 py-1.5 rounded-sm text-xs font-semibold text-[#666666] hover:text-[#121212] hover:bg-black/[0.04] transition-all flex items-center gap-1.5"
            >
              {item.label}
              {item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-[#356A9A]/10 text-[#356A9A]">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-2.5">

          {isPending ? (
            <div className="w-20 h-8 animate-pulse bg-black/5 rounded-sm"></div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { window.location.href = "/dashboard"; }}
                className="px-4 py-1.5 rounded-sm text-xs font-semibold bg-[#171717] hover:bg-[#333333] active:scale-95 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <UserAuthMenu />
            </div>
          ) : (
            <>
              {/* Login Button */}
              <button
                id="header-login-btn"
                onClick={() => { window.location.href = "/login?mode=signin"; }}
                className="px-3.5 py-1.5 rounded-sm text-xs font-semibold text-[#121212] hover:bg-black/[0.04] transition-all cursor-pointer"
              >
                Log In
              </button>

              {/* Primary CTA: Start Learning for Free */}
              <button
                id="header-primary-cta"
                onClick={() => { window.location.href = "/login?mode=signup"; }}
                className="px-4 py-1.5 rounded-sm text-xs font-semibold bg-[#F26A3D] hover:bg-[#D9552A] active:scale-95 text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Start Free</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <button
          id="header-mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-sm text-[#121212] hover:bg-black/[0.04] focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          id="logicpup-mobile-menu"
          className="md:hidden px-4 pt-3 pb-6 bg-[#F8F6F0] border-b border-black/[0.06] space-y-3"
        >
          <div className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-sm text-sm font-semibold text-[#121212] hover:bg-black/[0.04]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-black/[0.06] flex flex-col gap-2">

            {isPending ? null : isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = "/dashboard";
                }}
                className="w-full py-3 px-3 rounded-sm bg-[#171717] text-white text-xs font-semibold text-center"
              >
                Go to Dashboard
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/login?mode=signin";
                  }}
                  className="py-3 px-3 rounded-sm border border-black/[0.06] text-xs font-semibold text-[#121212] bg-white text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/login?mode=signup";
                  }}
                  className="py-3 px-3 rounded-sm bg-[#F26A3D] text-white text-xs font-semibold text-center"
                >
                  Start Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
