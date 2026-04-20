"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function startCheckout() {
  const jar = await cookies();
  jar.set("rk_paid", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  redirect("/check");
}
