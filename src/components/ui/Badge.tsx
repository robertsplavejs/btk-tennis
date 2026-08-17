import type { ReactNode } from "react";
import clsx from "clsx";

export type BadgeVariant =
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "neutral";

export type BadgeColor =
  | "blue"
  | "green"
  | "red"
  | "amber"
  | "orange"
  | "gray"
  | "neutral";

const variants: Record<BadgeVariant, string> = {
  primary:
    "bg-[var(--btk-primary)]/10 text-[var(--btk-primary)]",

  success:
    "bg-green-100 text-green-700",

  danger:
    "bg-red-100 text-red-700",

  warning:
    "bg-amber-100 text-amber-700",

  neutral:
    "bg-neutral-100 text-neutral-700",
};

const colors: Record<BadgeColor, string> = {
  blue:
    "bg-blue-100 text-blue-700",

  green:
    "bg-green-100 text-green-700",

  red:
    "bg-red-100 text-red-700",

  amber:
    "bg-amber-100 text-amber-700",

  orange:
    "bg-orange-100 text-orange-700",

  gray:
    "bg-neutral-100 text-neutral-700",

  neutral:
    "bg-neutral-100 text-neutral-700",
};

type BadgeProps = {
  children: ReactNode;

  /**
   * Jaunais BTK UI Kit variants.
   */
  variant?: BadgeVariant;

  /**
   * Atpakaļsaderībai ar vecākajām BTK komponentēm.
   * Ja norādīts color, tas ir prioritārs pār variant.
   */
  color?: BadgeColor;

  className?: string;
};

export function Badge({
  children,
  variant = "neutral",
  color,
  className,
}: BadgeProps) {
  const variantClasses = color
    ? colors[color]
    : variants[variant];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variantClasses,
        className
      )}
    >
      {children}
    </span>
  );
}