"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ResultClient = dynamic(
  () =>
    import("./result-client").then((mod) => ({ default: mod.ResultClient })),
  {
    ssr: false,
    loading: () => (
      <main className="mx-auto max-w-4xl flex-1 space-y-4 px-6 py-12 md:px-8">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </main>
    ),
  },
);

export function ResultBoundary() {
  return <ResultClient />;
}
