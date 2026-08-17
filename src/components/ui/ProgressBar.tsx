import clsx from "clsx";

type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({
  value,
  className,
}: ProgressBarProps) {
  const progress = Math.max(
    0,
    Math.min(value, 100)
  );

  return (
    <div
      className={clsx(
        "h-2 overflow-hidden rounded-full bg-neutral-100",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-[var(--btk-primary)] transition-all"
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  );
}