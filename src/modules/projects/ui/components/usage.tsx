import { Button } from "@/components/ui/button";
import { formatDuration, intervalToDuration } from "date-fns";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  point: number;
  msBeforeNext: number;
}

export const Usage = ({ point, msBeforeNext }: Props) => {
  return (
    <div className="rounded-t-xl bg-gradient-to-br from-background via-background to-background/95 border border-b-0 p-4 shadow-sm">
      <div className="flex items-center gap-x-3">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {point}
            </p>
            <p className="text-sm font-medium text-muted-foreground">
              credits available
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Renews in{" "}
            <span className="font-semibold text-foreground/70">
              {formatDuration(
                intervalToDuration({
                  start: new Date(),
                  end: new Date(Date.now() + msBeforeNext),
                }),
                { format: ["months", "days", "hours"] }
              )}
            </span>
          </p>
        </div>
        <Button
          asChild
          size="sm"
          className="ml-auto bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] font-medium"
        >
          <Link href="/pricing" className="flex items-center gap-1.5">
            <CrownIcon className="w-4 h-4" />
            Upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
};
