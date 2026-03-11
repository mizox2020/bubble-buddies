import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") || "signup";
  const redirectTo = searchParams.get("redirect_to") || "/dashboard";

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || request.nextUrl.origin;

  if (!tokenHash) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=Invalid+confirmation+link`
    );
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const otpType =
    type === "signup" || type === "magiclink" ? "email" : type;

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: otpType as "email" | "recovery" | "invite" | "email_change",
  });

  if (error) {
    return NextResponse.redirect(
      `${siteUrl}/login?error=${encodeURIComponent(error.message)}`
    );
  }

  // Fire-and-forget welcome email
  const origin = request.nextUrl.origin;
  fetch(`${origin}/api/send-welcome-email`, {
    method: "POST",
    headers: { cookie: cookieStore.toString() },
  }).catch(() => {});

  return NextResponse.redirect(`${siteUrl}${redirectTo}`);
}
