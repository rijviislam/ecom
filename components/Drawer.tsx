"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: DrawerProps) {
  // Lock body scroll while drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop — starts below the navbar (top-16) so the navbar itself never blurs, only the page content beneath it */}
      <div
        onClick={onClose}
        className={`fixed left-0 right-0 top-16 bottom-0 z-40 bg-ink/40 backdrop-blur-md transition-opacity duration-300 ease-in-out text-[#3E2C26] ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel — attached under the navbar, with the same right-side gap as the navbar's padding */}
      <aside
        className={`fixed right-4 sm:right-6 top-17 bottom-4 z-50 flex w-full max-w-105 flex-col overflow-hidden bg-[#EDE4DC] border border-[#3E2C26]/40 bg-cream  transition-transform duration-300 ease-in-out text-[#3E2C26]  ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-6 opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-lg text-[#3E2C26]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 text-[#3E2C26]">
          {children}
        </div>

        {/* Footer (optional, e.g. subtotal + checkout) */}
        {footer && (
          <div className="border-t border-ink/10 px-5 py-4 text-[#3E2C26]">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
