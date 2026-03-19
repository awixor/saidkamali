"use client";

import { useEffect } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { CloseIcon } from "./Icons";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  side?: "right" | "left";
};

export default function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  side = "right",
}: DrawerProps) {
  useBodyScrollLock(open);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const positionClasses =
    side === "right"
      ? "right-0 border-l animate-in slide-in-from-right"
      : "left-0 border-r animate-in slide-in-from-left";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        className={`absolute inset-y-0 ${positionClasses} w-[85%] max-w-sm bg-card border-border flex flex-col duration-200`}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <div>
              {title && (
                typeof title === "string" ? (
                  <h2 className="font-amiri text-base font-bold text-foreground">
                    {title}
                  </h2>
                ) : title
              )}
              {subtitle && (
                <p className="font-naskh text-xs text-foreground/50 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-3 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="إغلاق"
            >
              <CloseIcon />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
