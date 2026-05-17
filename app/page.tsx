"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  Carrot,
  ChefHat,
  Flame,
  Leaf,
  Salad,
  Soup,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import TextPressure from "@/components/TextPressure";
import CircularText from "@/components/CircularText";

const heroImages = {
  featuredPizza:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  sideDish:
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
  aiCooking:
    "https://images.unsplash.com/photo-1484980972926-edee96e0960d?auto=format&fit=crop&w=1300&q=80",
  communityChef:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
};

const pantrySignals = [
  { icon: Carrot, label: "Peak Freshness", value: "89%" },
  { icon: BadgeCheck, label: "Recipe Matches", value: "24" },
];

const heroDetails = [
  { label: "Pantry Logic", value: "Auto sorts ingredients into recipe-ready groups." },
  { label: "AI Guidance", value: "Turns what you already have into usable dinner ideas." },
  { label: "Kitchen Flow", value: "Keeps planning, choosing, and cooking in one rhythm." },
];

const dailyHighlights = [
  "Creamy paneer base with roasted garlic notes",
  "Pantry match score tuned for weeknight cooking",
];

const nutritionStats = [
  { icon: Flame, label: "Fat", value: "10.4g", width: "w-[78%]" },
  { icon: Soup, label: "Carbs", value: "35.6g", width: "w-[92%]" },
  { icon: Leaf, label: "Fiber", value: "2.5g", width: "w-[74%]" },
  { icon: Salad, label: "Sugar", value: "3.8g", width: "w-[86%]" },
  { icon: BadgeCheck, label: "Protein", value: "12.2g", width: "w-[80%]" },
];

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-shell]", {
        opacity: 0,
        scale: 0.965,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from("[data-hero-card]", {
        y: 56,
        opacity: 0,
        stagger: 0.12,
        duration: 0.95,
        delay: 0.12,
        ease: "power3.out",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="relative min-h-screen overflow-hidden px-4 py-4 md:px-6 md:py-5">
      <Navbar />
      <div
        data-hero-shell
        className="app-shell relative mx-auto mt-3 max-w-[1440px] overflow-hidden rounded-[42px] border border-white/55 p-4 md:p-5 lg:mt-3 lg:p-5"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#fdf2e6_0%,rgba(255,255,255,0)_30%),radial-gradient(circle_at_bottom_left,rgba(255,163,71,0.16),rgba(255,255,255,0)_28%)]" />

        <div className="relative grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)_280px] lg:grid-rows-[minmax(38rem,auto)_minmax(12rem,auto)] lg:gap-3.5">
          <aside className="space-y-3 lg:row-span-1 lg:grid lg:h-full lg:grid-rows-[106px_16vh_minmax(0,1fr)] lg:gap-3 lg:space-y-0">
            <section data-hero-card className="glass-panel flex min-h-[106px] items-center justify-center rounded-[30px] px-6 py-4">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff3e2] text-[#ff7a00] shadow-[inset_0_0_0_1px_rgba(255,122,0,0.14)]">
                  <ChefHat className="h-7 w-7" />
                </div>
                <p className="font-display text-4xl leading-none text-[#26201c] lg:text-[2.4rem]">Smart Pantry</p>
              </div>
            </section>

            <section data-hero-card className="glass-panel overflow-hidden rounded-[34px]">
              <img src={heroImages.sideDish} alt="Fresh plated meal" className="h-[180px] w-full object-cover lg:h-[16vh]" />
            </section>

            <section data-hero-card className="wave-card overflow-hidden rounded-[30px] bg-[#ff7a00] p-3.5 text-white lg:h-full">
              <div className="relative z-10 lg:flex lg:h-full lg:flex-col">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/30">
                    <img src={heroImages.featuredPizza} alt="Italian paneer pizza" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm uppercase tracking-[0.24em] text-white/70">Daily pick</p>
                    <h2 className="text-lg font-semibold leading-tight text-white">Italian Paneer Pizza</h2>
                  </div>
                </div>
                <div className="mb-4 space-y-2 text-sm leading-5 text-white/88">
                  {dailyHighlights.map((highlight) => (
                    <p key={highlight} className="rounded-full border border-white/20 bg-white/8 px-3 py-2">
                      {highlight}
                    </p>
                  ))}
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2 lg:mt-auto">
                  <StatChip icon={ChefHat} label="Cook status" value="100% Ready" light />
                  <StatChip icon={Flame} label="Approx." value="140 Cals" light />
                </div>
              </div>
            </section>

          </aside>

          <div className="space-y-3 lg:row-span-1 lg:h-full">
            <section data-hero-card className="glass-panel rounded-[34px] px-4 py-4 md:px-5 md:py-4 lg:h-full">
              <div className="soft-grid relative overflow-hidden rounded-[30px] px-1 pb-3 pt-3 md:px-2 md:pb-4 lg:flex lg:h-full lg:flex-col">
                <div className="relative max-w-[640px]">
                  <div className="pointer-events-none absolute right-2 top-2 hidden lg:block">
                    <div className="flex h-[150px] w-[150px] items-center justify-center rounded-full border border-[#ffd8b1] bg-[radial-gradient(circle,rgba(255,255,255,0.96)_35%,rgba(255,244,231,0.75)_70%,rgba(255,255,255,0)_100%)] shadow-[0_20px_40px_rgba(255,122,0,0.12)]">
                      <CircularText
                        text="SMART*PANTRY*AI*RECIPES*"
                        onHover="speedUp"
                        spinDuration={24}
                        radius={50}
                        className="text-[#ff7a00] [text-shadow:0_0_18px_rgba(255,122,0,0.12)] [&_span]:font-sans [&_span]:text-[16px] [&_span]:font-semibold [&_span]:tracking-[0.22em]"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="h-[66px] w-[220px] overflow-hidden md:h-[76px] md:w-[260px] lg:h-[64px] lg:w-[225px]">
                        <TextPressure
                          text="Cook"
                          fontFamily="var(--font-display), Georgia, serif"
                          flex={false}
                          alpha={false}
                          stroke={false}
                          width={true}
                          weight={true}
                          italic={true}
                          textColor="#0f0b08"
                          minFontSize={34}
                          maxFontSize={66}
                        />
                      </div>
                      <span className="mt-1 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff7a00] text-white shadow-[0_18px_36px_rgba(255,122,0,0.3)]">
                        <Bot className="h-8 w-8" />
                      </span>
                    </div>

                    <div className="h-[66px] w-[320px] overflow-hidden md:h-[76px] md:w-[390px] lg:h-[64px] lg:w-[340px]">
                      <TextPressure
                        text="Discover"
                        fontFamily="var(--font-display), Georgia, serif"
                        flex={false}
                        alpha={false}
                        stroke={false}
                        width={true}
                        weight={true}
                        italic={true}
                        textColor="#0f0b08"
                        minFontSize={34}
                        maxFontSize={72}
                      />
                    </div>

                    <div className="h-[66px] w-[270px] overflow-hidden md:h-[76px] md:w-[320px] lg:h-[64px] lg:w-[280px]">
                      <TextPressure
                        text="Serve"
                        fontFamily="var(--font-display), Georgia, serif"
                        flex={false}
                        alpha={false}
                        stroke={false}
                        width={true}
                        weight={true}
                        italic={true}
                        textColor="#0f0b08"
                        minFontSize={34}
                        maxFontSize={68}
                      />
                    </div>
                  </div>
                  <p className="mt-3 max-w-[430px] text-base leading-7 text-[#7a6b5d] lg:leading-6">
                    An AI pantry experience that reads what is available, turns it into recipe ideas, and keeps the whole cooking flow elegant.
                  </p>
                </div>
                <HeroShowcase />
              </div>
            </section>

          </div>

          <aside className="space-y-3 lg:row-span-1 lg:h-full">
            <section data-hero-card className="glass-panel rounded-[30px] px-4 py-4 lg:h-full">
              <div className="mb-3 flex justify-center">
                <div className="relative h-[145px] w-[145px] lg:h-[150px] lg:w-[150px]">
                  <img
                    src={heroImages.featuredPizza}
                    alt="Mushroom pizza with tomato"
                    className="h-full w-full rounded-full object-cover shadow-[0_18px_44px_rgba(57,34,19,0.24)]"
                  />
                </div>
              </div>
              <div className="rounded-full border-2 border-[#ff9f45] px-4 py-2.5 text-center text-[1.95rem] font-semibold leading-tight text-[#ff7a00] lg:text-[2rem]">
                Mushroom Pizza With Tomato
              </div>
              <div className="mt-5 space-y-3">
                {nutritionStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`ml-auto flex ${item.width} items-center gap-3 rounded-full bg-[#ff7a00] px-3 py-3 text-white shadow-[0_14px_32px_rgba(255,122,0,0.18)] lg:py-3.5`}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#ff7a00]">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="text-base font-semibold lg:text-[1.05rem]">
                        {item.label}: {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </aside>

          <section data-hero-card className="glass-panel rounded-[30px] px-4 py-4 lg:col-span-3 lg:px-5 lg:py-4">
            <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_220px] lg:items-stretch">
              <Link
                href="/pantry"
                className="group rounded-[24px] border border-[#f1dfce] bg-[#fffdf9] px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#9e8974]">Quick action</p>
                    <p className="mt-1 text-[1.5rem] font-semibold leading-tight text-[#26201c]">Build Pantry Plan</p>
                    <p className="mt-2 text-sm leading-6 text-[#7a6b5d]">
                      Put in what you have, check matching recipes, then cook the best pick in minutes.
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-6 w-6 text-[#8f7f72] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </Link>

              <div className="rounded-[24px] border border-[#f1dfce] bg-[#fffdf9] px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={heroImages.communityChef} alt="Community chef" className="h-12 w-12 rounded-full object-cover shadow-[0_12px_24px_rgba(30,22,16,0.16)]" />
                    <div>
                      <p className="text-2xl font-semibold text-[#26201c]">100k+</p>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#9e8974]">Food creators</p>
                    </div>
                  </div>
                  <Link href="/signup" className="rounded-full border-2 border-[#ff9f45] px-5 py-2 text-base font-medium text-[#2d241f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#fff6ec]">
                    Join Now
                  </Link>
                </div>
                <div className="my-3 h-px bg-[#d7c8b8]" />
                <p className="text-[1.35rem] leading-[1.35] text-[#47392e]">
                  Join our 100k+ community of modern home cooks using AI to turn pantry data into plated meals.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#f1dfce] bg-[#fffdf9] px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-[#9e8974]">Tonight&apos;s flow</p>
                <div className="mt-3 space-y-2">
                  <div className="rounded-full bg-[#fff1df] px-3 py-2 text-sm font-medium text-[#5b4a3c]">Check pantry match</div>
                  <div className="rounded-full bg-[#fff1df] px-3 py-2 text-sm font-medium text-[#5b4a3c]">Pick best-fit recipe</div>
                  <div className="rounded-full bg-[#fff1df] px-3 py-2 text-sm font-medium text-[#5b4a3c]">Cook with AI tips</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  light = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  light?: boolean;
}) {
  return (
    <div className={`rounded-[22px] px-3 py-3 ${light ? "bg-white text-[#2d241f]" : "bg-[#fff1df] text-[#2d241f]"} lg:min-h-[14.5rem]`}>
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#fff3e2] text-[#ff7a00] shadow-[inset_0_0_0_1px_rgba(255,122,0,0.12)]">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs uppercase tracking-[0.14em] text-[#8d7b6e]">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      <p className="mt-3 text-sm leading-5 text-[#6f6258]">
        {label === "Cook status" ? "Ready to plate with balanced pantry coverage." : "Lean weekday portion with a clean macro profile."}
      </p>
    </div>
  );
}

function HeroShowcase() {
  return (
    <div className="mt-2 lg:mt-2">
      <div className="relative h-[260px] overflow-hidden md:h-[300px] lg:h-[31vh] lg:min-h-[280px]">
        <img
          src={heroImages.aiCooking}
          alt="AI cooking assistant"
          className="h-full w-full rounded-[30px] object-cover shadow-[0_20px_42px_rgba(40,26,18,0.16)]"
        />
        <div className="absolute bottom-4 left-1/2 w-[230px] -translate-x-1/2 rounded-[32px] bg-white/80 px-3 py-3 shadow-[0_18px_40px_rgba(31,24,17,0.12)] backdrop-blur">
          <div className="grid gap-2 sm:grid-cols-2">
            {pantrySignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div key={signal.label} className="rounded-[20px] bg-white px-3 py-3">
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#fff3e2] text-[#ff7a00]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#8d7b6e]">{signal.label}</p>
                  <p className="mt-1 text-xl font-semibold text-[#2d241f]">{signal.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {heroDetails.map((detail) => (
          <div key={detail.label} className="rounded-[22px] border border-[#f1dfce] bg-[#fffaf4] px-4 py-4 shadow-[0_16px_30px_rgba(48,35,28,0.06)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[#a0836d]">{detail.label}</p>
            <p className="mt-2 text-sm leading-6 text-[#54463a]">{detail.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
