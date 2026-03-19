"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type Lesson = {
  id: string;
  title: string;
  lessonNumber: number;
  chapter: string | null;
};

export default function LessonsSidebar({
  lessons,
  currentId,
  bookName,
}: {
  lessons: Lesson[];
  currentId: string;
  bookName: string;
}) {
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [currentId]);

  return (
    <aside className="hidden lg:block w-80 shrink-0">
      <div className="sticky top-20 border border-border rounded bg-card max-h-[calc(100vh-6rem)] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-amiri text-base font-bold text-foreground">
            {bookName}
          </h2>
          <p className="font-naskh text-xs text-foreground/50 mt-1">
            {lessons.length} درس
          </p>
        </div>

        {/* Lessons list */}
        <div className="overflow-y-auto flex-1">
          {lessons.map((lesson) => {
            const isActive = lesson.id === currentId;
            return (
              <Link
                key={lesson.id}
                ref={isActive ? activeRef : null}
                href={`/ar/videos/${lesson.id}`}
                className={`block px-4 py-3 border-b border-border/50 transition-colors ${
                  isActive
                    ? "bg-accent/10 border-r-2 border-r-accent"
                    : "hover:bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`shrink-0 w-8 h-8 flex items-center justify-center rounded text-xs font-bold font-naskh ${
                      isActive
                        ? "bg-accent text-white"
                        : "bg-background text-foreground/60"
                    }`}
                  >
                    {lesson.lessonNumber}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`font-naskh text-sm leading-snug truncate ${
                        isActive
                          ? "text-accent font-semibold"
                          : "text-foreground/80"
                      }`}
                    >
                      الدرس {lesson.lessonNumber}
                    </p>
                    {lesson.chapter && (
                      <p className="font-naskh text-xs text-foreground/40 truncate mt-0.5">
                        {lesson.chapter}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
