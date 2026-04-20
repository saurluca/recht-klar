"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ALLOWED_NEXT = new Set(["/check", "/check/finish"]);

function safeNext(formData: FormData): string {
  const raw = formData.get("next");
  if (typeof raw === "string" && ALLOWED_NEXT.has(raw)) return raw;
  return "/check";
}

export async function startCheckout(formData: FormData) {
  const jar = await cookies();
  jar.set("rk_paid", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  redirect(safeNext(formData));
}
