type SectionHeaderProps = {
  title: string;
  action?: string;
};

export function SectionHeader({
  title,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      {action && (
        <button className="text-sm text-neutral-500 hover:text-black transition-colors">
          {action}
        </button>
      )}
    </div>
  );
}