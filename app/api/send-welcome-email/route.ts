import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { getWelcomeEmailHtml } from "@/lib/welcome-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("welcome_email_sent_at")
      .eq("id", user.id)
      .single();

    if (profile?.welcome_email_sent_at) {
      return NextResponse.json({ ok: true, skipped: "already sent" });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://thebubbleheros.com");
    const fromEmail = process.env.RESEND_FROM_EMAIL || "The Bubble Heroes <onboarding@resend.dev>";
    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Hero";

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Resend not configured" }, { status: 500 });
    }

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: user.email!,
      subject: `Welcome, ${userName}! You're a Bubble Hero 🫧`,
      html: getWelcomeEmailHtml(userName, siteUrl),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from("profiles")
      .update({ welcome_email_sent_at: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send" },
      { status: 500 }
    );
  }
}
