"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedbackPrintBarProps = {
  /** `compact`: same row as other interview actions. `default`: centered block with helper text. */
  variant?: "default" | "compact";
  className?: string;
};

export function FeedbackPrintBar({
  variant = "default",
  className,
}: FeedbackPrintBarProps) {
  const button = (
    <Button
      type="button"
      className={cn(
        "btn-secondary min-h-10 gap-2",
        variant === "compact" && "flex-1",
        variant === "default" && "min-h-11 px-6",
        className
      )}
      onClick={() => window.print()}
    >
      <Printer className="size-[18px] shrink-0" aria-hidden />
      <span className="text-sm font-semibold text-primary-200">
        Print / Save as PDF
      </span>
    </Button>
  );

  if (variant === "compact") {
    return button;
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 print:hidden",
        className
      )}
    >
      {button}
      <p className="max-w-md text-center text-sm text-light-100">
        Opens your browser print dialog — choose &quot;Save as PDF&quot; or a
        printer.
      </p>
    </div>
  );
}
