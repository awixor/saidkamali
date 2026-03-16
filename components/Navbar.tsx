"use client";

import Link from "next/link";
import { useState } from "react";

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

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Right side (RTL): Site name */}
        <Link href="/ar" className="font-amiri text-xl font-bold text-foreground hover:text-accent transition-colors">
          الشيخ سعيد الكملي
        </Link>

        {/* Center: Book links (desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {visibleBooks.map((book) => (
            <Link
              key={book.id}
              href={`/ar/books/${book.slug}`}
              className="text-sm font-naskh text-foreground/80 hover:text-accent transition-colors"
            >
              {book.name}
            </Link>
          ))}
          {overflowBooks.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-sm font-naskh text-foreground/80 hover:text-accent transition-colors"
              >
                المزيد ▾
              </button>
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded shadow-lg py-2 min-w-[200px]">
                  {overflowBooks.map((book) => (
                    <Link
                      key={book.id}
                      href={`/ar/books/${book.slug}`}
                      className="block px-4 py-2 text-sm font-naskh text-foreground/80 hover:text-accent hover:bg-background transition-colors"
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
        <div className="hidden md:block">
          <Link
            href="/ar/videos"
            className="text-sm font-naskh text-accent font-semibold hover:text-accent-dark transition-colors"
          >
            جميع الدروس
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground p-2"
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
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/ar/books/${book.slug}`}
              className="block text-sm font-naskh text-foreground/80 hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {book.name}
            </Link>
          ))}
          <div className="border-t border-border pt-3">
            <Link
              href="/ar/videos"
              className="block text-sm font-naskh text-accent font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              جميع الدروس
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
