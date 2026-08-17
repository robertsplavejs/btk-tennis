import type { ReactNode } from "react";
import clsx from "clsx";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={clsx(
        "flex items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-black">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm leading-5 text-neutral-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}