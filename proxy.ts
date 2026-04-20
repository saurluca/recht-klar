import { NextResponse, type NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const paid = req.cookies.get("rk_paid")?.value === "1";
  if (!paid) {
    const url = req.nextUrl.clone();
    url.pathname = "/pricing";
    url.searchParams.set("from", "check");
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/check/:path*"],
};
