"use client";

import { useState } from "react";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  {
    id: "1",
    question: "What makes your products different?",
    answer:
      "Our formulas are crafted in France with clean, high-performance botanicals and bio-compatible actives. We blend effortless French beauty rituals with modern dermatological science, ensuring every product delivers visible results while remaining gentle on your skin barrier.",
  },
  {
    id: "2",
    question: "How do I choose the right product for my skin type?",
    answer:
      "Each product page features a detailed skin-type guide and active ingredient breakdown. If you are unsure where to start, our signature Balms and Hydrating Serum are universally formulated to suit all skin profiles, from sensitive dry skin to combination and oily textures.",
  },
  {
    id: "3",
    question: "How long does shipping take?",
    answer:
      "Orders are processed within 24–48 business hours and typically arrive within 3–5 business days for standard delivery. Express options are available at checkout for 1–2 business day delivery. You will receive an automated tracking link as soon as your parcel leaves our studio.",
  },
  {
    id: "4",
    question: "Can I return or exchange my order?",
    answer:
      "Yes, we offer hassle-free 30-day returns on all unused and gently tried products in their original packaging. Simply contact our concierge team with your order number, and we will provide a complimentary prepaid return label.",
  },
  {
    id: "5",
    question: "Are your products suitable for sensitive skin?",
    answer:
      "Absolutely. All our skincare and makeup essentials are dermatologist-tested, hypoallergenic, non-comedogenic, and strictly formulated without parabens, synthetic fragrances, phthalates, or harsh sulfates.",
  },
  {
    id: "6",
    question: "How can I track my order?",
    answer:
      "As soon as your parcel is dispatched, you will receive a shipping confirmation email containing your direct tracking number. You can click the tracking link directly or log into your account to monitor shipping progress in real time.",
  },
  {
    id: "7",
    question: "Do you offer international shipping?",
    answer:
      "Yes, we proudly ship worldwide to over 60 countries. International transit times typically range from 6 to 10 business days depending on customs clearance and regional postal networks.",
  },
  {
    id: "8",
    question: "How can I contact customer support?",
    answer:
      "Our beauty advisors and concierge team are available Monday through Friday from 9 AM to 6 PM EST. You can connect with us directly via our live chat or email us at support@covetbeauty.com.",
  },
];

export interface FAQProps {
  tag?: string;
  title?: string;
  description?: string;
  items?: FAQItem[];
}

export default function FAQ({
  title = "Frequently Asked Questions",
  description = "Everything you need to know about our products, orders, shipping, and more.",
  items = DEFAULT_FAQ_ITEMS,
}: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-labelledby="faq-heading"
      className={`w-full py-20 md:py-32 select-none `}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-32">
            <h2 className="font-display  text-3xl font-bold text-[#3E2C26] md:text-4xl">
              {title}
            </h2>

            <p className="text-sm md:text-base leading-relaxed text-[#261815]/70 max-w-md font-sans mt-5">
              {description}
            </p>
          </div>

          <div className="lg:col-span-7 flex flex-col divide-y divide-[#261815]/10 border-y border-[#261815]/10">
            {items.map((item) => {
              const isOpen = openId === item.id;
              const buttonId = `faq-btn-${item.id}`;
              const panelId = `faq-panel-${item.id}`;

              return (
                <div
                  key={item.id}
                  className="group py-5 md:py-6 transition-colors"
                >
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="w-full flex items-center justify-between gap-6 text-left cursor-pointer outline-none group-focus-visible:ring-1 group-focus-visible:ring-[#261815]"
                  >
                    <span
                      className={`text-base md:text-lg font-display transition-colors duration-300 ${
                        isOpen
                          ? "text-[#261815] font-medium"
                          : "text-[#261815]/85 group-hover:text-[#261815]"
                      }`}
                    >
                      {item.question}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 font-sens ${
                        isOpen
                          ? "rotate-45 bg-[#5D4039] text-white border-[#5D4039]"
                          : "border-[#261815]/20 text-[#261815] bg-transparent group-hover:border-[#261815] group-hover:bg-[#261815]/5"
                      }`}
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-3.5"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm md:text-[15px] leading-relaxed text-[#261815]/70 font-sans pr-6">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
