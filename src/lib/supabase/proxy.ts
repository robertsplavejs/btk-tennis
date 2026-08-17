import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutePrefixes = [
  "/profile",
  "/players",
  "/matches",
  "/notifications",
  "/admin",
  "/account",
];

function copyResponseCookies(
  source: NextResponse,
  target: NextResponse
) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });

  return target;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Trūkst NEXT_PUBLIC_SUPABASE_URL vērtības .env.local failā."
    );
  }

  if (!supabasePublishableKey) {
    throw new Error(
      "Trūkst NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY vērtības .env.local failā."
    );
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              supabaseResponse.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const userId =
    typeof claimsData?.claims?.sub === "string"
      ? claimsData.claims.sub
      : null;

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    protectedRoutePrefixes.some(
      (prefix) =>
        pathname === prefix ||
        pathname.startsWith(`${prefix}/`)
    );

  if (isProtectedRoute && !userId) {
    const loginUrl = request.nextUrl.clone();

    loginUrl.pathname = "/login";
    loginUrl.searchParams.set(
      "error",
      "Lai atvērtu šo sadaļu, nepieciešams ielogoties."
    );

    return copyResponseCookies(
      supabaseResponse,
      NextResponse.redirect(loginUrl)
    );
  }

  if (
    userId &&
    (pathname === "/login" ||
      pathname === "/register")
  ) {
    const homeUrl = request.nextUrl.clone();

    homeUrl.pathname = "/";
    homeUrl.search = "";

    return copyResponseCookies(
      supabaseResponse,
      NextResponse.redirect(homeUrl)
    );
  }

  if (
    userId &&
    (pathname === "/admin" ||
      pathname.startsWith("/admin/"))
  ) {
    const { data: account, error } =
      await supabase
        .from("user_accounts")
        .select("is_admin")
        .eq("user_id", userId)
        .maybeSingle();

    const isAdmin =
      !error && account?.is_admin === true;

    if (!isAdmin) {
      const homeUrl = request.nextUrl.clone();

      homeUrl.pathname = "/";
      homeUrl.searchParams.set(
        "error",
        "Šī sadaļa ir pieejama tikai administratoram."
      );

      return copyResponseCookies(
        supabaseResponse,
        NextResponse.redirect(homeUrl)
      );
    }
  }

  return supabaseResponse;
}
