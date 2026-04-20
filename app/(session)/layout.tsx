import { SiteHeader } from "@/components/site-header";

/**
 * Flows ohne Footer: volle Viewport-Höhe für Pricing & Check (kein Seiten-Scroll).
 */
export default function SessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex h-dvh max-h-dvh flex-col overflow-hidden">
      <SiteHeader />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
