import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-6 py-12 text-center">
      <div className="max-w-sm">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7ca000]">
          404
        </p>
        <h1 className="mt-3 text-2xl font-black text-neutral-950">
          Šī sadaļa nav atrasta
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          Iespējams, saite vairs nav aktuāla vai pieprasītais ieraksts nepastāv.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-neutral-950 px-5 text-sm font-bold text-white no-underline"
        >
          Atgriezties sākumā
        </Link>
      </div>
    </main>
  );
}
