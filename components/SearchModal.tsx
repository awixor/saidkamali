"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

type Book = { id: string; slug: string; name: string };
type Chapter = { id: string; name: string; bookName: string | null };
type Video = {
  id: string;
  title: string;
  youtubeId: string;
  lessonNumber: number;
  bookName: string | null;
  chapterName: string | null;
};

type Results = {
  books: Book[];
  chapters: Chapter[];
  videos: Video[];
};

function toArabicNumerals(num: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((d) => arabicDigits[parseInt(d)] || d)
    .join("");
}

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Results>({ books: [], chapters: [], videos: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults({ books: [], chapters: [], videos: [] });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults({ books: [], chapters: [], videos: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      setResults({ books: [], chapters: [], videos: [] });
    }
    setLoading(false);
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults({ books: [], chapters: [], videos: [] });
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  const hasResults = results.books.length > 0 || results.chapters.length > 0 || results.videos.length > 0;
  const hasQuery = query.trim().length >= 2;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-lg shadow-2xl border border-border overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-foreground/40 shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="ابحث عن كتاب، باب، أو درس..."
            className="flex-1 bg-transparent text-foreground font-naskh text-base outline-none placeholder:text-foreground/30"
            dir="rtl"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-foreground/30 border border-border rounded font-sans">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="px-5 py-8 text-center">
              <div className="inline-block w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          )}

          {!loading && hasQuery && !hasResults && (
            <div className="px-5 py-10 text-center">
              <p className="font-naskh text-foreground/40 text-sm">
                لا توجد نتائج لـ &quot;{query}&quot;
              </p>
            </div>
          )}

          {!loading && hasResults && (
            <div className="py-2">
              {/* Books */}
              {results.books.length > 0 && (
                <div>
                  <p className="px-5 py-2 text-xs font-naskh font-semibold text-foreground/40 uppercase tracking-wide">
                    الكتب
                  </p>
                  {results.books.map((book) => (
                    <Link
                      key={book.id}
                      href={`/ar/books/${book.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-accent/5 transition-colors"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded bg-secondary/10 text-secondary shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                        </svg>
                      </span>
                      <span className="font-amiri text-sm font-bold text-foreground">
                        {book.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Chapters */}
              {results.chapters.length > 0 && (
                <div className={results.books.length > 0 ? "border-t border-border" : ""}>
                  <p className="px-5 py-2 text-xs font-naskh font-semibold text-foreground/40 uppercase tracking-wide">
                    الأبواب
                  </p>
                  {results.chapters.map((ch) => (
                    <Link
                      key={ch.id}
                      href={`/ar/chapters/${ch.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-accent/5 transition-colors"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded bg-accent/10 text-accent shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-amiri text-sm font-bold text-foreground">{ch.name}</p>
                        {ch.bookName && (
                          <p className="font-naskh text-xs text-foreground/40">{ch.bookName}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Videos */}
              {results.videos.length > 0 && (
                <div className={(results.books.length > 0 || results.chapters.length > 0) ? "border-t border-border" : ""}>
                  <p className="px-5 py-2 text-xs font-naskh font-semibold text-foreground/40 uppercase tracking-wide">
                    الدروس
                  </p>
                  {results.videos.map((v) => (
                    <Link
                      key={v.id}
                      href={`/ar/videos/${v.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-accent/5 transition-colors"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded bg-accent text-white text-xs font-bold font-naskh shrink-0">
                        {toArabicNumerals(v.lessonNumber)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-amiri text-sm font-bold text-foreground truncate">
                          {v.title}
                        </p>
                        <p className="font-naskh text-xs text-foreground/40 truncate">
                          {[v.bookName, v.chapterName].filter(Boolean).join(" - ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !hasQuery && (
            <div className="px-5 py-10 text-center">
              <p className="font-naskh text-foreground/30 text-sm">
                اكتب للبحث في الكتب والأبواب والدروس
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
