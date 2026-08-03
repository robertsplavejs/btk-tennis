import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "h-11 rounded-xl px-5 text-sm font-semibold transition-colors",
        variant === "primary" &&
          "bg-black text-white hover:bg-neutral-800",
        variant === "secondary" &&
          "bg-neutral-100 text-black hover:bg-neutral-200",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}