import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const recoveryUrl = new URL("/auth/recovery", request.url);

  if (code) {
    recoveryUrl.searchParams.set("code", code);
    return NextResponse.redirect(recoveryUrl);
  }

  if (tokenHash && type === "recovery") {
    recoveryUrl.searchParams.set("token_hash", tokenHash);
    recoveryUrl.searchParams.set("type", type);
    return NextResponse.redirect(recoveryUrl);
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set(
    "error",
    "Paroles atjaunošanas saite nav derīga vai tās termiņš ir beidzies."
  );
  return NextResponse.redirect(loginUrl);
}
