"use client";

import { useState } from "react";

export interface NewsletterProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  supportingText?: string;
  successMessage?: string;
}

export default function Newsletter({
  title = "Beautiful things, delivered to your inbox.",
  description = "Be the first to discover new arrivals, exclusive offers, special collections, and stories from our world.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  supportingText = "No spam. Just beautiful things.",
  successMessage = "You're on the list. Welcome.",
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 750);
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className={`w-full py-20 md:py-32  select-none `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex flex-col items-start">
            <h2 className="font-display text-3xl font-bold text-[#3E2C26] md:text-4xl">
              {title}
            </h2>

            <p className="text-sm mt-5 md:text-base leading-relaxed text-[#261815]/70 max-w-lg font-sans">
              {description}
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col w-full max-w-xl lg:ml-auto">
            {status === "success" ? (
              <div className="flex flex-col items-start py-6 transition-all duration-500 ease-out">
                <div className="flex items-center gap-3 text-[#5D4039]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5D4039] text-white">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </span>
                  <p className="text-xl md:text-2xl font-normal tracking-tight text-[#5D4039]">
                    {successMessage}
                  </p>
                </div>
                <p className="text-xs text-[#261815]/60 font-sans mt-2">
                  Thank you for joining our community.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full flex flex-col"
              >
                <div className="relative flex items-center border-b border-[#261815]/30 focus-within:border-[#261815] transition-colors duration-300 pb-2">
                  <label htmlFor="newsletter-email" className="sr-only">
                    {placeholder}
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm md:text-base text-[#261815] placeholder:text-[#261815]/40 outline-none pr-28 py-1.5 font-sans"
                    disabled={status === "loading"}
                  />

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    aria-label={buttonText}
                    className="absolute right-0 top-1/2 -translate-y-1/2 group inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold tracking-[0.14em] uppercase text-[#261815] transition-all duration-300 hover:text-[#261815]/75 cursor-pointer disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#261815] border-t-transparent" />
                    ) : (
                      <>
                        <span>{buttonText}</span>
                        <svg
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {status === "error" && errorMessage && (
                  <p className="text-xs text-rose-700 font-sans mt-2 transition-all">
                    {errorMessage}
                  </p>
                )}

                <p className="text-xs text-[#261815]/50 font-sans mt-3 tracking-normal">
                  {supportingText}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
