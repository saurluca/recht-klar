import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const paid = req.cookies.get("rk_paid")?.value === "1";
  if (!paid) {
    const url = req.nextUrl.clone();
    url.pathname = "/pricing";
    if (req.nextUrl.pathname.startsWith("/check/finish")) {
      url.searchParams.set("next", "/check/finish");
    }
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/check/result", "/check/finish"],
};
