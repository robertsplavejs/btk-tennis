"use client";

import { useState } from "react";

export function CopyInvitationLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="mt-3 flex h-11 w-full items-center justify-center rounded-xl bg-black px-4 text-sm font-semibold text-white"
    >
      {copied ? "Saite nokopēta" : "Kopēt reģistrācijas saiti"}
    </button>
  );
}
