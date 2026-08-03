import clsx from "clsx";

type BadgeProps = {
  children: React.ReactNode;
  color?: "green" | "orange" | "red" | "gray";
};

export function Badge({
  children,
  color = "gray",
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        color === "green" &&
          "bg-green-50 text-green-700",
        color === "orange" &&
          "bg-orange-50 text-orange-700",
        color === "red" &&
          "bg-red-50 text-red-700",
        color === "gray" &&
          "bg-neutral-100 text-neutral-700"
      )}
    >
      {children}
    </span>
  );
}