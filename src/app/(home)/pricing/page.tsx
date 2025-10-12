"use client";

import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import { UseCurrentTheme } from "@/hooks/use-current-theme";
import { dark } from "@clerk/themes";

const Page = () => {
  const currentTheme = UseCurrentTheme();
  return (
    <div className="flex flex-col max-w-4xl mx-auto w-full px-4">
      <section className="space-y-12 pt-[16vh] 2xl:pt-48 pb-16">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <Image
              src="/innovate.svg"
              alt="innovate"
              width={64}
              height={64}
              className="drop-shadow-lg"
            />
          </div>

          <div className="space-y-4 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight">
              Choose Your Perfect Plan
            </h1>
            <p className="text-muted-foreground text-center text-base md:text-lg leading-relaxed px-4">
              Unlock powerful features and scale your growth with flexible
              pricing. Start free, upgrade anytime, and only pay for what you
              need.
            </p>
          </div>
        </div>

        {/* Pricing Table with Sea Green Glass Theme */}
        <div className="mt-12">
          <PricingTable
            appearance={{
              baseTheme: currentTheme === "dark" ? dark : undefined,
              elements: {
                pricingTableCard:
                  "border-2 border-teal-200/60 dark:border-teal-400/40 shadow-2xl rounded-2xl backdrop-blur-md bg-gradient-to-br from-teal-50/80 via-cyan-50/70 to-emerald-50/80 dark:from-teal-950/50 dark:via-cyan-950/40 dark:to-emerald-950/50 hover:shadow-teal-200/50 dark:hover:shadow-teal-500/30 hover:scale-[1.02] hover:border-teal-300/80 dark:hover:border-teal-400/60 transition-all duration-300 ease-out",
                pricingTableCardHeader: "pb-8 pt-2",
                pricingTableCardTitle:
                  "text-2xl md:text-3xl font-bold text-teal-900 dark:text-teal-100",
                pricingTableCardPrice:
                  "text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-emerald-600 dark:from-teal-400 dark:via-cyan-400 dark:to-emerald-400",
                pricingTableCardButton:
                  "rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600",
                pricingTableCardFeatureList: "space-y-4 pt-4",
                pricingTableCardFeature: "text-gray-700 dark:text-gray-300",
              },
            }}
          />
        </div>

        {/* Trust Section */}
        <div className="flex flex-col items-center space-y-6 pt-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm md:text-base">
            <div className="flex items-center gap-2.5 text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              <svg
                className="w-5 h-5 text-teal-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              <svg
                className="w-5 h-5 text-teal-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-2.5 text-muted-foreground hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              <svg
                className="w-5 h-5 text-teal-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Cancel anytime</span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-muted-foreground/80 text-center max-w-xl px-4">
            Join thousands of satisfied customers who trust us with their
            business. Questions? Our support team is here to help 24/7.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;
