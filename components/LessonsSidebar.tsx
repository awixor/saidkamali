"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Drawer from "./Drawer";
import { ListIcon } from "./Icons";

type Lesson = {
  id: string;
  title: string;
  lessonNumber: number;
  chapter: string | null;
};

function LessonList({
  lessons,
  currentId,
  activeRef,
  onSelect,
}: {
  lessons: Lesson[];
  currentId: string;
  activeRef: React.RefObject<HTMLAnchorElement | null>;
  onSelect?: () => void;
}) {
  return (
    <>
      {lessons.map((lesson) => {
        const isActive = lesson.id === currentId;
        return (
          <Link
            key={lesson.id}
            ref={isActive ? activeRef : null}
            href={`/ar/videos/${lesson.id}`}
            onClick={onSelect}
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
    </>
  );
}

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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [currentId]);

  const currentIndex = lessons.findIndex((l) => l.id === currentId);

  return (
    <>
      {/* Mobile: floating button to open lessons drawer */}
      <div className="lg:hidden fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 bg-accent text-white font-naskh text-sm font-semibold px-4 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          <ListIcon />
          {currentIndex >= 0 ? `${currentIndex + 1} / ${lessons.length}` : `${lessons.length} درس`}
        </button>
      </div>

      {/* Mobile: drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        title={bookName}
        subtitle={`${lessons.length} درس`}
      >
        <LessonList
          lessons={lessons}
          currentId={currentId}
          activeRef={activeRef}
          onSelect={() => setMobileOpen(false)}
        />
      </Drawer>

      {/* Desktop: static sidebar */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-20 border border-border rounded bg-card max-h-[calc(100vh-6rem)] flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="font-amiri text-base font-bold text-foreground">
              {bookName}
            </h2>
            <p className="font-naskh text-xs text-foreground/50 mt-1">
              {lessons.length} درس
            </p>
          </div>
          <div className="overflow-y-auto flex-1">
            <LessonList
              lessons={lessons}
              currentId={currentId}
              activeRef={activeRef}
            />
          </div>
        </div>
      </aside>
    </>
  );
}
