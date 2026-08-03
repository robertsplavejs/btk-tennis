import clsx from "clsx";

type AvatarProps = {
  initials: string;
  size?: "sm" | "md" | "lg";
};

export function Avatar({
  initials,
  size = "md",
}: AvatarProps) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-neutral-100 font-semibold text-neutral-700 ring-1 ring-black/5",
        size === "sm" && "h-10 w-10 text-sm",
        size === "md" && "h-16 w-16 text-lg",
        size === "lg" && "h-20 w-20 text-xl"
      )}
    >
      {initials}
    </div>
  );
}