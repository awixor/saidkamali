"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import SearchModal from "./SearchModal";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { SearchIcon, CloseIcon, HamburgerIcon, ChevronDownIcon } from "./Icons";

type Book = {
  id: string;
  slug: string;
  name: string;
};

function DesktopBookLinks({ books }: { books: Book[] }) {
  const visibleBooks = books.slice(0, 5);
  const overflowBooks = books.slice(5);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
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
            <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
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
  );
}

export default function Navbar({ books }: { books: Book[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useBodyScrollLock(menuOpen);

  // Ctrl/Cmd+K to open search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Right side (RTL): Site name */}
          <Link
            href="/ar"
            className="font-amiri text-xl sm:text-2xl font-bold text-foreground hover:text-accent transition-colors duration-300"
          >
            الشيخ سعيد الكملي
          </Link>

          {/* Center: Book links (desktop) */}
          <DesktopBookLinks books={books} />

          {/* Left side (RTL): Search + All videos (desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-naskh text-foreground/50 border border-border rounded hover:border-accent/30 hover:text-foreground/70 transition-all duration-200"
            >
              <SearchIcon className="w-4 h-4" />
              <span>بحث</span>
              <kbd className="text-xs text-foreground/30 border border-border rounded px-1.5 py-0.5 font-sans mr-1">⌘K</kbd>
            </button>
            <Link
              href="/ar/videos"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-naskh font-semibold text-accent border border-accent/30 rounded hover:bg-accent hover:text-white transition-all duration-200"
            >
              جميع الدروس
            </Link>
          </div>

          {/* Mobile: search + hamburger */}
          <div className="flex lg:hidden items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-foreground/60 p-3 hover:bg-accent/5 rounded transition-colors duration-200"
              aria-label="بحث"
            >
              <SearchIcon />
            </button>
            <button
              className="text-foreground p-3 hover:bg-accent/5 rounded transition-colors duration-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="القائمة"
            >
              {menuOpen ? <CloseIcon className="w-6 h-6" /> : <HamburgerIcon />}
            </button>
          </div>
        </div>

        {/* Mobile: expandable menu (hamburger) */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-border bg-background px-6 py-5">
            <div className="overflow-y-auto max-h-[60vh] space-y-1">
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
            </div>
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

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
