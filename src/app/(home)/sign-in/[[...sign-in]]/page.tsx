"use client";

import { UseCurrentTheme } from "@/hooks/use-current-theme";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  const currentTheme = UseCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignIn
            appearance={{
              baseTheme: currentTheme === "dark" ? dark : undefined,
              elements: {
                cardBox: "border-none! shadow-none! rounded-xl!",
                card: "backdrop-blur-xl bg-gray-100/40 dark:bg-gray-800/40 border border-gray-300/20 dark:border-gray-600/20 shadow-2xl rounded-xl",
                headerTitle: "text-gray-800 dark:text-gray-100",
                headerSubtitle: "text-gray-600 dark:text-gray-400",
                socialButtonsBlockButton:
                  "backdrop-blur-md bg-gray-200/30 dark:bg-gray-700/30 border border-gray-300/40 dark:border-gray-600/40 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all",
                formButtonPrimary:
                  "bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 hover:from-gray-800 hover:to-black dark:hover:from-gray-700 dark:hover:to-gray-900 transition-all shadow-lg",
                formFieldInput:
                  "backdrop-blur-md bg-gray-100/30 dark:bg-gray-700/30 border border-gray-300/40 dark:border-gray-600/40 focus:border-gray-400/60 dark:focus:border-gray-500/60 transition-all",
                footerActionLink:
                  "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100",
                dividerLine:
                  "bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent",
                dividerText: "text-gray-500 dark:text-gray-400",
              },
              variables: {
                borderRadius: "0.75rem",
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
