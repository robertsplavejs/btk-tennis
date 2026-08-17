import { ChevronRight } from "lucide-react";

export function ForwardIndicator({
  onDark = false,
}: {
  onDark?: boolean;
}) {
  return (
    <span
      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
        onDark
          ? "bg-white/10 text-white/55"
          : "bg-neutral-50 text-neutral-400"
      }`}
    >
      <ChevronRight size={14} strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}
