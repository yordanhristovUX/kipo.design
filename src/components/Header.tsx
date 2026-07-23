/**
 * @fileoverview Site header — sticky, blurred, hairline-ruled navigation with a
 * light/dark theme toggle.
 * @module components/Header
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/design-system';
import { useCMS } from '../contexts/CMSContext';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('kipo-theme') : null;
  if (stored === 'light' || stored === 'dark') return stored;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const { isEditMode } = useCMS();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kipo-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const navItems = [
    { name: 'Capabilities', href: '#services' },
    { name: 'Work', href: '#work' },
    { name: 'How we build', href: '#process' },
    { name: 'Studio', href: '#studio' },
    { name: 'Design System', href: '/design-system', isRoute: true },
  ];

  const topOffset = isEditMode ? 'top-[60px]' : 'top-0';

  return (
    <header
      className={`fixed ${topOffset} left-0 right-0 z-40 border-b transition-colors duration-150 backdrop-blur-md ${
        isScrolled ? 'border-border-primary bg-bg-primary/85' : 'border-transparent bg-bg-primary/70'
      }`}
    >
      <div className="brutalist-container">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <a href="#top" className="font-mono font-semibold text-text-primary text-[15.5px] tracking-tight">
            kipo<span className="text-primary">.</span>design
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150"
                >
                  {item.name}
                </a>
              )
            )}
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-interactive"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a project
            </Button>
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-interactive"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="p-2 text-text-primary hover:text-primary transition-colors border border-border-primary rounded-interactive"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-bg-primary border-t border-border-primary">
          <div className="brutalist-container py-4 space-y-1">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 text-sm font-medium text-text-primary hover:bg-bg-secondary transition-colors duration-150 rounded-interactive"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-text-primary hover:bg-bg-secondary transition-colors duration-150 rounded-interactive"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              )
            )}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setIsMenuOpen(false);
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start a project
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
