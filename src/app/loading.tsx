export default function Loading() {
  return (
    <div
      className="grid animate-pulse gap-4 px-4 pb-6 pt-4"
      aria-label="Ielādē sadaļu"
      aria-busy="true"
    >
      <div className="h-36 rounded-[28px] bg-neutral-100" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-20 rounded-[20px] bg-neutral-100" />
        <div className="h-20 rounded-[20px] bg-neutral-100" />
        <div className="h-20 rounded-[20px] bg-neutral-100" />
      </div>
      <div className="h-28 rounded-[24px] bg-neutral-100" />
      <div className="h-28 rounded-[24px] bg-neutral-100" />
    </div>
  );
}
