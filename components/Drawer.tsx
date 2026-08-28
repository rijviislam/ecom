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
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-md bg-[#ece0de]/10 transition-opacity duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed left-4 right-4 sm:left-auto sm:right-6 top-17 md:top-17 bottom-4 z-50 flex w-auto sm:w-full sm:max-w-105 flex-col overflow-hidden border border-[#3E2C26]/40 bg-[#ece0de]/90 shadow-2xl transition-transform duration-300 ease-in-out text-[#3E2C26] ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-6 opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-4 sm:px-5 py-4">
          <h2 className="font-display text-base sm:text-lg text-[#3E2C26]">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 text-[#3E2C26]">
          {children}
        </div>

        {footer && (
          <div className="border-t border-ink/10 px-4 sm:px-5 py-4 text-[#3E2C26]">
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
