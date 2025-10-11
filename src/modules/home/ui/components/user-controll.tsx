"use client";

import { UseCurrentTheme } from "@/hooks/use-current-theme";
import { UserButton } from "@clerk/nextjs";

import { dark } from "@clerk/themes";

interface Props {
  showName?: boolean;
}

export const UserControll = ({ showName }: Props) => {
  const currentTheme = UseCurrentTheme();
  return (
    <UserButton
      showName={showName}
      appearance={{
        elements: {
          userButtonBox: "flex items-center gap-2.5",
          userButtonAvatarBox:
            "size-9 rounded-lg ring-1 ring-white/20 hover:ring-white/30 transition-all duration-300 shadow-lg shadow-black/20",
          userButtonTrigger:
            "rounded-lg hover:opacity-90 transition-all duration-300",

          // IMPORTANT: Yeh line text ko visible banayegi
          userButtonOuterIdentifier: "!text-gray-100 font-medium text-sm",

          // Dropdown/Popover styling
          userButtonPopoverCard:
            "bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl mt-2",
          userButtonPopoverActionButton:
            "text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-lg",
          userButtonPopoverActionButtonText: "text-gray-300 text-sm",
          userButtonPopoverActionButtonIcon: "text-gray-400",
          userButtonPopoverFooter: "border-t border-white/10 bg-white/5",

          // User info in dropdown
          userPreviewMainIdentifier: "!text-gray-100 font-semibold",
          userPreviewSecondaryIdentifier: "!text-gray-400 text-xs",
        },
        baseTheme: currentTheme === "dark" ? dark : undefined,
      }}
    />
  );
};
