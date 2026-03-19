"use client";

import { useState } from "react";
import VideoCard from "@/components/VideoCard";

type Book = {
  id: string;
  name: string;
};

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  lessonNumber: number;
  chapter: string | null;
  durationMinutes: number | null;
  bookId: string;
};

export default function VideosClient({
  books,
  videos,
}: {
  books: Book[];
  videos: Video[];
}) {
  const [activeBook, setActiveBook] = useState<string | null>(null);

  const filtered = activeBook
    ? videos.filter((v) => v.bookId === activeBook)
    : videos;

  return (
    <>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6 lg:mb-8 justify-center px-1">
        <button
          onClick={() => setActiveBook(null)}
          className={`font-naskh text-sm px-4 py-2 rounded border transition-colors ${
            activeBook === null
              ? "bg-accent text-white border-accent"
              : "bg-card text-foreground/70 border-border hover:border-accent"
          }`}
        >
          الكل
        </button>
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => setActiveBook(book.id)}
            className={`font-naskh text-sm px-4 py-2 rounded border transition-colors ${
              activeBook === book.id
                ? "bg-accent text-white border-accent"
                : "bg-card text-foreground/70 border-border hover:border-accent"
            }`}
          >
            {book.name}
          </button>
        ))}
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filtered.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            youtubeId={video.youtubeId}
            lessonNumber={video.lessonNumber}
            title={video.title}
            chapter={video.chapter}
            durationMinutes={video.durationMinutes}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center font-naskh text-foreground/50 py-16">
          لا توجد دروس
        </p>
      )}
    </>
  );
}
