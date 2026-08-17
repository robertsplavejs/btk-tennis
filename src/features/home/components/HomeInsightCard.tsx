import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { ForwardIndicator } from "@/components/ui/ForwardIndicator";
import type { ProductInsight } from "@/services/ProductInsightService";

export function HomeInsightCard({
  insight,
}: {
  insight: ProductInsight;
}) {
  return (
    <Link href={insight.href} className="block">
      <Card
        className="relative overflow-hidden px-5 py-3.5 shadow-[0_3px_12px_rgba(15,23,42,0.035)] transition active:scale-[0.995]"
      >
        <span className="absolute right-4 top-3.5">
          <ForwardIndicator />
        </span>
        <div className="pr-8">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-neutral-400" style={{ color: "#9ca3af", fontSize: 9, fontWeight: 900, letterSpacing: ".14em" }}>
              BTK ieskats
            </p>
            <p
              className="mt-2.5 text-[15px] font-bold leading-[1.35]"
              style={{ color: "#1f2937" }}
            >
              {insight.message}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
