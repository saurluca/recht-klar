import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Scale } from "lucide-react";

const LONG_TEXT =
  "Recht-Klar bietet ausschließlich unverbindliche rechtliche Information auf Basis von KI-gestützter Musteranalyse, keine Rechtsberatung im Sinne des § 2 RDG. Prozentangaben und Kostenschätzungen sind grobe Orientierung, keine Garantie. Für eine verbindliche Einschätzung wende dich an eine anwaltliche Beratung.";

const SHORT_TEXT =
  "Keine Rechtsberatung – nur unverbindliche Information (§ 2 RDG).";

type DisclaimerProps = {
  variant?: "short" | "long";
  className?: string;
  asAlert?: boolean;
};

export function Disclaimer({
  variant = "long",
  className,
  asAlert = true,
}: DisclaimerProps) {
  const text = variant === "short" ? SHORT_TEXT : LONG_TEXT;

  if (!asAlert) {
    return (
      <p
        className={cn(
          "text-muted-foreground text-sm leading-relaxed",
          className,
        )}
      >
        {text}
      </p>
    );
  }

  return (
    <Alert className={cn("border-border bg-card/80", className)}>
      <Scale className="size-4" />
      <AlertTitle className="text-sm font-medium">Hinweis</AlertTitle>
      <AlertDescription className="text-muted-foreground text-sm leading-relaxed">
        {text}
      </AlertDescription>
    </Alert>
  );
}
