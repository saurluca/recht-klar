import { notFound } from "next/navigation";
import { ChatIntake } from "@/components/chat-intake";
import { getAreaBySlug } from "@/lib/legal-areas";

type Props = {
  params: Promise<{ area: string }>;
};

export default async function CheckAreaPage({ params }: Props) {
  const { area: slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();
  return <ChatIntake area={area} />;
}
