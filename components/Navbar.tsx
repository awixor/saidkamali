"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type Book = {
  id: string;
  slug: string;
  name: string;
};

export default function Navbar({ books }: { books: Book[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleBooks = books.slice(0, 5);
  const overflowBooks = books.slice(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-accent/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Right side (RTL): Site name */}
        <Link
          href="/ar"
          className="font-amiri text-2xl font-bold text-foreground hover:text-accent transition-colors duration-300"
        >
          الشيخ سعيد الكملي
        </Link>

        {/* Center: Book links (desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {visibleBooks.map((book) => (
            <Link
              key={book.id}
              href={`/ar/books/${book.slug}`}
              className="px-3 py-1.5 text-sm font-naskh text-foreground/70 hover:text-accent hover:bg-accent/5 rounded transition-all duration-200"
            >
              {book.name}
            </Link>
          ))}
          {overflowBooks.length > 0 && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-3 py-1.5 text-sm font-naskh text-foreground/70 hover:text-accent hover:bg-accent/5 rounded transition-all duration-200 flex items-center gap-1"
              >
                المزيد
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                >
                  <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-3 bg-card border border-border rounded shadow-lg py-1.5 min-w-[220px] animate-in fade-in slide-in-from-top-1 duration-150">
                  {overflowBooks.map((book) => (
                    <Link
                      key={book.id}
                      href={`/ar/books/${book.slug}`}
                      className="block px-4 py-2.5 text-sm font-naskh text-foreground/70 hover:text-accent hover:bg-accent/5 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {book.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Left side (RTL): All videos link */}
        <div className="hidden lg:block">
          <Link
            href="/ar/videos"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-naskh font-semibold text-accent border border-accent/30 rounded hover:bg-accent hover:text-white transition-all duration-200"
          >
            جميع الدروس
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-foreground p-2 hover:bg-accent/5 rounded transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="القائمة"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border bg-background px-6 py-5 space-y-1">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/ar/books/${book.slug}`}
              className="block px-3 py-2.5 text-sm font-naskh text-foreground/70 hover:text-accent hover:bg-accent/5 rounded transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {book.name}
            </Link>
          ))}
          <div className="border-t border-border mt-3 pt-4">
            <Link
              href="/ar/videos"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-naskh font-semibold text-accent border border-accent/30 rounded hover:bg-accent hover:text-white transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              جميع الدروس
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
