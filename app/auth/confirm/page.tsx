"use client";

import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function AuthConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type") || "signup";
    const redirectTo = searchParams.get("redirect_to");

    if (!tokenHash) {
      setStatus("error");
      setMessage("Invalid confirmation link. Please request a new one.");
      return;
    }

    const verify = async () => {
      const supabase = createClient();
      // signup/magiclink map to email per Supabase docs
      const otpType = type === "signup" || type === "magiclink" ? "email" : type;
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: otpType as "email" | "recovery" | "invite" | "email_change",
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      setStatus("success");
      const redirect = redirectTo || "/dashboard";
      setTimeout(() => router.push(redirect), 1500);
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-blue-50 to-pink-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-sky-200 p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Confirming your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">You&apos;re all set!</h1>
            <p className="text-gray-600">Redirecting you to your dashboard...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <a href="/login" className="text-brand-pink font-medium hover:underline">
              Back to login
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 via-blue-50 to-pink-50">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthConfirmContent />
    </Suspense>
  );
}
